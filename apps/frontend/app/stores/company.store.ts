export const useCompanyStore = defineStore('company', () => {
    const company = ref<any>(null)
    const loading = ref(false)
    const loaded = ref(false)  // prevent redundant fetches

    async function fetchMyCompany(api: any) {
        if (loaded.value) return   // already have it
            loading.value = true
        try {
            company.value = await api.get('/me/company')
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

    return { company, loading, loaded, fetchMyCompany, reset }
})