import type { Booth } from "@vexpo/schema"

const MAX_SIZE = 20 * 1024 * 1024  // 20 MB

export function useBoothModel(api: Api, getBoothId: () => string | undefined) {
  const modelPath = ref<string | null>(null)
  const modelFileName = ref<string | null>(null)
  const uploadedFile = ref<File | null>(null)
  const fileError = ref<string | null>(null)
  const fileUploadKey = ref(0)
  const removingModel = ref(false)

  const hasModel = computed(() => !!modelFileName.value)

  function initModel(booth: Booth | undefined) {
    modelPath.value = booth?.modelPath ?? null
    modelFileName.value = booth?.modelPath
      ? (booth.modelPath.split(/[\\/]/).pop() ?? null)
      : null
  }

  function reset() {
    uploadedFile.value = null
    modelPath.value = null
    modelFileName.value = null
    fileError.value = null
    fileUploadKey.value++
  }

  // Watch uploadedFile and validate on change
  watch(uploadedFile, async (file) => {
    if (!file) return
    fileError.value = null

    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    if (ext !== '.glb') {
      fileError.value = 'Only a .glb file is accepted.'
      uploadedFile.value = null
      fileUploadKey.value++
      return
    }
    if (file.size > MAX_SIZE) {
      fileError.value = 'File too large (max 20 MB).'
      uploadedFile.value = null
      fileUploadKey.value++
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const token = useCookie('auth_token').value
      const res = await fetch('http://localhost:3000/upload/model', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      
      if (!res.ok) throw new Error('Upload failed')
        
      const { filename } = await res.json() as { filename: string }
      modelPath.value = filename
      modelFileName.value = filename
    } catch (e: any) {
      fileError.value = e?.message ?? 'Upload failed'
      uploadedFile.value = null
      fileUploadKey.value++
    }

  })

  async function removeModel() {
    reset()

    const boothId = getBoothId()
    if (!boothId) return

    removingModel.value = true
    try {
      await api.patch(`/booths/${boothId}`, { modelPath: null })
    } catch {

    } finally {
      removingModel.value = false
    }
  }

  return {
    modelPath,
    modelFileName,
    uploadedFile,
    fileError,
    fileUploadKey,
    removingModel,
    hasModel,
    initModel,
    removeModel,
  }
}