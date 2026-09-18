import {
  appointments as seedAppointments,
  batches as seedBatches,
  doctors as seedDoctors,
  drugs,
  facilities as seedFacilities,
  forecasts,
  patients as seedPatients,
  prescriptions as seedRx
} from '~/data/seed'
import { extractSymptoms, labsFor, scoreEsi } from '~/utils/nlp'
import type {
  Appointment,
  Batch,
  Doctor,
  Facility,
  Patient,
  Prescription,
  Requisition,
  TransferRec,
  TriageResult
} from '~/utils/types'

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

export function usePlatform() {
  const facilities = useState<Facility[]>('facilities', () => clone(seedFacilities))
  const doctors = useState<Doctor[]>('doctors', () => clone(seedDoctors))
  const patients = useState<Patient[]>('patients', () => clone(seedPatients))
  const appointments = useState<Appointment[]>('appointments', () => clone(seedAppointments))
  const batches = useState<Batch[]>('batches', () => clone(seedBatches))
  const prescriptions = useState<Prescription[]>('prescriptions', () => clone(seedRx))
  const requisitions = useState<Requisition[]>('requisitions', () => [])
  const transfers = useState<TransferRec[]>('transfers', () => [])
  const flash = useState<string>('flash', () => '')
  const lastTriage = useState<TriageResult | null>('lastTriage', () => null)
  const clock = useState('clock', () => '10:28')

  const facById = (id: string) => facilities.value.find(f => f.id === id)
  const docById = (id: string) => doctors.value.find(d => d.id === id)
  const patientById = (id: string) => patients.value.find(p => p.id === id)
  const drugById = (id: string) => drugs.find(d => d.id === id)

  const rhu1Load = computed(() => {
    const f = facById('rhu1')
    if (!f) return 0
    return Math.round((f.walkInUsed / f.walkInCap) * 100)
  })

  const criticalBatches = computed(() =>
    batches.value.filter(b => b.qty <= 20 || b.expiry <= '2026-11-01')
  )

  const waitingWalkIns = computed(() =>
    appointments.value.filter(a => a.channel === 'walk-in' && a.status === 'reserved' && !a.patientName)
  )

  function pickDoctor(specialty: string): { doctor: Doctor; overflowToGp: boolean } {
    const specialists = doctors.value
      .filter(d => d.specialty === specialty)
      .sort((a, b) => a.todayLoad / a.dailyCap - b.todayLoad / b.dailyCap)
    const open = specialists.find(d => d.todayLoad < d.dailyCap)
    if (open) return { doctor: open, overflowToGp: false }
    const gps = doctors.value
      .filter(d => d.specialty === 'General Practice')
      .sort((a, b) => a.todayLoad / a.dailyCap - b.todayLoad / b.dailyCap)
    return { doctor: gps[0] ?? doctors.value[0], overflowToGp: specialty !== 'General Practice' }
  }

  function runTriage(complaint: string, patient: Patient): TriageResult {
    const hits = extractSymptoms(complaint)
    const scored = scoreEsi(hits, patient.age, complaint)
    let specialty = hits[0]?.specialty || 'General Practice'
    if (patient.age < 12 && specialty === 'General Practice') specialty = 'Pediatrics'
    if (patient.conditions.includes('Pregnancy 28w') && hits.some(h => h.system === 'Obstetric' || /bleed|dugo/.test(complaint.toLowerCase()))) {
      specialty = 'OB-GYN'
    }
    if (scored.bypass) specialty = 'Emergency Medicine'

    const picked = pickDoctor(specialty)
    const facility = facById(picked.doctor.facilityId) ?? facilities.value[1]
    const labs = scored.bypass ? labsFor('Emergency Medicine') : labsFor(specialty === picked.doctor.specialty ? specialty : 'General Practice')

    const rationale = [
      hits.length
        ? `Mapped ${hits.length} cue(s) across ${[...new Set(hits.map(h => h.system))].join(', ')}.`
        : 'No lexicon match — defaulting to general outpatient triage.',
      `ESI ${scored.esi} (${scored.label}) using the municipal 5-level scale.`,
      scored.bypass
        ? 'Queue bypass armed: alert City Infirmary ER and municipal ambulance dispatch.'
        : `Target clinic: ${specialty}.`,
      picked.overflowToGp
        ? `${specialty} daily cap reached — surplus routed to GP ${picked.doctor.name} with prerequisite labs queued.`
        : `Assigned ${picked.doctor.name} (${picked.doctor.role}) at ${facility.name}. Load ${picked.doctor.todayLoad}/${picked.doctor.dailyCap}.`
    ]

    const result: TriageResult = {
      complaint,
      hits,
      esi: scored.esi,
      esiLabel: scored.label,
      specialty,
      bypassEr: scored.bypass,
      transport: scored.transport,
      doctor: picked.doctor,
      facility,
      overflowToGp: picked.overflowToGp,
      labs,
      rationale
    }
    lastTriage.value = result
    flash.value = scored.bypass
      ? `ESI ${scored.esi}: ER bypass + transport dispatch from ${patient.barangay}.`
      : `Routed to ${specialty} · ${picked.doctor.name}`
    return result
  }

  function commitTriageToSchedule(patient: Patient, result: TriageResult) {
    if (result.bypassEr) {
      emergencyInsert(patient, result)
      return
    }
    const open = appointments.value.find(
      a => a.facilityId === result.facility?.id && !a.patientName && a.status === 'reserved'
    ) || appointments.value.find(a => !a.patientName && a.status === 'reserved')
    if (!open || !result.doctor) {
      flash.value = 'No open slot — offer next-morning priority online booking.'
      return
    }
    open.patientId = patient.id
    open.patientName = patient.name
    open.doctorId = result.doctor.id
    open.specialty = result.overflowToGp ? 'General Practice' : result.specialty
    open.esi = result.esi
    open.labs = result.labs
    open.channel = 'walk-in'
    result.doctor.todayLoad += 1
    const fac = facById(open.facilityId)
    if (fac && fac.type !== 'ER') fac.walkInUsed = Math.min(fac.walkInCap, fac.walkInUsed + 1)
    flash.value = `Walk-in assigned ${open.time} at ${facById(open.facilityId)?.name}.`
  }

  function bookOnline(patient: Patient, appointmentId: string) {
    const slot = appointments.value.find(a => a.id === appointmentId)
    if (!slot || slot.patientName) {
      flash.value = 'That window is no longer open.'
      return
    }
    slot.patientId = patient.id
    slot.patientName = patient.name
    slot.channel = 'online'
    slot.status = 'reserved'
    flash.value = `SMS/PWA confirmation queued for ${patient.name}: arrive 5–10 minutes before ${slot.time}.`
  }

  function registerWalkIn(patient: Patient, facilityId: string, complaint = 'fever and headache') {
    const fac = facById(facilityId)
    if (!fac) return
    if (fac.walkInUsed >= fac.walkInCap) {
      const alt = facilities.value
        .filter(f => f.id !== facilityId && f.type !== 'ER' && f.walkInUsed < f.walkInCap)
        .sort((a, b) => a.walkInUsed / a.walkInCap - b.walkInUsed / b.walkInCap)[0]
      flash.value = alt
        ? `${fac.name} walk-in buffer is full. Reassign to ${alt.name} (${alt.walkInUsed}/${alt.walkInCap}) or book a prioritized 08:00 slot tomorrow.`
        : `${fac.name} and satellites are at cap. Book a prioritized online slot for tomorrow morning.`
      return
    }
    if (!patients.value.some(p => p.id === patient.id)) patients.value.push(patient)
    const result = runTriage(complaint, patient)
    commitTriageToSchedule(patient, { ...result, facility: fac })
  }

  function checkIn(id: string) {
    const a = appointments.value.find(x => x.id === id)
    if (!a) return
    a.status = 'checked-in'
    flash.value = `${a.patientName} checked in for ${a.time}.`
  }

  function releaseNoShows() {
    let n = 0
    for (const a of appointments.value) {
      if (a.channel === 'online' && a.status === 'reserved' && a.patientName && a.time <= clock.value) {
        a.status = 'released'
        a.channel = 'walk-in'
        const name = a.patientName
        a.patientName = undefined
        a.patientId = undefined
        n++
        flash.value = `${name}'s ${a.time} window released after 15-minute no-show. Offered to walk-in buffer.`
      }
    }
    if (!n) flash.value = `No online holds earlier than simulated clock ${clock.value}.`
  }

  function emergencyInsert(patient: Patient, result?: TriageResult) {
    const target = appointments.value.find(a => a.facilityId === 'er') 
      ?? appointments.value.find(a => a.status === 'reserved')
      ?? appointments.value[0]
    const bumped = appointments.value
      .filter(a => a.facilityId === (target?.facilityId ?? 'rhu1') && a.status === 'reserved' && a.esi && a.esi >= 4 && a.patientName)
    const firstBumped = bumped[0]
    const slot = appointments.value.find(a => !a.patientName) ?? target
    if (!slot) return
    if (firstBumped) {
      firstBumped.status = 'rolled'
      flash.value = `Emergency override: ${patient.name} takes next window. SMS sent to ${firstBumped.patientName} — slot rolled +15 minutes.`
    } else {
      flash.value = `Emergency case ${patient.name} inserted. Municipal transport notified.`
    }
    slot.patientId = patient.id
    slot.patientName = patient.name
    slot.channel = 'emergency'
    slot.status = 'checked-in'
    slot.specialty = 'Emergency Medicine'
    slot.doctorId = 'd-er'
    slot.esi = result?.esi ?? 1
    slot.labs = result?.labs ?? labsFor('Emergency Medicine')
    slot.facilityId = 'er'
  }

  function createRx(patient: Patient, doctor: Doctor, drugIds: string[], qty: number) {
    const alerts: string[] = []
    const items = drugIds.map(id => {
      const drug = drugById(id)!
      if (patient.allergies.some(a => drug.generic.toLowerCase().includes(a.toLowerCase()))) {
        alerts.push(`Allergy block: ${patient.name} listed ${patient.allergies.join(', ')} vs ${drug.generic}.`)
      }
      for (const med of patient.meds) {
        if (drug.interactsWith.includes(med)) {
          alerts.push(`Interaction: ${drug.generic} × ${med} (BP control may attenuate).`)
        }
        if (drug.generic.toLowerCase().includes(med.toLowerCase())) {
          alerts.push(`Duplicate therapy risk with current ${med}.`)
        }
      }
      return { drugId: id, qty, sig: 'As directed · Konsulta generic', dispensed: 0 }
    })
    const rx: Prescription = {
      id: nextId('rx'),
      qr: `RX-VLC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      patientId: patient.id,
      doctorId: doctor.id,
      facilityId: doctor.facilityId,
      items,
      status: alerts.some(a => a.startsWith('Allergy')) ? 'issued' : 'issued',
      alerts,
      issuedAt: `2026-09-18 ${clock.value}`
    }
    prescriptions.value.unshift(rx)
    flash.value = alerts.length
      ? `e-Rx ${rx.qr} issued with ${alerts.length} clinical alert(s).`
      : `e-Rx ${rx.qr} signed by ${doctor.name} · PRC ${doctor.prc}.`
    return rx
  }

  function fefoPick(drugId: string, facilityId: string, need: number) {
    const rows = batches.value
      .filter(b => b.drugId === drugId && b.facilityId === facilityId && b.qty > 0)
      .sort((a, b) => a.expiry.localeCompare(b.expiry))
    let remaining = need
    const used: { batch: Batch; qty: number }[] = []
    for (const b of rows) {
      const take = Math.min(b.qty, remaining)
      b.qty -= take
      remaining -= take
      used.push({ batch: b, qty: take })
      if (remaining === 0) break
    }
    return { used, remaining }
  }

  function fulfill(qr: string, facilityId: string) {
    const rx = prescriptions.value.find(r => r.qr.toUpperCase() === qr.toUpperCase())
    if (!rx) {
      flash.value = 'QR not recognized or already voided.'
      return
    }
    const item = rx.items.find(i => i.dispensed < i.qty)
    if (!item) {
      flash.value = 'Prescription already fully dispensed. Single-use QR is closed.'
      return
    }
    const need = item.qty - item.dispensed
    const pick = fefoPick(item.drugId, facilityId, need)
    item.dispensed += need - pick.remaining
    if (pick.remaining > 0) {
      rx.status = 'partial'
      const peer = batches.value
        .filter(b => b.drugId === item.drugId && b.facilityId !== facilityId && b.qty >= pick.remaining)
        .sort((a, b) => a.expiry.localeCompare(b.expiry))[0]
      rx.voucherTo = peer?.facilityId
      rx.status = peer ? 'transferred' : 'partial'
      flash.value = peer
        ? `Partial fill ${item.dispensed}/${item.qty} ${drugById(item.drugId)?.generic}. Transfer voucher to ${facById(peer.facilityId)?.name}.`
        : `Partial fill only. ${pick.remaining} tablets still short in the network.`
    } else {
      rx.status = rx.items.every(i => i.dispensed >= i.qty) ? 'dispensed' : 'partial'
      flash.value = `FEFO release from lot ${pick.used[0]?.batch.lot}. QR ${rx.qr} ${rx.status}.`
    }
  }

  function stockOnHand(drugId: string, facilityId?: string) {
    return batches.value
      .filter(b => b.drugId === drugId && (!facilityId || b.facilityId === facilityId))
      .reduce((s, b) => s + b.qty, 0)
  }

  function tier(qty: number): 'Critical' | 'Moderate' | 'Optimal' {
    if (qty <= 20) return 'Critical'
    if (qty <= 80) return 'Moderate'
    return 'Optimal'
  }

  function recommendTransfers() {
    const recs: TransferRec[] = []
    for (const drug of drugs) {
      const byFac = facilities.value
        .filter(f => f.type !== 'ER')
        .map(f => ({ f, qty: stockOnHand(drug.id, f.id) }))
      const low = byFac.filter(x => x.qty <= 20).sort((a, b) => a.qty - b.qty)[0]
      const high = byFac.filter(x => x.qty >= 80).sort((a, b) => b.qty - a.qty)[0]
      if (low && high && low.f.id !== high.f.id) {
        recs.push({
          id: nextId('tr'),
          fromId: high.f.id,
          toId: low.f.id,
          drug: drug.generic,
          qty: Math.min(40, Math.floor((high.qty - low.qty) / 3)),
          reason: `Velocity imbalance: ${low.f.name} at ${low.qty} vs ${high.f.name} at ${high.qty}`
        })
      }
    }
    return recs.filter(r => r.qty > 0)
  }

  function executeTransfer(rec: TransferRec) {
    const drug = drugs.find(d => d.generic === rec.drug)
    if (!drug) return
    const pick = fefoPick(drug.id, rec.fromId, rec.qty)
    const moved = rec.qty - pick.remaining
    if (moved <= 0) return
    batches.value.push({
      id: nextId('b'),
      drugId: drug.id,
      facilityId: rec.toId,
      lot: pick.used[0]?.batch.lot ?? 'XFER',
      expiry: pick.used[0]?.batch.expiry ?? '2027-01-01',
      qty: moved
    })
    transfers.value.unshift({ ...rec, qty: moved })
    flash.value = `Moved ${moved} ${rec.drug} ${facById(rec.fromId)?.name} → ${facById(rec.toId)?.name}.`
  }

  function draftRequisition() {
    const lines = forecasts.map(f => {
      const drug = drugs.find(d => f.drug.startsWith(d.generic.split(' ')[0]))
      const onhand = drug ? stockOnHand(drug.id) : 0
      const gap = Math.max(0, f.projected - f.historical / 2 - onhand)
      return {
        drug: f.drug,
        qty: Math.round(gap || f.projected * 0.15),
        reason: `${f.driver}. Lead time 21 days · on-hand ${onhand}.`
      }
    }).filter(l => l.qty > 0)
    const req: Requisition = {
      id: nextId('PR'),
      createdAt: `18 Sep 2026 ${clock.value}`,
      lines,
      status: 'draft'
    }
    requisitions.value.unshift(req)
    flash.value = `Purchase requisition ${req.id} drafted for CHO Valencia (${req.lines.length} lines).`
    return req
  }

  function submitRequisition(id: string) {
    const r = requisitions.value.find(x => x.id === id)
    if (r) {
      r.status = 'submitted'
      flash.value = `${id} submitted to LGU Bids and Awards / City Health Office procurement.`
    }
  }

  function addWalkInPatient(name: string, age: number, barangay: string) {
    const p: Patient = {
      id: nextId('p'),
      name,
      age,
      sex: 'F',
      barangay,
      philhealth: '12-pending-konsulta',
      allergies: [],
      conditions: [],
      meds: []
    }
    patients.value.push(p)
    return p
  }

  return {
    facilities,
    doctors,
    patients,
    appointments,
    batches,
    prescriptions,
    requisitions,
    transfers,
    forecasts,
    drugs,
    flash,
    lastTriage,
    clock,
    rhu1Load,
    criticalBatches,
    waitingWalkIns,
    facById,
    docById,
    patientById,
    drugById,
    runTriage,
    commitTriageToSchedule,
    bookOnline,
    registerWalkIn,
    checkIn,
    releaseNoShows,
    emergencyInsert,
    createRx,
    fulfill,
    stockOnHand,
    tier,
    recommendTransfers,
    executeTransfer,
    draftRequisition,
    submitRequisition,
    addWalkInPatient
  }
}
