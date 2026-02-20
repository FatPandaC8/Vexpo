<script setup lang="ts">
// Exhibitor: create a new company (mode='create') or edit existing (mode='edit')

import * as z from 'zod'

const auth = useAuth()

const props = defineProps<{
  company?: any   // present in edit mode
}>()

const emit = defineEmits<{
  saved:   [company: any]
  deleted: []
}>()

const api  = useApi()
const mode = computed(() => props.company ? 'edit' : 'create')

const schema = z.object({
  name:        z.string().min(2, 'Company name must be at least 2 characters'),
  email:       z.email(),
  description: z.string().optional(),
  industry:    z.string().optional(),
  website:     z.url('Must be a valid URL').optional().or(z.literal('')),
  country:     z.string().optional().or(z.literal('')),
  city:        z.string().optional().or(z.literal('')),
})

const state = reactive({
  name:        props.company?.name        ?? '',
  email:       props.company?.email       ?? '',
  country:     props.company?.country     ?? '',
  description: props.company?.description ?? '',
  industry:    props.company?.industry    ?? '',
  website:     props.company?.website     ?? '',
  city:        props.company?.city        ?? '',
})

watch(() => props.company, (c) => {
  state.name        = c?.name        ?? ''
  state.email       = c?.email       ?? ''
  state.description = c?.description ?? ''
  state.industry    = c?.industry    ?? ''
  state.website     = c?.website     ?? ''
  state.country     = c?.country     ?? ''
  state.city        = c?.city        ?? ''
})

const saving  = ref(false)
const success = ref(false)
const error   = ref<string | null>(null)

async function submit(event: any) {
  saving.value  = true
  error.value   = null
  success.value = false

  try {
    let result: any
    if (mode.value === 'create') {
      result = await api.post<any>('/companies', event.data)
    } else {
      result = await api.patch<any>(`/companies/${props.company!.id}`, event.data)
    }

    success.value = true

    emit('saved', result)

    if (mode.value === 'create') {
      state.name = state.description = state.industry = state.country = state.website = state.city = ''
    }

    setTimeout(() => { success.value = false }, 3000)

  } catch (e: any) {
    const msg = e?.data?.message ?? e?.message
    error.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Save failed')
  } finally {
    saving.value = false
  }
}

// Delete
const showDelete    = ref(false)
const deleteConfirm = ref('')
const deleteLoading = ref(false)
const canDelete     = computed(() => deleteConfirm.value === props.company?.name)

async function deleteCompany() {
  if (!canDelete.value) return
  deleteLoading.value = true
  try {
    await api.del(`/companies/${props.company!.id}`)
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
      <div class="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
        <UIcon name="i-lucide-building-2" class="w-6 h-6 text-violet-600" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ mode === 'create' ? 'Register Company' : 'Edit Company' }}
        </h2>
        <p class="text-sm text-gray-400 mt-0.5">
          {{ mode === 'create'
            ? 'Register your company to start exhibiting at expos'
            : `Editing: ${company?.name}` }}
        </p>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="success" class="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
        <UIcon name="i-lucide-circle-check" class="shrink-0 text-emerald-500" />
        Company {{ mode === 'create' ? 'registered' : 'updated' }} successfully.
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="error" class="mb-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        <UIcon name="i-lucide-circle-alert" class="shrink-0 text-red-500" />
        {{ error }}
      </div>
    </Transition>

    <UForm :state="state" :schema="schema" class="space-y-5" @submit="submit">

      <UFormField name="name" label="Company Name" :ui="{ error: 'text-red-500 italic text-xs mt-1' }">
        <UInput
          v-model="state.name"
          placeholder="e.g. Acme Corporation"
          :disabled="saving"
          class="w-full"
          :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl' }"
        />
      </UFormField>

      <UFormField name="email" label="Email" :ui="{ error: 'text-red-500 italic text-xs mt-1' }">
        <UInput
          v-model="state.email"
          placeholder="company@business.com"
          :disabled="saving"
          class="w-full"
          :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl' }"
        />
      </UFormField>

      <UFormField name="industry" label="Industry" :ui="{ error: 'text-red-500 italic text-xs mt-1' }">
        <UInput
          v-model="state.industry"
          placeholder="e.g. Technology, Healthcare, Finance"
          :disabled="saving"
          class="w-full"
          :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl' }"
        />
      </UFormField>

      <UFormField name="country" label="Country" :ui="{ error: 'text-red-500 italic text-xs mt-1' }">
        <UInput
          v-model="state.country"
          placeholder="e.g. America, France, ..."
          :disabled="saving"
          class="w-full"
          :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl' }"
        />
      </UFormField>

      <UFormField name="city" label="City" :ui="{ error: 'text-red-500 italic text-xs mt-1' }">
        <UInput
          v-model="state.city"
          placeholder="e.g. Hanoi, HCM, ..."
          :disabled="saving"
          class="w-full"
          :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl' }"
        />
      </UFormField>

      <UFormField name="website" label="Website" :ui="{ error: 'text-red-500 italic text-xs mt-1' }">
        <UInput
          v-model="state.website"
          placeholder="https://yourcompany.com"
          :disabled="saving"
          class="w-full"
          :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl' }"
        />
      </UFormField>

      <UFormField name="description" label="Description" :ui="{ error: 'text-red-500 italic text-xs mt-1' }">
        <UTextarea
          v-model="state.description"
          placeholder="What does your company do?"
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
          :disabled="saving"
          class="bg-[#3d52d5] text-white rounded-xl shadow-sm shadow-blue-500/20 cursor-pointer px-6"
          size="md"
        >
          {{ saving ? 'Saving…' : mode === 'create' ? 'Register Company' : 'Save Changes' }}
        </UButton>
      </div>
    </UForm>

    <!-- Delete (edit mode only) -->
    <template v-if="mode === 'edit'">
      <div class="mt-10 pt-8 border-t border-gray-100">
        <button
          class="text-sm text-red-400 hover:text-red-600 transition flex items-center gap-2"
          @click="showDelete = !showDelete"
        >
          <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
          Delete this company
        </button>
        <Transition name="fade">
          <div v-if="showDelete" class="mt-4 p-5 rounded-xl border border-red-200 bg-red-50/30">
            <p class="text-sm text-red-700 mb-3">
              Type <strong>{{ company?.name }}</strong> to confirm:
            </p>
            <UInput
              v-model="deleteConfirm"
              placeholder="Company name"
              class="mb-4 w-full max-w-xs"
              :ui="{ base: 'border border-red-200 focus:border-red-400 px-3 h-10 rounded-xl' }"
            />
            <UButton
              :disabled="!canDelete || deleteLoading"
              :loading="deleteLoading"
              size="sm"
              class="rounded-xl cursor-pointer px-5"
              :class="canDelete ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
              @click="deleteCompany"
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