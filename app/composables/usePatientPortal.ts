export interface PatientAccount {
  patientId: string
  name: string
  email: string
  password: string
  contact: string
  barangay: string
  residentId: string
  homeFacilityId: string
  philhealth: string
  age: number
  sex: 'F' | 'M'
}

export interface PatientSession {
  patientId: string
  name: string
  email: string
  contact: string
  barangay: string
  residentId: string
}

function toSession(match: PatientAccount): PatientSession {
  return {
    patientId: match.patientId,
    name: match.name,
    email: match.email,
    contact: match.contact,
    barangay: match.barangay,
    residentId: match.residentId
  }
}

const SEED: PatientAccount[] = [
  {
    patientId: 'p1',
    name: 'Rosa Cagampang',
    email: 'rosa@valencia.ph',
    password: 'careops',
    contact: '0917-441-2201',
    barangay: 'Poblacion',
    residentId: 'VLC-POB-0001',
    homeFacilityId: 'rhu1',
    philhealth: '12-025184829-1',
    age: 58,
    sex: 'F'
  },
  {
    patientId: 'p2',
    name: 'Junrey Paler',
    email: 'junrey@valencia.ph',
    password: 'careops',
    contact: '0918-220-1188',
    barangay: 'Mailag',
    residentId: 'VLC-MLG-0001',
    homeFacilityId: 'bhs-mailag',
    philhealth: '12-033910022-8',
    age: 34,
    sex: 'M'
  }
]

export function usePatientPortal() {
  const accounts = useCookie<PatientAccount[]>('vco-patient-accounts', {
    default: () => [...SEED],
    sameSite: 'lax'
  })
  const identity = useCookie<PatientSession | null>('vco-patient', {
    default: () => null,
    sameSite: 'lax'
  })

  const seeded = accounts.value ?? []
  const missing = SEED.filter(s => !seeded.some(a => a.email === s.email))
  if (missing.length) accounts.value = [...seeded, ...missing]

  function login(email: string, password: string) {
    const list = accounts.value ?? SEED
    const match = list.find(
      a => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    )
    if (!match) return 'No patient record matches that email and password.'
    identity.value = toSession(match)
    return null
  }

  function signup(input: PatientAccount) {
    const list = accounts.value ?? SEED
    if (!input.name.trim() || !input.email.trim() || !input.password || !input.contact.trim()) {
      return 'Name, email, mobile, and password are required.'
    }
    if (input.password.length < 6) return 'Password must be at least 6 characters.'
    if (list.some(a => a.email.toLowerCase() === input.email.trim().toLowerCase())) {
      return 'That email is already registered.'
    }
    const record: PatientAccount = {
      ...input,
      email: input.email.trim().toLowerCase(),
      name: input.name.trim(),
      contact: input.contact.trim()
    }
    accounts.value = [...(accounts.value ?? SEED), record]
    identity.value = toSession(record)
    return null
  }

  function remember(patientId: string, name: string, contact: string, extra?: Partial<PatientSession>) {
    identity.value = {
      patientId,
      name,
      contact,
      email: extra?.email ?? identity.value?.email ?? '',
      barangay: extra?.barangay ?? identity.value?.barangay ?? '',
      residentId: extra?.residentId ?? identity.value?.residentId ?? ''
    }
  }

  function logout() {
    identity.value = null
  }

  return { accounts, identity, login, signup, remember, logout, clearIdentity: logout }
}
