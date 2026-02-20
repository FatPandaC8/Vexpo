<script setup lang="ts">
// Admin: create (expo=undefined) or edit/delete an expo

import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{ expo?: any }>()
const emit  = defineEmits<{ saved: [expo: any]; deleted: [] }>()

const api  = useApi()
const mode = computed(() => props.expo ? 'edit' : 'create')

const schema = z.object({
  title:       z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  location:    z.string().optional(),
})

const state = reactive({
  title:       props.expo?.title       ?? '',
  description: props.expo?.description ?? '',
  location:    props.expo?.location    ?? '',
})

watch(() => props.expo, (e) => {
  state.title       = e?.title       ?? ''
  state.description = e?.description ?? ''
  state.location    = e?.location    ?? ''
})

const saving  = ref(false)
const success = ref(false)
const error   = ref<string | null>(null)

async function submit(event: FormSubmitEvent<typeof state>) {
  saving.value  = true
  error.value   = null
  try {
    const result = mode.value === 'create'
      ? await api.post<any>('/expos', event.data)
      : await api.patch<any>(`/expos/${props.expo!.id}`, event.data)
    success.value = true
    emit('saved', result)
    if (mode.value === 'create') {
      state.title = state.description = state.location = ''
    }
    setTimeout(() => { success.value = false }, 3000)
  } catch (e: any) {
    const msg = e?.data?.message ?? e?.message
    error.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Save failed')
  } finally {
    saving.value = false
  }
}

const showDelete    = ref(false)
const deleteConfirm = ref('')
const deleteLoading = ref(false)
const canDelete     = computed(() => deleteConfirm.value === props.expo?.title)

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
    <div class="flex items-center gap-3 mb-8">
      <div class="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
        <UIcon name="i-lucide-calendar" class="w-6 h-6 text-emerald-600" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ mode === 'create' ? 'Create Expo' : expo?.title }}
        </h2>
        <p class="text-sm text-gray-400 mt-0.5">
          {{ mode === 'create' ? 'Add a new expo to the platform' : 'Admin — edit expo details' }}
        </p>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="success" class="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
        <UIcon name="i-lucide-circle-check" class="shrink-0 text-emerald-500" />
        Expo {{ mode === 'create' ? 'created' : 'updated' }} successfully.
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="error" class="mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        <UIcon name="i-lucide-circle-alert" class="shrink-0 text-red-500" />
        {{ error }}
      </div>
    </Transition>

    <UForm :state="state" :schema="schema" class="space-y-5" @submit="submit">
      <UFormField name="title" label="Title" :ui="{ error: 'text-red-500 italic text-xs mt-1' }">
        <UInput v-model="state.title" placeholder="Expo title" :disabled="saving" class="w-full" :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl' }" />
      </UFormField>
      <UFormField name="location" label="Location" :ui="{ error: 'text-red-500 italic text-xs mt-1' }">
        <UInput v-model="state.location" placeholder="Hall A or Virtual" :disabled="saving" class="w-full" :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl' }" />
      </UFormField>
      <UFormField name="description" label="Description" :ui="{ error: 'text-red-500 italic text-xs mt-1' }">
        <UTextarea v-model="state.description" :rows="4" :disabled="saving" class="w-full" :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 py-2 rounded-xl' }" />
      </UFormField>
      <div class="pt-2">
        <UButton type="submit" :loading="saving" :disabled="saving" class="bg-[#3d52d5] text-white rounded-xl shadow-sm shadow-blue-500/20 cursor-pointer px-6" size="md">
          {{ saving ? 'Saving…' : mode === 'create' ? 'Create Expo' : 'Save Changes' }}
        </UButton>
      </div>
    </UForm>

    <template v-if="mode === 'edit'">
      <div class="mt-10 pt-8 border-t border-gray-100">
        <button class="text-sm text-red-400 hover:text-red-600 transition flex items-center gap-2" @click="showDelete = !showDelete">
          <UIcon name="i-lucide-trash-2" class="w-4 h-4" />Delete this expo
        </button>
        <Transition name="fade">
          <div v-if="showDelete" class="mt-4 p-5 rounded-xl border border-red-200 bg-red-50/30">
            <p class="text-sm text-red-700 mb-3">Type <strong>{{ expo?.title }}</strong> to confirm:</p>
            <UInput v-model="deleteConfirm" placeholder="Expo title" class="mb-4 w-full max-w-xs" :ui="{ base: 'border border-red-200 focus:border-red-400 px-3 h-10 rounded-xl' }" />
            <UButton :disabled="!canDelete || deleteLoading" :loading="deleteLoading" size="sm" class="rounded-xl cursor-pointer px-5" :class="canDelete ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'" @click="deleteExpo">
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