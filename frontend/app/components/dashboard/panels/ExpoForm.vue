<script setup lang="ts">
import * as z from 'zod'

const props = defineProps<{
  expo?: any
}>()

const emit = defineEmits<{
  saved: [expo: any]
  deleted: []
}>()

const api = useApi()
const mode = computed(() => props.expo ? 'edit' : 'create')

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.string(),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required')
})

const state = reactive({
  name: props.expo?.name ?? '',
  type: props.expo?.type ?? '',
  description: props.expo?.description ?? '',
  startDate: props.expo?.startDate ?? '',
  endDate: props.expo?.endDate ?? ''
})

watch(() => props.expo, (e) => {
  state.name = e?.name ?? ''
  state.type = e?.type ?? ''
  state.description = e?.description ?? ''
  state.startDate = e?.startDate ?? ''
  state.endDate = e?.endDate ?? ''
})

const saving = ref(false)
const success = ref(false)
const error = ref<string | null>(null)

async function submit(event: any) {
  saving.value = true
  error.value = null
  success.value = false

  try {
    let result

    if (mode.value === 'create') {
      result = await api.post('/expos', event.data)
    } else {
      result = await api.patch(`/expos/${props.expo!.id}`, event.data)
    }

    success.value = true
    emit('saved', result)

    if (mode.value === 'create') {
      state.name = ''
      state.description = ''
      state.startDate = ''
      state.endDate = ''
    }

    setTimeout(() => success.value = false, 3000)

  } catch (e: any) {
    const msg = e?.data?.message ?? e?.message
    error.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Save failed')
  } finally {
    saving.value = false
  }
}

const showDelete = ref(false)
const deleteConfirm = ref('')
const deleteLoading = ref(false)
const canDelete = computed(() => deleteConfirm.value === props.expo?.name)

async function deleteExpo() {
  if (!canDelete.value) return
  deleteLoading.value = true

  try {
    await api.del(`/expos/${props.expo!.id}`)
    emit('deleted')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Delete failed'
  } finally {
    deleteLoading.value = false
  }
}
</script>

<template>
  <div>

    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <div class="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
        <UIcon name="i-lucide-calendar" class="w-6 h-6 text-[#3d52d5]" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ mode === 'create' ? 'Create Expo' : 'Edit Expo' }}
        </h2>
        <p class="text-sm text-gray-400 mt-0.5">
          {{ mode === 'create'
            ? 'Set up your new expo event'
            : `Editing: ${expo?.name}` }}
        </p>
      </div>
    </div>

    <!-- Success -->
    <Transition name="fade">
      <div v-if="success"
        class="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
        <UIcon name="i-lucide-circle-check" class="text-emerald-500" />
        Expo {{ mode === 'create' ? 'created' : 'updated' }} successfully.
      </div>
    </Transition>

    <!-- Error -->
    <Transition name="fade">
      <div v-if="error"
        class="mb-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        <UIcon name="i-lucide-circle-alert" class="text-red-500" />
        {{ error }}
      </div>
    </Transition>

    <!-- Form -->
    <UForm :state="state" :schema="schema" class="space-y-5" @submit="submit">

      <UFormField name="name" label="Expo name">
        <UInput v-model="state.name"
          placeholder="Tech Innovation Expo 2026"
          :disabled="saving"
          class="w-full"
          :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl' }"
        />
      </UFormField>

      <UFormField name="type" label="Expo type">
        <UInput v-model="state.type"
          placeholder="Tech, Healthcare, ..."
          :disabled="saving"
          class="w-full"
          :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl' }"
        />
      </UFormField>

      <UFormField name="startDate" label="Start Date">
        <UInput type="date"
          v-model="state.startDate"
          :disabled="saving"
          class="w-full"
          :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl' }"
        />
      </UFormField>

      <UFormField name="endDate" label="End Date">
        <UInput type="date"
          v-model="state.endDate"
          :disabled="saving"
          class="w-full"
          :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl' }"
        />
      </UFormField>

      <UFormField name="description" label="Description">
        <UTextarea v-model="state.description"
          placeholder="Describe your expo..."
          :rows="4"
          :disabled="saving"
          class="w-full"
          :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 py-2 rounded-xl' }"
        />
      </UFormField>

      <div class="pt-2">
        <UButton
          type="submit"
          :loading="saving"
          class="bg-[#3d52d5] text-white rounded-xl px-6"
        >
          {{ saving ? 'Saving…' : mode === 'create' ? 'Create Expo' : 'Save Changes' }}
        </UButton>
      </div>
    </UForm>

    <!-- Delete -->
    <template v-if="mode === 'edit'">
      <div class="mt-10 pt-8 border-t border-gray-100">
        <button
          class="text-sm text-red-400 hover:text-red-600 transition flex items-center gap-2"
          @click="showDelete = !showDelete"
        >
          <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
          Delete this expo
        </button>

        <Transition name="fade">
          <div v-if="showDelete"
            class="mt-4 p-5 rounded-xl border border-red-200 bg-red-50/30">

            <p class="text-sm text-red-700 mb-3">
              Type <strong>{{ expo?.name }}</strong> to confirm:
            </p>

            <UInput
              v-model="deleteConfirm"
              class="mb-4 w-full max-w-xs"
              :ui="{ base: 'border border-red-200 focus:border-red-400 px-3 h-10 rounded-xl' }"
            />

            <UButton
              :disabled="!canDelete || deleteLoading"
              :loading="deleteLoading"
              size="sm"
              class="rounded-xl px-5"
              :class="canDelete ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'"
              @click="deleteExpo"
            >
              {{ deleteLoading ? 'Deleting…' : 'Permanently Delete' }}
            </UButton>

          </div>
        </Transition>
      </div>
    </template>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
</style>