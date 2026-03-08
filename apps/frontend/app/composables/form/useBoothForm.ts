import type { Booth, BoothFormEmit, CreateBoothDTO, Expo, UpdateBoothDTO } from "@vexpo/schema";

export function useBoothForm(
  api: Api,
  props: { booth?: Booth; expo?: Expo },
  emit: BoothFormEmit,
  getMapPosition: () => { row: number; col: number } | null,
  getModelPath: () => string | null,
  canEditStatus: Ref<boolean>,
) {
  const mode = computed(() => (props.booth ? 'edit' : 'create'))

  const state = reactive({
    name: props.booth?.name ?? '',
    description: props.booth?.description ?? '',
    companyId: props.booth?.companyId as string | undefined,
    status: props.booth?.status ?? 'pending',
    rejectionReason: props.booth?.rejectionReason ?? '',
    modelPath: props.booth?.modelPath as string | undefined,
    mapRow: props.booth?.mapRow as number | undefined,
    mapCol: props.booth?.mapCol as number | undefined,
  })

  watch(() => state.status, (val) => {
    if (val !== 'rejected') state.rejectionReason = ''
  })

  function syncMap(pos: { row: number; col: number } | null) {
    state.mapRow = pos?.row
    state.mapCol = pos?.col
  }

  function syncModel(path: string | null) {
    state.modelPath = path ?? undefined
  }

  function syncCompany(companyId: string | undefined) {
    if (companyId && !state.companyId) {
      state.companyId = companyId
    }
  }

  function syncFromBooth(b: Booth | undefined) {
    state.name = b?.name ?? ''
    state.description = b?.description ?? ''
    state.companyId = b?.companyId ?? undefined
    state.status = b?.status ?? 'pending'
    state.rejectionReason = b?.rejectionReason ?? ''
    state.mapRow = b?.mapRow ?? undefined
    state.mapCol = b?.mapCol ?? undefined
    state.modelPath = b?.modelPath ?? undefined
  }

  // Submit
  const saving = ref(false)
  const success = ref(false)
  const error = ref<string | null>(null)

  async function submit(event: any) {
    saving.value = true
    error.value = null
    success.value = false

    try {
      const pos = getMapPosition()
      const payload = {
        ...event.data,
        mapRow: pos?.row ?? null,
        mapCol: pos?.col ?? null,
        modelPath: getModelPath() ?? null,
      }

      if (!canEditStatus.value) delete payload.status

      let result: any
      if (mode.value === 'create') {
        result = await api.post<CreateBoothDTO>(`/expos/${props.expo!.id}/booths`, payload)
        emit('registered', result)
      } else {
        result = await api.patch<UpdateBoothDTO>(`/booths/${props.booth!.id}`, payload)
        emit('saved', result)
      }

      success.value = true
      setTimeout(() => { success.value = false }, 4000)
    } catch (e: any) {
      const msg = e?.data?.message ?? e?.message
      error.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Save failed')
    } finally {
      saving.value = false
    }
  }

  // Delete
  const showDelete = ref(false)
  const deleteConfirm = ref('')
  const deleteLoading = ref(false)
  const canDelete = computed(() => deleteConfirm.value === props.booth?.name)

  async function deleteBooth() {
    if (!canDelete.value) return
    deleteLoading.value = true
    try {
      await api.del(`/booths/${props.booth!.id}`)
      emit('deleted')
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Delete failed'
    } finally {
      deleteLoading.value = false
    }
  }

  return {
    mode,
    state,
    saving,
    success,
    error,
    showDelete,
    deleteConfirm,
    deleteLoading,
    canDelete,
    submit,
    deleteBooth,
    syncMap,
    syncModel,
    syncCompany,
    syncFromBooth,
  }
}