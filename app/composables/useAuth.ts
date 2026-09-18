export type StaffRole = 'CHO officer' | 'RHU clinician' | 'BHW' | 'Pharmacist'

export interface StaffAccount {
  name: string
  email: string
  password: string
  role: StaffRole
  facility: string
}

export interface StaffSession {
  name: string
  email: string
  role: StaffRole
  facility: string
}

const SEED: StaffAccount[] = [
  { name: 'Dr. Liza Ampo', email: 'cho@valencia.gov.ph', password: 'careops', role: 'CHO officer', facility: 'City Health Office' },
  { name: 'Elena Mailag', email: 'bhw.mailag@valencia.gov.ph', password: 'careops', role: 'BHW', facility: 'BHS Mailag' }
]

export function useAuth() {
  const accounts = useCookie<StaffAccount[]>('vco-accounts', {
    default: () => [...SEED],
    sameSite: 'lax'
  })
  const session = useCookie<StaffSession | null>('vco-session', {
    default: () => null,
    sameSite: 'lax'
  })

  function login(email: string, password: string) {
    const list = accounts.value ?? SEED
    const match = list.find(
      a => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    )
    if (!match) return 'No staff record matches that email and password.'
    session.value = { name: match.name, email: match.email, role: match.role, facility: match.facility }
    return null
  }

  function signup(input: StaffAccount) {
    const list = accounts.value ?? SEED
    if (!input.name.trim() || !input.email.trim() || !input.password) {
      return 'Name, email, and password are required.'
    }
    if (input.password.length < 6) return 'Password must be at least 6 characters.'
    if (list.some(a => a.email.toLowerCase() === input.email.trim().toLowerCase())) {
      return 'That work email is already registered.'
    }
    const record = { ...input, email: input.email.trim().toLowerCase(), name: input.name.trim() }
    accounts.value = [...(accounts.value ?? SEED), record]
    session.value = { name: record.name, email: record.email, role: record.role, facility: record.facility }
    return null
  }

  function registerStaff(input: StaffAccount) {
    const list = accounts.value ?? SEED
    if (!input.name.trim() || !input.email.trim() || !input.password) {
      return 'Name, email, and password are required.'
    }
    if (input.password.length < 6) return 'Password must be at least 6 characters.'
    if (list.some(a => a.email.toLowerCase() === input.email.trim().toLowerCase())) {
      return 'That work email is already registered.'
    }
    const record = { ...input, email: input.email.trim().toLowerCase(), name: input.name.trim() }
    accounts.value = [...(accounts.value ?? SEED), record]
    return null
  }

  function logout() {
    session.value = null
  }

  return { accounts, session, login, signup, registerStaff, logout }
}
