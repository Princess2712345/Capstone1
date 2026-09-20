const staffPublic = new Set(['/', '/login', '/signup'])
const patientAuth = new Set(['/portal/login', '/portal/signup'])

export default defineNuxtRouteMiddleware((to) => {
  const { session } = useAuth()
  const { identity } = usePatientPortal()
  const path = to.path

  if (staffPublic.has(path)) {
    if (session.value && (path === '/login' || path === '/signup')) {
      return navigateTo('/ops')
    }
    return
  }

  if (path === '/portal' || path.startsWith('/portal/')) {
    if (patientAuth.has(path)) {
      if (identity.value) return navigateTo('/portal')
      return
    }
    if (!identity.value) {
      return navigateTo({ path: '/portal/login', query: { next: path } })
    }
    return
  }

  if (!session.value) {
    return navigateTo('/login')
  }
})
