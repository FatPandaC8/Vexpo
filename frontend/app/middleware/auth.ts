export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()
  await auth.init()

  if (!auth.isLoggedIn.value) {
    return navigateTo(`/auth?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
