export const useAuth = () => {
  const config = useRuntimeConfig()
  const BASE = config.public.apiBase

  // Cookie persists the JWT across refreshes (7 days matches backend)
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    path: '/',
  })

  // User profile — reactive, shared across all callers via useState
  const user = useState<{ name: string; email: string } | null>('auth_user', () => null)

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  function authHeaders(): Record<string, string> {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  // Save token from URL query (used after OAuth redirect)
  function setToken(raw: string) {
    token.value = raw
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      user.value = await $fetch<{ name: string; email: string }>('/me', {
        baseURL: BASE,
        headers: authHeaders(),
      })
    } catch {
      // Token invalid/expired — wipe it
      token.value = null
      user.value = null
    }
  }

  async function login(email: string, password: string) {
    const res = await $fetch<{ access_token: string }>('/auth/login', {
      method: 'POST',
      baseURL: BASE,
      body: { email, password },
    })
    token.value = res.access_token
    await fetchProfile()
  }

  async function register(payload: {
    name: string
    email: string
    password: string
    role: string
  }) {
    const res = await $fetch<{ access_token: string }>('/auth/register', {
      method: 'POST',
      baseURL: BASE,
      body: payload,
    })
    token.value = res.access_token
    await fetchProfile()
  }

  // Called from select-role page after Google OAuth for new users
  async function completeOAuth(role: 'visitor' | 'exhibitor' | 'organizer') {
    const res = await $fetch<{ access_token: string }>('/auth/oauth/complete', {
      method: 'POST',
      baseURL: BASE,
      headers: authHeaders(),
      body: { role },
    })
    // Replace the temp token with the full one
    token.value = res.access_token
    await fetchProfile()
  }

  async function logout() {
    await $fetch('/auth/logout', {
      method: 'POST',
      baseURL: BASE,
      headers: authHeaders(),
    }).catch(() => {})
    token.value = null
    user.value = null
    await navigateTo('/auth')
  }

  // Call on app boot to restore user from existing cookie
  async function init() {
    if (token.value && !user.value) {
      await fetchProfile()
    }
  }

  return {
    token,
    user,
    isLoggedIn,
    setToken,
    login,
    register,
    completeOAuth,
    logout,
    fetchProfile,
    init,
  }
}