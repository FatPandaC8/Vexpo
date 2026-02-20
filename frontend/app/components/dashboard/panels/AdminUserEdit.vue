<script setup lang="ts">
// Admin: view user details, change role, delete

import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{ user: any }>()
const emit  = defineEmits<{ updated: [user: any]; deleted: [] }>()

const api = useApi()

const ROLES = ['visitor', 'exhibitor', 'organizer', 'admin']

const schema = z.object({
  role: z.string().min(1, 'Select a role'),
})

const state = reactive({
  role: (props.user?.roles?.[0] ?? '').toLowerCase(),
})

watch(() => props.user, (u) => {
  state.role = (u?.roles?.[0] ?? '').toLowerCase()
})

const saving  = ref(false)
const success = ref(false)
const error   = ref<string | null>(null)

async function save(event: FormSubmitEvent<typeof state>) {
  saving.value  = true
  error.value   = null
  success.value = false
  try {
    const updated = await api.patch<any>(`/admin/users/${props.user.id}/role`, { role: event.data.role })
    success.value = true
    emit('updated', { ...props.user, roles: [event.data.role.toUpperCase()] })
    setTimeout(() => { success.value = false }, 3000)
  } catch (e: any) {
    const msg = e?.data?.message ?? e?.message
    error.value = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Update failed')
  } finally {
    saving.value = false
  }
}

// Delete
const deleteConfirm = ref('')
const deleteLoading = ref(false)
const showDelete    = ref(false)
const canDelete     = computed(() => deleteConfirm.value === props.user?.email)

async function deleteUser() {
  if (!canDelete.value) return
  deleteLoading.value = true
  try {
    await api.del(`/admin/users/${props.user.id}`)
    emit('deleted')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Delete failed'
  } finally {
    deleteLoading.value = false
  }
}

const roleBadge: Record<string, string> = {
  VISITOR:   'bg-blue-100 text-blue-700',
  EXHIBITOR: 'bg-violet-100 text-violet-700',
  ORGANIZER: 'bg-emerald-100 text-emerald-700',
  ADMIN:     'bg-red-100 text-red-700',
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-start gap-4 mb-8">
      <div class="w-14 h-14 rounded-full bg-[#3d52d5] text-white text-2xl font-bold flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
        {{ user.name?.charAt(0).toUpperCase() ?? '?' }}
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">{{ user.name }}</h2>
        <p class="text-sm text-gray-400 mt-0.5">{{ user.email }}</p>
        <div class="flex gap-2 mt-2 flex-wrap">
          <span
            v-for="role in user.roles"
            :key="role"
            class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            :class="roleBadge[role] ?? 'bg-gray-100 text-gray-600'"
          >
            {{ role }}
          </span>
        </div>
      </div>
    </div>

    <!-- User info cards -->
    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="p-4 rounded-xl border border-gray-100 bg-white">
        <p class="text-xs text-gray-400 mb-1">User ID</p>
        <p class="text-sm font-semibold text-gray-800">#{{ user.id }}</p>
      </div>
      <div class="p-4 rounded-xl border border-gray-100 bg-white">
        <p class="text-xs text-gray-400 mb-1">Email</p>
        <p class="text-sm font-semibold text-gray-800 truncate">{{ user.email }}</p>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="success" class="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
        <UIcon name="i-lucide-circle-check" class="shrink-0 text-emerald-500" />
        Role updated successfully.
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="error" class="mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        <UIcon name="i-lucide-circle-alert" class="shrink-0 text-red-500" />
        {{ error }}
      </div>
    </Transition>

    <!-- Role change form -->
    <UCard class="rounded-2xl border border-gray-100 p-6 mb-6">
      <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
        <UIcon name="i-lucide-shield" class="w-4 h-4 text-gray-400" />
        Change Role
      </h3>
      <UForm :state="state" :schema="schema" class="flex items-end gap-3" @submit="save">
        <UFormField name="role" label="Role" class="flex-1" :ui="{ error: 'text-red-500 italic text-xs mt-1' }">
          <USelect
            v-model="state.role"
            :options="ROLES.map(r => ({ label: r.charAt(0).toUpperCase() + r.slice(1), value: r }))"
            :disabled="saving"
            class="w-full"
            :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl' }"
          />
        </UFormField>
        <UButton
          type="submit"
          :loading="saving"
          :disabled="saving"
          class="bg-[#3d52d5] text-white rounded-xl shadow-sm shadow-blue-500/20 cursor-pointer px-5 mb-px"
          size="md"
        >
          {{ saving ? 'Saving…' : 'Update Role' }}
        </UButton>
      </UForm>
    </UCard>

    <!-- Delete user -->
    <div class="pt-2">
      <button
        class="text-sm text-red-400 hover:text-red-600 transition flex items-center gap-2"
        @click="showDelete = !showDelete"
      >
        <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
        Delete user
      </button>
      <Transition name="fade">
        <div v-if="showDelete" class="mt-4 p-5 rounded-xl border border-red-200 bg-red-50/30">
          <p class="text-sm text-red-700 mb-3">
            Type <strong>{{ user.email }}</strong> to confirm deletion:
          </p>
          <UInput
            v-model="deleteConfirm"
            placeholder="User email"
            class="mb-4 w-full max-w-xs"
            :ui="{ base: 'border border-red-200 focus:border-red-400 px-3 h-10 rounded-xl' }"
          />
          <UButton
            :disabled="!canDelete || deleteLoading"
            :loading="deleteLoading"
            size="sm"
            class="rounded-xl cursor-pointer px-5"
            :class="canDelete ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
            @click="deleteUser"
          >
            {{ deleteLoading ? 'Deleting…' : 'Delete User' }}
          </UButton>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
</style>