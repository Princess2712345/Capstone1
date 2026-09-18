export default defineNuxtPlugin(() => {
  const { hydrate } = usePlatform()
  hydrate()
})
