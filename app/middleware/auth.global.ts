const publicPaths = new Set(['/', '/login', '/signup'])

function isPublic(path: string) {
  return publicPaths.has(path) || path === '/portal' || path.startsWith('/portal/')
}

export default defineNuxtRouteMiddleware((to) => {
  const { session } = useAuth()
  if (isPublic(to.path)) {
    if (session.value && (to.path === '/login' || to.path === '/signup')) {
      return navigateTo('/ops')
    }
    return
  }
  if (!session.value) {
    return navigateTo('/login')
  }
})
