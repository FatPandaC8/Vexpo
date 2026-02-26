interface AuthUser {
  id: number
  name: string
  email: string
  roles: string[]
}

export const useAuth = () => {
  const config = useRuntimeConfig()
  const BASE = config.public.apiBase

  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    path: '/',
  })

  const user = useState<AuthUser | null>('auth_user', () => null)

  const isLoggedIn = computed(() => !!token.value)

  const role = computed(() => user.value?.roles?.at(0) ?? null)
  const isExhibitor = computed(() => role.value === 'exhibitor')
  const isOrganizer = computed(() => role.value === 'organizer')
  const isAdmin     = computed(() => role.value === 'admin')

  function authHeaders(): Record<string, string> {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  function setToken(raw: string) {
    token.value = raw
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      user.value = await $fetch<AuthUser>('/me', {
        baseURL: BASE,
        headers: authHeaders(),
      })
    } catch {
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

  async function completeOAuth(role: 'exhibitor' | 'organizer') {
    const res = await $fetch<{ access_token: string }>('/auth/oauth/complete', {
      method: 'POST',
      baseURL: BASE,
      headers: authHeaders(),
      body: { role },
    })
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

  async function init() {
    if (token.value && !user.value) {
      await fetchProfile()
    }
  }

  return {
    token,
    user,
    isLoggedIn,
    role,
    isExhibitor,
    isOrganizer,
    isAdmin,
    setToken,
    login,
    register,
    completeOAuth,
    logout,
    fetchProfile,
    init,
  }
}