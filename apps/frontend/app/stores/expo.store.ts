export const useExpoStore = defineStore('expo', () => {
  const myExpos = ref<any[]>([])
  const allExpos = ref<any[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function fetchMyExpos(api: any) {
    if (loaded.value) return
    loading.value = true
    try {
      myExpos.value = await api.get('me/expos')
      loaded.value = true
    } catch {
      myExpos.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchAllExpos(api: any) {
    loading.value = true
    try {
      allExpos.value = await api.get('/expos')
    } catch {
      allExpos.value = []
    } finally {
      loading.value = false
    }
  }

  function addExpo(expo: any) {
    myExpos.value.unshift(expo)
  }

  function updateExpo(expo: any) {
    const i = myExpos.value.findIndex(e => e.id === expo.id)
    if (i !== -1) myExpos.value[i] = expo
  }

  function removeExpo(id: any) {
    myExpos.value = myExpos.value.filter(e => e.id !== id)
  }

  function reset() {
    myExpos.value = []
    allExpos.value = []
    loaded.value = false
  }

  return { myExpos, allExpos, loading, loaded, fetchMyExpos, fetchAllExpos, addExpo, updateExpo, removeExpo, reset }
})