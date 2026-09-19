import type { Appointment, Batch, Doctor, Drug, Facility, FillVoucher, ForecastRow, Patient, Prescription } from '~/utils/types'

export const facilities: Facility[] = [
  { id: 'cho', name: 'City Health Office', type: 'CHO', barangay: 'Poblacion', walkInUsed: 0, walkInCap: 0, phone: '(088) 828-2411', hours: '08:00–17:00' },
  { id: 'er', name: 'Valencia City Infirmary ER', type: 'ER', barangay: 'Poblacion', walkInUsed: 4, walkInCap: 8, phone: '(088) 828-1100', hours: '24 hours' },
  { id: 'rhu1', name: 'Valencia RHU 1', type: 'RHU', barangay: 'Poblacion', walkInUsed: 18, walkInCap: 20, phone: '(088) 828-3340', hours: '08:00–17:00' },
  { id: 'rhu2', name: 'Valencia RHU 2', type: 'RHU', barangay: 'Bagontaas', walkInUsed: 9, walkInCap: 16, phone: '(088) 828-4412', hours: '08:00–17:00' },
  { id: 'bhs-mailag', name: 'BHS Mailag', type: 'BHS', barangay: 'Mailag', walkInUsed: 4, walkInCap: 10, phone: 'BHW desk', hours: '08:00–16:00' },
  { id: 'bhs-lumbayao', name: 'BHS Lumbayao', type: 'BHS', barangay: 'Lumbayao', walkInUsed: 3, walkInCap: 8, phone: 'BHW desk', hours: '08:00–16:00' },
  { id: 'bhs-sancarlos', name: 'BHS San Carlos', type: 'BHS', barangay: 'San Carlos', walkInUsed: 2, walkInCap: 8, phone: 'BHW desk', hours: '08:00–16:00' }
]

export const doctors: Doctor[] = [
  { id: 'd-er', name: 'Dr. Ines Cabili', specialty: 'Emergency Medicine', facilityId: 'er', role: 'on-call', dailyCap: 20, todayLoad: 6, prc: '00918422', contact: 'er@valencia.gov.ph' },
  { id: 'd-card', name: 'Dr. Ramon Tabora', specialty: 'Cardiology', facilityId: 'rhu1', role: 'visiting', dailyCap: 12, todayLoad: 11, prc: '00773101', contact: 'cardio@valencia.gov.ph' },
  { id: 'd-gp1', name: 'Dr. Liza Ampo', specialty: 'General Practice', facilityId: 'rhu1', role: 'full-time', dailyCap: 28, todayLoad: 19, prc: '01244088', contact: 'cho@valencia.gov.ph' },
  { id: 'd-gp2', name: 'Dr. Noel Sumbilan', specialty: 'General Practice', facilityId: 'rhu2', role: 'full-time', dailyCap: 24, todayLoad: 10, prc: '01190244', contact: 'rhu2@valencia.gov.ph' },
  { id: 'd-ortho', name: 'Dr. Paolo Lumantas', specialty: 'Orthopedics', facilityId: 'rhu1', role: 'visiting', dailyCap: 10, todayLoad: 6, prc: '00844119', contact: 'ortho@valencia.gov.ph' },
  { id: 'd-endo', name: 'Dr. Amina Macapantao', specialty: 'Endocrinology', facilityId: 'rhu2', role: 'telehealth', dailyCap: 8, todayLoad: 3, prc: '01022873', contact: 'endo@valencia.gov.ph' },
  { id: 'd-pedia', name: 'Dr. Grace Paler', specialty: 'Pediatrics', facilityId: 'rhu1', role: 'full-time', dailyCap: 18, todayLoad: 9, prc: '00990012', contact: 'pedia@valencia.gov.ph' },
  { id: 'd-ob', name: 'Dr. Helen Uy', specialty: 'OB-GYN', facilityId: 'rhu2', role: 'visiting', dailyCap: 14, todayLoad: 8, prc: '00661145', contact: 'ob@valencia.gov.ph' },
  { id: 'd-pulmo', name: 'Dr. Cesar Langit', specialty: 'Pulmonology', facilityId: 'rhu1', role: 'telehealth', dailyCap: 10, todayLoad: 4, prc: '00819002', contact: 'pulmo@valencia.gov.ph' },
  { id: 'd-id', name: 'Dr. Fatima Dumarpa', specialty: 'Infectious Disease', facilityId: 'rhu2', role: 'visiting', dailyCap: 10, todayLoad: 5, prc: '01330091', contact: 'id@valencia.gov.ph' }
]

export const patients: Patient[] = [
  { id: 'p1', name: 'Rosa Cagampang', age: 58, sex: 'F', barangay: 'Poblacion', philhealth: '12-025184829-1', contact: '0917-441-2201', allergies: ['Ibuprofen'], conditions: ['Hypertension', 'T2DM'], meds: ['Amlodipine', 'Metformin'], notes: 'Konsulta refill. Prefers Cebuano.' },
  { id: 'p2', name: 'Junrey Paler', age: 34, sex: 'M', barangay: 'Mailag', philhealth: '12-033910022-8', contact: '0918-220-1188', allergies: [], conditions: [], meds: [], notes: '' },
  { id: 'p3', name: 'Aisha Bansuan', age: 27, sex: 'F', barangay: 'Lumbayao', philhealth: '12-041002911-4', contact: '0905-771-3340', allergies: ['Penicillin'], conditions: ['Pregnancy 28w'], meds: ['Ferrous sulfate'], notes: 'ANC at RHU 2.' },
  { id: 'p4', name: 'Tomas Lumbo', age: 71, sex: 'M', barangay: 'Bagontaas', philhealth: '12-018220441-0', contact: '0939-118-4402', allergies: [], conditions: ['COPD'], meds: ['Salbutamol'], notes: 'Needs accompaniment.' },
  { id: 'p5', name: 'Kenji Ampo', age: 4, sex: 'M', barangay: 'San Carlos', philhealth: '12-055119203-7', contact: '0912-880-2210', allergies: [], conditions: [], meds: [], notes: 'Guardian: Maricel Ampo.' },
  { id: 'p6', name: 'Maricel Uy', age: 42, sex: 'F', barangay: 'Poblacion', philhealth: '12-029441102-3', contact: '0916-330-1184', allergies: [], conditions: ['Asthma'], meds: ['Salbutamol'], notes: '' },
  { id: 'p7', name: 'Elias Dumanhog', age: 63, sex: 'M', barangay: 'Poblacion', philhealth: '12-011882044-6', contact: '0908-441-2290', allergies: [], conditions: ['CAD'], meds: ['Aspirin', 'Atorvastatin'], notes: 'Prior chest pain workup.' },
  { id: 'p8', name: 'Rico Langit', age: 29, sex: 'M', barangay: 'Mailag', philhealth: '12-060118922-1', contact: '0915-228-0091', allergies: [], conditions: [], meds: [], notes: 'Motorcycle crash follow-up.' },
  { id: 'p9', name: 'Fe Sumbilan', age: 51, sex: 'F', barangay: 'Bagontaas', philhealth: '12-044119300-8', contact: '0927-110-4482', allergies: [], conditions: ['Hypertension'], meds: ['Losartan'], notes: '' },
  { id: 'p10', name: 'Lina Abrogar', age: 38, sex: 'F', barangay: 'Poblacion', philhealth: '12-038220155-2', contact: '0910-552-7714', allergies: [], conditions: [], meds: [], notes: 'Frequent no-show risk.' }
]

export const drugs: Drug[] = [
  { id: 'metformin', generic: 'Metformin 500 mg', form: 'tablet', konsultaCode: 'KNS-OHA-500', interactsWith: [] },
  { id: 'amlodipine', generic: 'Amlodipine 5 mg', form: 'tablet', konsultaCode: 'KNS-CCB-005', interactsWith: [] },
  { id: 'losartan', generic: 'Losartan 50 mg', form: 'tablet', konsultaCode: 'KNS-ARB-050', interactsWith: [] },
  { id: 'simvastatin', generic: 'Simvastatin 20 mg', form: 'tablet', konsultaCode: 'KNS-STN-020', interactsWith: [] },
  { id: 'paracetamol', generic: 'Paracetamol 500 mg', form: 'tablet', konsultaCode: 'KNS-ANA-500', interactsWith: [] },
  { id: 'amoxicillin', generic: 'Amoxicillin 500 mg', form: 'capsule', konsultaCode: 'KNS-ABX-500', interactsWith: [] },
  { id: 'ors', generic: 'Oral rehydration salts', form: 'sachet', konsultaCode: 'KNS-ORS-001', interactsWith: [] },
  { id: 'cetirizine', generic: 'Cetirizine 10 mg', form: 'tablet', konsultaCode: 'KNS-AH1-010', interactsWith: [] },
  { id: 'ibuprofen', generic: 'Ibuprofen 400 mg', form: 'tablet', konsultaCode: 'KNS-NSA-400', interactsWith: ['Amlodipine'] },
  { id: 'salbutamol', generic: 'Salbutamol 2 mg', form: 'tablet', konsultaCode: 'KNS-BRN-002', interactsWith: [] },
  { id: 'ferrous', generic: 'Ferrous sulfate 325 mg', form: 'tablet', konsultaCode: 'KNS-FE-325', interactsWith: [] },
  { id: 'ors-zinc', generic: 'Zinc sulfate 20 mg', form: 'tablet', konsultaCode: 'KNS-ZN-020', interactsWith: [] }
]

export const batches: Batch[] = [
  { id: 'b1', drugId: 'paracetamol', facilityId: 'rhu1', lot: 'PCM-24-081', expiry: '2026-11-02', qty: 40 },
  { id: 'b2', drugId: 'paracetamol', facilityId: 'rhu1', lot: 'PCM-25-014', expiry: '2027-04-18', qty: 220 },
  { id: 'b3', drugId: 'ors', facilityId: 'rhu1', lot: 'ORS-25-003', expiry: '2026-10-12', qty: 18 },
  { id: 'b4', drugId: 'ors', facilityId: 'bhs-mailag', lot: 'ORS-25-009', expiry: '2027-01-30', qty: 90 },
  { id: 'b5', drugId: 'metformin', facilityId: 'rhu1', lot: 'MET-24-044', expiry: '2026-12-01', qty: 12 },
  { id: 'b6', drugId: 'metformin', facilityId: 'rhu2', lot: 'MET-25-002', expiry: '2027-08-11', qty: 180 },
  { id: 'b7', drugId: 'amoxicillin', facilityId: 'rhu2', lot: 'AMX-25-021', expiry: '2027-03-04', qty: 64 },
  { id: 'b8', drugId: 'cetirizine', facilityId: 'rhu1', lot: 'CET-25-006', expiry: '2026-09-28', qty: 8 },
  { id: 'b9', drugId: 'amlodipine', facilityId: 'rhu1', lot: 'AML-25-011', expiry: '2027-05-19', qty: 95 },
  { id: 'b10', drugId: 'salbutamol', facilityId: 'rhu2', lot: 'SAL-24-019', expiry: '2026-10-05', qty: 22 },
  { id: 'b11', drugId: 'ibuprofen', facilityId: 'bhs-lumbayao', lot: 'IBU-25-008', expiry: '2027-02-14', qty: 40 },
  { id: 'b12', drugId: 'losartan', facilityId: 'rhu1', lot: 'LOS-25-004', expiry: '2027-06-22', qty: 70 },
  { id: 'b13', drugId: 'ferrous', facilityId: 'rhu2', lot: 'FE-25-010', expiry: '2027-09-01', qty: 120 },
  { id: 'b14', drugId: 'paracetamol', facilityId: 'bhs-sancarlos', lot: 'PCM-25-040', expiry: '2027-02-02', qty: 80 }
]

function slot(id: string, time: string, extra: Partial<Appointment>): Appointment {
  return {
    id,
    time,
    facilityId: 'rhu1',
    doctorId: 'd-gp1',
    channel: 'online',
    status: 'reserved',
    specialty: 'General Practice',
    ...extra
  }
}

export const appointments: Appointment[] = [
  slot('a1', '08:00', { patientId: 'p4', patientName: 'Tomas Lumbo', specialty: 'Pulmonology', doctorId: 'd-pulmo', esi: 4, labs: ['Chest X-ray'] }),
  slot('a2', '08:15', { patientId: 'p1', patientName: 'Rosa Cagampang', specialty: 'Endocrinology', doctorId: 'd-endo', facilityId: 'rhu2', esi: 4, labs: ['FBS', 'HbA1c'] }),
  slot('a3', '08:30', { status: 'checked-in', patientId: 'p5', patientName: 'Kenji Ampo', specialty: 'Pediatrics', doctorId: 'd-pedia', channel: 'walk-in', esi: 3 }),
  slot('a4', '08:45', { status: 'open', channel: 'walk-in' }),
  slot('a5', '09:00', { patientId: 'p2', patientName: 'Junrey Paler', esi: 5 }),
  slot('a6', '09:15', { status: 'open' }),
  slot('a7', '09:30', { patientId: 'p6', patientName: 'Maricel Uy', esi: 4 }),
  slot('a8', '09:45', { channel: 'walk-in', status: 'open' }),
  slot('a9', '10:00', { specialty: 'Cardiology', doctorId: 'd-card', patientId: 'p7', patientName: 'Elias Dumanhog', esi: 3, labs: ['12-lead ECG', 'Troponin I'] }),
  slot('a10', '10:15', { status: 'open' }),
  slot('a11', '10:30', { patientId: 'p10', patientName: 'Lina Abrogar', esi: 5 }),
  slot('a12', '10:45', { channel: 'walk-in', status: 'open' }),
  slot('a13', '11:00', { specialty: 'Orthopedics', doctorId: 'd-ortho', patientId: 'p8', patientName: 'Rico Langit', esi: 3, labs: ['X-ray of affected limb'] }),
  slot('a14', '11:15', { status: 'open' }),
  slot('a15', '11:30', { patientId: 'p9', patientName: 'Fe Sumbilan', esi: 5 }),
  slot('a16', '13:00', { facilityId: 'rhu2', doctorId: 'd-gp2', patientName: 'Online: Bagontaas cluster', status: 'reserved' }),
  slot('a17', '13:15', { facilityId: 'rhu2', doctorId: 'd-gp2', status: 'open' }),
  slot('a18', '13:30', { facilityId: 'bhs-mailag', doctorId: 'd-gp2', channel: 'walk-in', status: 'open' }),
  slot('a19', '08:00', { facilityId: 'er', doctorId: 'd-er', specialty: 'Emergency Medicine', status: 'open', channel: 'emergency' }),
  slot('a20', '08:15', { facilityId: 'er', doctorId: 'd-er', specialty: 'Emergency Medicine', status: 'open', channel: 'emergency' })
]

export const prescriptions: Prescription[] = [
  {
    id: 'rx1',
    qr: 'RX-VLC-7K2M',
    patientId: 'p1',
    doctorId: 'd-gp1',
    facilityId: 'rhu1',
    items: [
      { drugId: 'metformin', qty: 30, sig: '1 tab BID after meals', dispensed: 0 },
      { drugId: 'amlodipine', qty: 30, sig: '1 tab OD', dispensed: 0 }
    ],
    status: 'issued',
    alerts: ['Patient on existing Amlodipine — confirm no duplicate fill this month.'],
    issuedAt: '2026-09-18 07:40'
  },
  {
    id: 'rx2',
    qr: 'RX-VLC-9P4C',
    patientId: 'p4',
    doctorId: 'd-pulmo',
    facilityId: 'rhu1',
    items: [{ drugId: 'salbutamol', qty: 30, sig: '1 tab TID as needed', dispensed: 10 }],
    status: 'partial',
    alerts: [],
    issuedAt: '2026-09-18 08:05',
    voucherTo: 'rhu2',
    voucherCode: 'VCH-VLC-10OF30'
  }
]

export const vouchers: FillVoucher[] = [
  {
    id: 'v1',
    code: 'VCH-VLC-10OF30',
    prescriptionId: 'rx2',
    patientId: 'p4',
    drugId: 'salbutamol',
    remaining: 20,
    fromFacilityId: 'rhu1',
    toFacilityId: 'rhu2',
    issuedAt: '2026-09-18 08:06',
    status: 'open' as const
  }
]

export const forecasts: ForecastRow[] = [
  { drug: 'Paracetamol 500 mg', season: 'Habagat / rainy', historical: 4200, projected: 6150, driver: 'Viral URI + dengue-adjacent fever load' },
  { drug: 'Cetirizine 10 mg', season: 'Habagat / rainy', historical: 980, projected: 1540, driver: 'Mold / flood-related allergic rhinitis' },
  { drug: 'ORS sachets', season: 'Enteric outbreak watch', historical: 1600, projected: 3100, driver: 'Mailag–Lumbayao cluster gastroenteritis' },
  { drug: 'Amoxicillin 500 mg', season: 'School opening', historical: 2100, projected: 2480, driver: 'Pediatric pharyngitis at BHS San Carlos' },
  { drug: 'Metformin 500 mg', season: 'Year-round Konsulta', historical: 3600, projected: 3720, driver: 'Stable NCD refill, RHU 1 stock-out risk' }
]
