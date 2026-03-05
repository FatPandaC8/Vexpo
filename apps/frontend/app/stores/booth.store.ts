export const useBoothStore = defineStore('booth', () => {
  const booth = ref<any>(null)
  const loading = ref(false)
  const loaded = ref(false)

  async function fetchMyBooth(api: any) {
    if (loaded.value) return
    loading.value = true
    try {
      booth.value = await api.get('/me/booth')
      loaded.value = true
    } catch {
      booth.value = null
    } finally {
      loading.value = false
    }
  }

  async function updateBooth(api: any, id: string, payload: any) {
    const updated = await api.patch(`/booths/${id}`, payload)
    booth.value = updated
    return updated
  }

  async function deleteBooth(api: any, id: string) {
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