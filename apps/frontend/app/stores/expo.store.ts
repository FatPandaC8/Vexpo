import type { Expo } from "@vexpo/schema"
import type { Api } from "~/composables/useApi"

export const useExpoStore = defineStore('expo', () => {
  const myExpos = ref<Expo[]>([])
  const allExpos = ref<Expo[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function fetchMyExpos(api: Api) {
    if (loaded.value) return
    loading.value = true
    try {
      myExpos.value = await api.get<Expo[]>('me/expos')
      loaded.value = true
    } catch {
      myExpos.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchAllExpos(api: Api) {
    loading.value = true
    try {
      allExpos.value = await api.get<Expo[]>('/expos')
    } catch {
      allExpos.value = []
    } finally {
      loading.value = false
    }
  }

  function addExpo(expo: Expo) {
    myExpos.value.unshift(expo)
  }

  function updateExpo(expo: Expo) {
    const i = myExpos.value.findIndex(e => e.id === expo.id)
    if (i !== -1) myExpos.value[i] = expo
  }

  function removeExpo(id: string) {
    myExpos.value = myExpos.value.filter(e => e.id !== id)
  }

  function reset() {
    myExpos.value = []
    allExpos.value = []
    loaded.value = false
  }

  return { myExpos, allExpos, loading, loaded, fetchMyExpos, fetchAllExpos, addExpo, updateExpo, removeExpo, reset }
})