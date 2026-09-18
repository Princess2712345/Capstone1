const publicPaths = new Set(['/', '/login', '/signup'])

export default defineNuxtRouteMiddleware((to) => {
  const { session } = useAuth()
  if (publicPaths.has(to.path)) {
    if (session.value && (to.path === '/login' || to.path === '/signup')) {
      return navigateTo('/ops')
    }
    return
  }
  if (!session.value) {
    return navigateTo('/login')
  }
})
