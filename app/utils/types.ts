export type EsiLevel = 1 | 2 | 3 | 4 | 5
export type FacilityType = 'RHU' | 'BHS' | 'ER' | 'CHO'
export type Channel = 'online' | 'walk-in' | 'emergency'
export type AppointmentStatus = 'open' | 'reserved' | 'checked-in' | 'in-consult' | 'done' | 'released' | 'rolled' | 'cancelled'
export type StockTier = 'Critical' | 'Moderate' | 'Optimal'
export type RxStatus = 'issued' | 'partial' | 'dispensed' | 'transferred' | 'voided'
export type VoucherStatus = 'open' | 'redeemed'

export interface Facility {
  id: string
  name: string
  type: FacilityType
  barangay: string
  walkInUsed: number
  walkInCap: number
  phone: string
  hours: string
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  facilityId: string
  role: 'full-time' | 'visiting' | 'on-call' | 'telehealth'
  dailyCap: number
  todayLoad: number
  prc: string
  contact: string
}

export interface Patient {
  id: string
  name: string
  age: number
  sex: 'F' | 'M'
  barangay: string
  philhealth: string
  contact: string
  allergies: string[]
  conditions: string[]
  meds: string[]
  notes: string
}

export interface Appointment {
  id: string
  time: string
  facilityId: string
  doctorId: string
  patientId?: string
  patientName?: string
  channel: Channel
  status: AppointmentStatus
  specialty: string
  esi?: EsiLevel
  labs?: string[]
  note?: string
}

export interface SymptomHit {
  phrase: string
  system: string
  icd10: string
  icdLabel: string
  specialty: string
  urgency: number
}

export interface TriageResult {
  complaint: string
  hits: SymptomHit[]
  esi: EsiLevel
  esiLabel: string
  specialty: string
  bypassEr: boolean
  transport: boolean
  doctor: Doctor | null
  facility: Facility | null
  overflowToGp: boolean
  labs: string[]
  rationale: string[]
}

export interface Drug {
  id: string
  generic: string
  form: string
  konsultaCode: string
  interactsWith: string[]
}

export interface Batch {
  id: string
  drugId: string
  facilityId: string
  lot: string
  expiry: string
  qty: number
}

export interface Prescription {
  id: string
  qr: string
  patientId: string
  doctorId: string
  facilityId: string
  items: { drugId: string; qty: number; sig: string; dispensed: number }[]
  status: RxStatus
  alerts: string[]
  issuedAt: string
  voucherTo?: string
  voucherCode?: string
}

export interface FillVoucher {
  id: string
  code: string
  prescriptionId: string
  patientId: string
  drugId: string
  remaining: number
  fromFacilityId: string
  toFacilityId: string
  issuedAt: string
  status: VoucherStatus
}

export interface Requisition {
  id: string
  createdAt: string
  lines: { drug: string; qty: number; reason: string }[]
  status: 'draft' | 'submitted' | 'received'
}

export interface TransferRec {
  id: string
  fromId: string
  toId: string
  drug: string
  qty: number
  reason: string
}

export interface ForecastRow {
  drug: string
  season: string
  historical: number
  projected: number
  driver: string
}

export interface Encounter {
  id: string
  patientId: string
  complaint: string
  esi: EsiLevel
  specialty: string
  doctorId?: string
  facilityId?: string
  labs: string[]
  createdAt: string
  note: string
  kind: 'triage' | 'consult' | 'emergency' | 'pharmacy'
}

export interface AuditEvent {
  id: string
  at: string
  actor: string
  action: string
  detail: string
}
