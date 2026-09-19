export interface PortalIdentity {
  patientId: string
  name: string
  contact: string
}

export function usePatientPortal() {
  const identity = useCookie<PortalIdentity | null>('vco-patient', {
    default: () => null,
    sameSite: 'lax'
  })

  function remember(patientId: string, name: string, contact: string) {
    identity.value = { patientId, name, contact }
  }

  function clearIdentity() {
    identity.value = null
  }

  return { identity, remember, clearIdentity }
}
