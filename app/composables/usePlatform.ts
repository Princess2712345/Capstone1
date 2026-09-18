import {
  appointments as seedAppointments,
  batches as seedBatches,
  doctors as seedDoctors,
  drugs as seedDrugs,
  facilities as seedFacilities,
  forecasts as seedForecasts,
  patients as seedPatients,
  prescriptions as seedRx
} from '~/data/seed'
import { extractSymptoms, labsFor, scoreEsi } from '~/utils/nlp'
import type {
  Appointment,
  AuditEvent,
  Batch,
  Doctor,
  Drug,
  Encounter,
  Facility,
  ForecastRow,
  Patient,
  Prescription,
  Requisition,
  TransferRec,
  TriageResult
} from '~/utils/types'

const STORE_KEY = 'vco-ops-v2'
const SERVICE_TIMES = [
  '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45',
  '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45',
  '15:00', '15:15', '15:30', '15:45'
]

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

function addMinutes(hhmm: string, minutes: number) {
  const [h, m] = hhmm.split(':').map(Number)
  const total = h * 60 + m + minutes
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60)
  const nh = Math.floor(wrapped / 60)
  const nm = wrapped % 60
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`
}

function csv(value: string) {
  return value.split(',').map(s => s.trim()).filter(Boolean)
}

export function usePlatform() {
  const { session } = useAuth()
  const facilities = useState<Facility[]>('facilities', () => clone(seedFacilities))
  const doctors = useState<Doctor[]>('doctors', () => clone(seedDoctors))
  const patients = useState<Patient[]>('patients', () => clone(seedPatients))
  const appointments = useState<Appointment[]>('appointments', () => clone(seedAppointments))
  const batches = useState<Batch[]>('batches', () => clone(seedBatches))
  const prescriptions = useState<Prescription[]>('prescriptions', () => clone(seedRx))
  const requisitions = useState<Requisition[]>('requisitions', () => [])
  const transfers = useState<TransferRec[]>('transfers', () => [])
  const drugs = useState<Drug[]>('drugs', () => clone(seedDrugs))
  const forecasts = useState<ForecastRow[]>('forecasts', () => clone(seedForecasts))
  const encounters = useState<Encounter[]>('encounters', () => [])
  const audits = useState<AuditEvent[]>('audits', () => [])
  const flash = useState<string>('flash', () => '')
  const lastTriage = useState<TriageResult | null>('lastTriage', () => null)
  const clock = useState('clock', () => '10:28')
  const query = useState('globalQuery', () => '')

  const facById = (id: string) => facilities.value.find(f => f.id === id)
  const docById = (id: string) => doctors.value.find(d => d.id === id)
  const patientById = (id: string) => patients.value.find(p => p.id === id)
  const drugById = (id: string) => drugs.value.find(d => d.id === id)

  const actor = () => session.value?.name ?? 'System'

  function stamp() {
    return `2026-09-18 ${clock.value}`
  }

  function log(action: string, detail: string) {
    audits.value.unshift({
      id: nextId('log'),
      at: stamp(),
      actor: actor(),
      action,
      detail
    })
  }

  function notify(message: string) {
    flash.value = message
  }

  const rhu1Load = computed(() => {
    const f = facById('rhu1')
    if (!f || !f.walkInCap) return 0
    return Math.round((f.walkInUsed / f.walkInCap) * 100)
  })

  const criticalBatches = computed(() =>
    batches.value.filter(b => b.qty <= 20 || b.expiry <= '2026-11-01')
  )

  const waitingWalkIns = computed(() =>
    appointments.value.filter(a => a.channel === 'walk-in' && (a.status === 'reserved' || a.status === 'open') && !a.patientName)
  )

  const inQueue = computed(() =>
    appointments.value.filter(a => a.patientName && a.status !== 'done' && a.status !== 'released' && a.status !== 'cancelled').length
  )

  function isOpen(a: Appointment) {
    return !a.patientName && (a.status === 'open' || a.status === 'reserved' || a.status === 'released')
  }

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

  function recordEncounter(partial: Omit<Encounter, 'id' | 'createdAt'>) {
    encounters.value.unshift({
      ...partial,
      id: nextId('enc'),
      createdAt: stamp()
    })
  }

  function runTriage(complaint: string, patient: Patient): TriageResult {
    const hits = extractSymptoms(complaint)
    const scored = scoreEsi(hits, patient.age, complaint)
    let specialty = hits[0]?.specialty || 'General Practice'
    if (patient.age < 12 && specialty === 'General Practice') specialty = 'Pediatrics'
    if (patient.conditions.some(c => /pregnan/i.test(c)) && hits.some(h => h.system === 'Obstetric' || /bleed|dugo/.test(complaint.toLowerCase()))) {
      specialty = 'OB-GYN'
    }
    if (scored.bypass) specialty = 'Emergency Medicine'

    const picked = pickDoctor(specialty)
    const facility = facById(picked.doctor.facilityId) ?? facilities.value.find(f => f.type === 'RHU') ?? facilities.value[0]
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
    recordEncounter({
      patientId: patient.id,
      complaint,
      esi: scored.esi,
      specialty,
      doctorId: picked.doctor.id,
      facilityId: facility.id,
      labs,
      note: rationale.join(' '),
      kind: scored.bypass ? 'emergency' : 'triage'
    })
    log('Triage', `${patient.name} → ESI ${scored.esi} ${specialty}`)
    notify(scored.bypass
      ? `ESI ${scored.esi}: ER bypass + transport dispatch from ${patient.barangay}.`
      : `Routed to ${specialty} · ${picked.doctor.name}`)
    return result
  }

  function commitTriageToSchedule(patient: Patient, result: TriageResult) {
    if (result.bypassEr) {
      emergencyInsert(patient, result)
      return
    }
    const open = appointments.value.find(
      a => a.facilityId === result.facility?.id && isOpen(a)
    ) || appointments.value.find(a => isOpen(a) && a.facilityId !== 'er')
    if (!open || !result.doctor) {
      notify('No open slot — offer next-morning priority online booking.')
      return
    }
    open.patientId = patient.id
    open.patientName = patient.name
    open.doctorId = result.doctor.id
    open.specialty = result.overflowToGp ? 'General Practice' : result.specialty
    open.esi = result.esi
    open.labs = result.labs
    open.channel = 'walk-in'
    open.status = 'reserved'
    result.doctor.todayLoad += 1
    const fac = facById(open.facilityId)
    if (fac && fac.type !== 'ER' && fac.type !== 'CHO') fac.walkInUsed = Math.min(fac.walkInCap, fac.walkInUsed + 1)
    log('Schedule', `${patient.name} assigned ${open.time} at ${fac?.name}`)
    notify(`Walk-in assigned ${open.time} at ${fac?.name}.`)
  }

  function bookOnline(patient: Patient, appointmentId: string) {
    const slot = appointments.value.find(a => a.id === appointmentId)
    if (!slot || !isOpen(slot)) {
      notify('That window is no longer open.')
      return
    }
    slot.patientId = patient.id
    slot.patientName = patient.name
    slot.channel = 'online'
    slot.status = 'reserved'
    const doc = docById(slot.doctorId)
    if (doc) doc.todayLoad += 1
    log('Booking', `${patient.name} reserved ${slot.time}`)
    notify(`SMS/PWA confirmation queued for ${patient.name}: arrive 5–10 minutes before ${slot.time}.`)
  }

  function bookNextOpen(patient: Patient, facilityId: string) {
    const open = appointments.value.find(a => a.facilityId === facilityId && isOpen(a))
    if (!open) {
      notify('No open window at that site. Generate the afternoon board or pick another facility.')
      return
    }
    bookOnline(patient, open.id)
  }

  function registerWalkIn(patient: Patient, facilityId: string, complaint = 'fever and headache') {
    const fac = facById(facilityId)
    if (!fac) return
    if (fac.walkInCap > 0 && fac.walkInUsed >= fac.walkInCap) {
      const alt = facilities.value
        .filter(f => f.id !== facilityId && f.type !== 'ER' && f.type !== 'CHO' && f.walkInUsed < f.walkInCap)
        .sort((a, b) => a.walkInUsed / a.walkInCap - b.walkInUsed / b.walkInCap)[0]
      notify(alt
        ? `${fac.name} walk-in buffer is full. Reassign to ${alt.name} (${alt.walkInUsed}/${alt.walkInCap}) or book a prioritized 08:00 slot tomorrow.`
        : `${fac.name} and satellites are at cap. Book a prioritized online slot for tomorrow morning.`)
      return
    }
    if (!patients.value.some(p => p.id === patient.id)) patients.value.push(patient)
    const result = runTriage(complaint, patient)
    commitTriageToSchedule(patient, { ...result, facility: fac })
  }

  function checkIn(id: string) {
    const a = appointments.value.find(x => x.id === id)
    if (!a || !a.patientName) return
    a.status = 'checked-in'
    log('Check-in', `${a.patientName} ${a.time}`)
    notify(`${a.patientName} checked in for ${a.time}.`)
  }

  function startConsult(id: string) {
    const a = appointments.value.find(x => x.id === id)
    if (!a || !a.patientName) return
    a.status = 'in-consult'
    log('Consult start', `${a.patientName} with ${docById(a.doctorId)?.name}`)
    notify(`${a.patientName} is in consult.`)
  }

  function completeVisit(id: string, note = '') {
    const a = appointments.value.find(x => x.id === id)
    if (!a || !a.patientName) return
    a.status = 'done'
    a.note = note || a.note
    if (a.patientId) {
      recordEncounter({
        patientId: a.patientId,
        complaint: a.note || a.specialty,
        esi: a.esi ?? 5,
        specialty: a.specialty,
        doctorId: a.doctorId,
        facilityId: a.facilityId,
        labs: a.labs ?? [],
        note: note || 'Consult completed.',
        kind: 'consult'
      })
    }
    log('Consult complete', `${a.patientName} ${a.time}`)
    notify(`${a.patientName} marked done.`)
  }

  function cancelAppointment(id: string) {
    const a = appointments.value.find(x => x.id === id)
    if (!a) return
    const name = a.patientName
    if (a.doctorId && a.patientName) {
      const d = docById(a.doctorId)
      if (d && d.todayLoad > 0) d.todayLoad -= 1
    }
    a.status = 'cancelled'
    a.patientName = undefined
    a.patientId = undefined
    a.esi = undefined
    a.labs = undefined
    a.status = 'open'
    log('Cancel', `${name ?? 'open slot'} ${a.time} released`)
    notify(`${name ?? 'Slot'} cancelled and returned to the board.`)
  }

  function releaseNoShows() {
    let n = 0
    for (const a of appointments.value) {
      if (a.channel === 'online' && a.status === 'reserved' && a.patientName && a.time <= clock.value) {
        const name = a.patientName
        a.status = 'released'
        a.channel = 'walk-in'
        a.patientName = undefined
        a.patientId = undefined
        a.status = 'open'
        n++
        notify(`${name}'s ${a.time} window released after no-show. Offered to walk-in buffer.`)
      }
    }
    if (!n) notify(`No online holds earlier than clock ${clock.value}.`)
    else log('No-show release', `${n} window(s) returned to walk-in`)
  }

  function emergencyInsert(patient: Patient, result?: TriageResult) {
    const slot = appointments.value.find(a => a.facilityId === 'er' && isOpen(a))
      ?? appointments.value.find(a => isOpen(a))
    const bumped = appointments.value.find(a => a.facilityId === 'rhu1' && a.status === 'reserved' && a.esi && a.esi >= 4 && a.patientName)
    if (!slot) return
    if (bumped) {
      bumped.status = 'rolled'
      notify(`Emergency override: ${patient.name} takes next ER window. SMS to ${bumped.patientName} — slot rolled +15 minutes.`)
    } else {
      notify(`Emergency case ${patient.name} inserted. Municipal transport notified.`)
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
    log('Emergency', `${patient.name} inserted at Infirmary ER`)
  }

  function createRx(patient: Patient, doctor: Doctor, drugIds: string[], qty: number, sig = 'As directed · Konsulta generic') {
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
      return { drugId: id, qty, sig, dispensed: 0 }
    })
    const rx: Prescription = {
      id: nextId('rx'),
      qr: `RX-VLC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      patientId: patient.id,
      doctorId: doctor.id,
      facilityId: doctor.facilityId,
      items,
      status: 'issued',
      alerts,
      issuedAt: stamp()
    }
    prescriptions.value.unshift(rx)
    recordEncounter({
      patientId: patient.id,
      complaint: 'e-Prescription',
      esi: 5,
      specialty: doctor.specialty,
      doctorId: doctor.id,
      facilityId: doctor.facilityId,
      labs: [],
      note: `Issued ${rx.qr}`,
      kind: 'pharmacy'
    })
    log('e-Rx', `${rx.qr} for ${patient.name}`)
    notify(alerts.length
      ? `e-Rx ${rx.qr} issued with ${alerts.length} clinical alert(s).`
      : `e-Rx ${rx.qr} signed by ${doctor.name} · PRC ${doctor.prc}.`)
    return rx
  }

  function voidRx(id: string) {
    const rx = prescriptions.value.find(r => r.id === id)
    if (!rx || rx.status === 'dispensed') {
      notify('Cannot void a fully dispensed or missing prescription.')
      return
    }
    rx.status = 'voided'
    log('Void Rx', rx.qr)
    notify(`${rx.qr} voided.`)
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
    if (!rx || rx.status === 'voided') {
      notify('QR not recognized or already voided.')
      return
    }
    const item = rx.items.find(i => i.dispensed < i.qty)
    if (!item) {
      notify('Prescription already fully dispensed. Single-use QR is closed.')
      return
    }
    const need = item.qty - item.dispensed
    const pick = fefoPick(item.drugId, facilityId, need)
    item.dispensed += need - pick.remaining
    if (pick.remaining > 0) {
      const peer = batches.value
        .filter(b => b.drugId === item.drugId && b.facilityId !== facilityId && b.qty >= pick.remaining)
        .sort((a, b) => a.expiry.localeCompare(b.expiry))[0]
      rx.voucherTo = peer?.facilityId
      rx.status = peer ? 'transferred' : 'partial'
      notify(peer
        ? `Partial fill ${item.dispensed}/${item.qty} ${drugById(item.drugId)?.generic}. Transfer voucher to ${facById(peer.facilityId)?.name}.`
        : `Partial fill only. ${pick.remaining} units still short in the network.`)
    } else {
      rx.status = rx.items.every(i => i.dispensed >= i.qty) ? 'dispensed' : 'partial'
      notify(`FEFO release from lot ${pick.used[0]?.batch.lot}. QR ${rx.qr} ${rx.status}.`)
    }
    log('Dispense', `${rx.qr} at ${facById(facilityId)?.name}`)
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
    for (const drug of drugs.value) {
      const byFac = facilities.value
        .filter(f => f.type !== 'ER' && f.type !== 'CHO')
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
    const drug = drugs.value.find(d => d.generic === rec.drug)
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
    log('Transfer', `${moved} ${rec.drug}`)
    notify(`Moved ${moved} ${rec.drug} ${facById(rec.fromId)?.name} → ${facById(rec.toId)?.name}.`)
  }

  function receiveStock(drugId: string, facilityId: string, lot: string, expiry: string, qty: number) {
    if (!drugId || !facilityId || !lot || qty <= 0) {
      notify('Lot, site, and a positive quantity are required.')
      return
    }
    batches.value.push({ id: nextId('b'), drugId, facilityId, lot, expiry, qty })
    log('Receive stock', `${qty} ${drugById(drugId)?.generic} lot ${lot}`)
    notify(`Received ${qty} ${drugById(drugId)?.generic} at ${facById(facilityId)?.name}.`)
  }

  function draftRequisition() {
    const lines = forecasts.value.map(f => {
      const drug = drugs.value.find(d => f.drug.toLowerCase().includes(d.generic.split(' ')[0].toLowerCase()))
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
      createdAt: stamp(),
      lines,
      status: 'draft'
    }
    requisitions.value.unshift(req)
    log('PR draft', req.id)
    notify(`Purchase requisition ${req.id} drafted for CHO Valencia (${req.lines.length} lines).`)
    return req
  }

  function submitRequisition(id: string) {
    const r = requisitions.value.find(x => x.id === id)
    if (r) {
      r.status = 'submitted'
      log('PR submit', id)
      notify(`${id} submitted to LGU Bids and Awards / City Health Office procurement.`)
    }
  }

  function receiveRequisition(id: string) {
    const r = requisitions.value.find(x => x.id === id)
    if (!r) return
    r.status = 'received'
    for (const line of r.lines) {
      const drug = drugs.value.find(d => line.drug.toLowerCase().includes(d.generic.split(' ')[0].toLowerCase()))
      if (drug) {
        receiveStock(drug.id, 'rhu1', `PR-${r.id}`, '2027-12-31', Math.max(10, Math.round(line.qty / 30)))
      }
    }
    notify(`${id} goods received into RHU 1 warehouse.`)
  }

  function addPatient(input: Partial<Patient> & { name: string; age: number; sex: 'F' | 'M'; barangay: string }) {
    const p: Patient = {
      id: nextId('p'),
      name: input.name.trim(),
      age: input.age,
      sex: input.sex,
      barangay: input.barangay,
      philhealth: input.philhealth?.trim() || '12-pending-konsulta',
      contact: input.contact?.trim() || '',
      allergies: input.allergies ?? [],
      conditions: input.conditions ?? [],
      meds: input.meds ?? [],
      notes: input.notes ?? ''
    }
    patients.value.unshift(p)
    log('Patient', `Registered ${p.name}`)
    notify(`${p.name} added to the municipal registry.`)
    return p
  }

  function updatePatient(id: string, patch: Partial<Patient>) {
    const p = patientById(id)
    if (!p) return
    Object.assign(p, patch)
    log('Patient', `Updated ${p.name}`)
    notify(`${p.name} chart saved.`)
  }

  function addDoctor(input: Omit<Doctor, 'id' | 'todayLoad'> & { todayLoad?: number }) {
    const d: Doctor = { ...input, id: nextId('d'), todayLoad: input.todayLoad ?? 0 }
    doctors.value.push(d)
    log('Clinician', `Added ${d.name}`)
    notify(`${d.name} added to the consultant matrix.`)
    return d
  }

  function updateDoctor(id: string, patch: Partial<Doctor>) {
    const d = docById(id)
    if (!d) return
    Object.assign(d, patch)
    notify(`${d.name} roster saved.`)
  }

  function updateFacility(id: string, patch: Partial<Facility>) {
    const f = facById(id)
    if (!f) return
    Object.assign(f, patch)
    notify(`${f.name} updated.`)
  }

  function addWalkInPatient(name: string, age: number, barangay: string, sex: 'F' | 'M' = 'F') {
    return addPatient({ name, age, sex, barangay })
  }

  function generateBoard(facilityId: string) {
    const fac = facById(facilityId)
    const defaultDoc = doctors.value.find(d => d.facilityId === facilityId)
      ?? doctors.value.find(d => d.specialty === 'General Practice')
      ?? doctors.value[0]
    if (!fac || !defaultDoc) return
    let added = 0
    for (const time of SERVICE_TIMES) {
      const exists = appointments.value.some(a => a.facilityId === facilityId && a.time === time)
      if (!exists) {
        appointments.value.push({
          id: nextId('a'),
          time,
          facilityId,
          doctorId: defaultDoc.id,
          channel: fac.type === 'ER' ? 'emergency' : 'online',
          status: 'open',
          specialty: defaultDoc.specialty
        })
        added++
      }
    }
    appointments.value.sort((a, b) => a.facilityId.localeCompare(b.facilityId) || a.time.localeCompare(b.time))
    notify(added ? `Opened ${added} empty windows at ${fac.name}.` : `${fac.name} already has a full 15-minute board.`)
  }

  function tickClock(minutes = 15) {
    clock.value = addMinutes(clock.value, minutes)
  }

  function searchAll(term: string) {
    const q = term.trim().toLowerCase()
    if (!q) {
      return { patients: [] as Patient[], appointments: [] as Appointment[], prescriptions: [] as Prescription[], doctors: [] as Doctor[] }
    }
    return {
      patients: patients.value.filter(p =>
        [p.name, p.barangay, p.philhealth, p.contact].join(' ').toLowerCase().includes(q)
      ),
      appointments: appointments.value.filter(a =>
        [a.patientName, a.time, a.specialty, a.status].join(' ').toLowerCase().includes(q)
      ),
      prescriptions: prescriptions.value.filter(r =>
        r.qr.toLowerCase().includes(q) || patientById(r.patientId)?.name.toLowerCase().includes(q)
      ),
      doctors: doctors.value.filter(d =>
        [d.name, d.specialty, d.prc].join(' ').toLowerCase().includes(q)
      )
    }
  }

  function snapshot() {
    return {
      facilities: facilities.value,
      doctors: doctors.value,
      patients: patients.value,
      appointments: appointments.value,
      batches: batches.value,
      prescriptions: prescriptions.value,
      requisitions: requisitions.value,
      transfers: transfers.value,
      drugs: drugs.value,
      forecasts: forecasts.value,
      encounters: encounters.value,
      audits: audits.value,
      clock: clock.value
    }
  }

  function applySnapshot(data: ReturnType<typeof snapshot>) {
    facilities.value = data.facilities
    doctors.value = data.doctors
    patients.value = data.patients
    appointments.value = data.appointments
    batches.value = data.batches
    prescriptions.value = data.prescriptions
    requisitions.value = data.requisitions
    transfers.value = data.transfers
    drugs.value = data.drugs
    forecasts.value = data.forecasts
    encounters.value = data.encounters
    audits.value = data.audits
    clock.value = data.clock
  }

  function hydrate() {
    if (!import.meta.client) return
    const hooked = useState('ops-persist-hooked', () => false)
    if (hooked.value) return
    hooked.value = true
    try {
      const raw = localStorage.getItem(STORE_KEY)
      if (raw) applySnapshot(JSON.parse(raw))
    } catch {
      /* keep seed */
    }
    watch(
      [facilities, doctors, patients, appointments, batches, prescriptions, requisitions, transfers, drugs, forecasts, encounters, audits, clock],
      () => {
        localStorage.setItem(STORE_KEY, JSON.stringify(snapshot()))
      },
      { deep: true }
    )
  }

  function resetOps() {
    applySnapshot({
      facilities: clone(seedFacilities),
      doctors: clone(seedDoctors),
      patients: clone(seedPatients),
      appointments: clone(seedAppointments),
      batches: clone(seedBatches),
      prescriptions: clone(seedRx),
      requisitions: [],
      transfers: [],
      drugs: clone(seedDrugs),
      forecasts: clone(seedForecasts),
      encounters: [],
      audits: [],
      clock: '10:28'
    })
    lastTriage.value = null
    flash.value = ''
    if (import.meta.client) localStorage.removeItem(STORE_KEY)
    notify('Operations data restored to the Valencia baseline.')
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
    encounters,
    audits,
    flash,
    lastTriage,
    clock,
    query,
    rhu1Load,
    criticalBatches,
    waitingWalkIns,
    inQueue,
    facById,
    docById,
    patientById,
    drugById,
    csv,
    runTriage,
    commitTriageToSchedule,
    bookOnline,
    bookNextOpen,
    registerWalkIn,
    checkIn,
    startConsult,
    completeVisit,
    cancelAppointment,
    releaseNoShows,
    emergencyInsert,
    createRx,
    voidRx,
    fulfill,
    stockOnHand,
    tier,
    recommendTransfers,
    executeTransfer,
    receiveStock,
    draftRequisition,
    submitRequisition,
    receiveRequisition,
    addWalkInPatient,
    addPatient,
    updatePatient,
    addDoctor,
    updateDoctor,
    updateFacility,
    generateBoard,
    tickClock,
    searchAll,
    hydrate,
    resetOps
  }
}
