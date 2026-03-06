import type { Booth } from "@vexpo/schema"
import type { Api } from "~/composables/useApi"

export const useBoothStore = defineStore('booth', () => {
  const booth = ref<Booth | null>(null)
  const loading = ref(false)
  const loaded = ref(false)

  async function fetchMyBooth(api: Api) {
    if (loaded.value) return
    loading.value = true
    try {
      booth.value = await api.get<Booth>('/me/booth')
      loaded.value = true
    } catch {
      booth.value = null
    } finally {
      loading.value = false
    }
  }

  async function updateBooth(api: Api, id: string, payload: any): Promise<Booth> {
    const updated = await api.patch<Booth>(`/booths/${id}`, payload)
    booth.value = updated
    return updated
  }

  async function deleteBooth(api: Api, id: string) {
    await api.del(`/booths/${id}`)
    booth.value = null
    loaded.value = false
  }

  function setBooth(data: any) {
    booth.value = data
  }

  function reset() {
    booth.value = null
    loaded.value = false
  }

  return { booth, loading, loaded, fetchMyBooth, updateBooth, deleteBooth, setBooth, reset }
})