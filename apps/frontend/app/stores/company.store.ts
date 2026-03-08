import type { Company } from "@vexpo/schema"
import type { Api } from "~/composables/useApi"

export const useCompanyStore = defineStore('company', () => {
    const company = ref<Company | null>(null)
    const loading = ref(false)
    const loaded = ref(false)  // prevent redundant fetches

    async function fetchMyCompany(api: Api) {
        if (loaded.value) return   // already have it
            loading.value = true
        try {
            company.value = await api.get<Company>('/me/company')
            loaded.value = true
        } catch {
            company.value = null
        } finally {
            loading.value = false
        }
    }

    function reset() {
        company.value = null
        loaded.value = false
    }

    async function fetchById(api: Api, id: string) {
        // Don't re-fetch if we already have this company loaded
        if (company.value?.id === id) return
        loading.value = true
        try {
            company.value = await api.get<Company>(`/companies/${id}`)
        } catch {
            company.value = null
        } finally {
            loading.value = false
        }
    }

    return { company, loading, loaded, fetchMyCompany, fetchById, reset }
})