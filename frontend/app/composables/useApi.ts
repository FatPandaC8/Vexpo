export const useApi = () => {
    const config = useRuntimeConfig()
    const BASE   = config.public.apiBase
    const auth   = useAuth()

    function headers(): Record<string, string> {
        return auth.token.value
        ? { Authorization: `Bearer ${auth.token.value}` }
        : {}
    }

    async function get<T>(path: string): Promise<T> {
        return $fetch<T>(path, { baseURL: BASE, headers: headers() })
    }

    async function post<T>(path: string, body?: any): Promise<T> {
        return $fetch<T>(path, { method: 'POST', baseURL: BASE, headers: headers(), body })
    }

    async function patch<T>(path: string, body: any): Promise<T> {
        return $fetch<T>(path, { method: 'PATCH', baseURL: BASE, headers: headers(), body })
    }

    async function del<T = void>(path: string): Promise<T> {
        return $fetch<T>(path, { method: 'DELETE', baseURL: BASE, headers: headers() })
    }

    return { get, post, patch, del }
}