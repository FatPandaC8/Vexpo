<script setup lang="ts">
import * as z from 'zod'

const auth = useAuth()

const canEditStatus = computed(() =>
  auth.user.value?.roles?.includes('admin') ||
  auth.user.value?.roles?.includes('organizer')
)

const props = defineProps<{
  expo?:  any
  booth?: any
}>()

const emit = defineEmits<{
  saved:      [booth: any]
  registered: [booth: any]
  deleted:    []
}>()

const api  = useApi()
const mode = computed(() => props.booth ? 'edit' : 'create')

const schema = z.object({
  name:        z.string().min(2, 'Booth name must be at least 2 characters'),
  description: z.string().optional(),
  companyId:   z.number().optional(),
  status:      z.enum(['pending', 'approved', 'rejected']).optional(),
})

const state = reactive({
  name:        props.booth?.name        ?? '',
  description: props.booth?.description ?? '',
  companyId:   props.booth?.companyId   ?? undefined as number | undefined,
  status:      props.booth?.status      ?? 'pending',
})

watch(() => props.booth, (b) => {
  state.name        = b?.name        ?? ''
  state.description = b?.description ?? ''
  state.companyId   = b?.companyId   ?? undefined
  state.status      = b?.status      ?? 'pending'
  modelPath.value     = b?.modelPath   ?? null
  modelFileName.value = b?.modelPath ? b.modelPath.split(/[\\/]/).pop() ?? null : null
  sessionUrl.value    = null
})

const STATUSES = ['pending', 'approved', 'rejected']

const saving  = ref(false)
const success = ref(false)
const error   = ref<string | null>(null)

async function submit(event: any) {
  saving.value  = true
  error.value   = null
  success.value = false
  try {
    const payload = {
      ...event.data,
      modelPath: modelPath.value ?? undefined,
      status: state.status,
    }

    let result: any
    if (mode.value === 'create') {
      result = await api.post<any>(`/expos/${props.expo!.id}/booths`, payload)
      emit('registered', result)
    } else {
      result = await api.patch<any>(`/booths/${props.booth!.id}`, payload)
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
const showDelete    = ref(false)
const deleteConfirm = ref('')
const deleteLoading = ref(false)
const canDelete     = computed(() => deleteConfirm.value === props.booth?.name)

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

// 3D Model file handling
const modelPath     = ref<string | null>(props.booth?.modelPath ?? null)
const sessionUrl    = ref<string | null>(null)
const modelFileName = ref<string | null>(
  props.booth?.modelPath
    ? props.booth.modelPath.split(/[\\/]/).pop() ?? null
    : null
)
const dropActive  = ref(false)
const fileError   = ref<string | null>(null)
const savingFile  = ref(false)

const ALLOWED = ['.glb', '.gltf', '.obj']
function isAllowed(name: string) {
  return ALLOWED.some(ext => name.toLowerCase().endsWith(ext))
}

function handleDrop(e: DragEvent) {
  dropActive.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) processFile(file)
}

function handleFileInput(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) processFile(file)
  ;(e.target as HTMLInputElement).value = ''
}

async function processFile(file: File) {
  fileError.value = null

  if (!isAllowed(file.name)) {
    fileError.value = 'Only .glb, .gltf, or .obj files are accepted.'
    return
  }
  if (file.size > 200 * 1024 * 1024) {
    fileError.value = 'File too large (max 200 MB).'
    return
  }

  savingFile.value = true

  try {
    if ('showSaveFilePicker' in window) {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: file.name,
        types: [{
          description: '3D Model',
          accept: { 'model/gltf-binary': ['.glb'], 'model/gltf+json': ['.gltf'], 'text/plain': ['.obj'] },
        }],
      })

      const writable = await handle.createWritable()
      await writable.write(file)
      await writable.close()

      const saved = await handle.getFile()
      // @ts-ignore — .path is Chromium-only
      const localPath: string = (saved as any).path ?? saved.name

      modelPath.value     = localPath
      modelFileName.value = saved.name
      sessionUrl.value    = URL.createObjectURL(saved)
    } else {
      sessionUrl.value    = URL.createObjectURL(file)
      modelPath.value     = file.name
      modelFileName.value = file.name
      fileError.value     = '⚠ Your browser doesn\'t support local file saving. The model will work this session only.'
    }
  } catch (e: any) {
    if (e?.name === 'AbortError') return
    fileError.value = 'Could not save file: ' + (e?.message ?? 'unknown error')
  } finally {
    savingFile.value = false
  }
}

function removeModel() {
  modelPath.value     = null
  modelFileName.value = null
  sessionUrl.value    = null
  fileError.value     = null
}

defineExpose({ sessionUrl, modelPath })

const hasModel = computed(() => !!modelFileName.value)
const hasFsApi = computed(() => typeof window !== 'undefined' && 'showSaveFilePicker' in window)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <div class="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
        <UIcon name="i-lucide-store" class="w-6 h-6 text-violet-600" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ mode === 'create' ? 'Register Booth' : 'Edit Booth' }}
        </h2>
        <p class="text-sm text-gray-400 mt-0.5">
          <template v-if="mode === 'create'">
            Registering for: <strong class="text-gray-700">{{ expo?.name }}</strong>
          </template>
          <template v-else>
            Editing: <strong class="text-gray-700">{{ booth?.name }}</strong>
          </template>
        </p>
      </div>
    </div>

    <!-- Alerts -->
    <Transition name="fade">
      <div v-if="success" class="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
        <UIcon name="i-lucide-circle-check" class="shrink-0 text-emerald-500" />
        Booth {{ mode === 'create' ? 'registered' : 'updated' }} successfully!
        <span v-if="mode === 'create'" class="text-emerald-600 ml-1">Check "My Booths" in the sidebar.</span>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="error" class="mb-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        <UIcon name="i-lucide-circle-alert" class="shrink-0 text-red-500" />
        {{ error }}
      </div>
    </Transition>

    <UForm :state="state" :schema="schema" class="space-y-5" @submit="submit">

      <UFormField name="name" label="Booth Name" :ui="{ error: 'text-red-500 italic text-xs mt-1' }">
        <UInput
          v-model="state.name"
          placeholder="e.g. TechCorp Innovation Booth"
          :disabled="saving"
          class="w-full"
          :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl' }"
        />
      </UFormField>

      <UFormField name="description" label="Description" :ui="{ error: 'text-red-500 italic text-xs mt-1' }">
        <UTextarea
          v-model="state.description"
          placeholder="What will you be showcasing at this booth?"
          :rows="4"
          :disabled="saving"
          class="w-full"
          :ui="{ base: 'border border-gray-200 focus:border-[#3d52d5] px-3 py-2 rounded-xl' }"
        />
      </UFormField>

      <UFormField v-if="canEditStatus" name="status" label="Status" :ui="{ error: 'text-red-500 italic text-xs mt-1' }">
        <USelect
          trailing-icon="null"
          v-model="state.status"
          variant="soft"
          :items="STATUSES"
          placeholder="Select a status"
          :content="{ align: 'start', side: 'bottom' }"
          :ui="{
            base: 'w-full border border-blue-300 h-10 rounded-xl bg-blue-50',
            content: 'bg-white rounded-xl shadow-lg border border-blue-100',
            item: 'px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer rounded-xl',
            itemLabel: 'text-gray-700',
          }"
        />
      </UFormField>

      <!-- 3D Model Upload -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">
          3D Booth Model
          <span class="font-normal text-gray-400 text-xs ml-1">(optional · .glb / .gltf / .obj)</span>
        </label>
        <p class="text-xs text-gray-400 mb-3">
          The file is saved to your computer. The path is stored so visitors on your device see your custom 3D booth.
        </p>

        <div v-if="!hasFsApi" class="mb-3 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <UIcon name="i-lucide-triangle-alert" class="w-3.5 h-3.5 shrink-0 mt-0.5" />
          Your browser doesn't support persistent local file access. Use Chrome or Edge for the best experience.
        </div>

        <Transition name="slide-down">
          <div v-if="hasModel" class="mb-3 flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-violet-900 truncate">{{ modelFileName }}</p>
              <p class="text-xs text-violet-500 mt-0.5 truncate" :title="modelPath ?? ''">
                <template v-if="hasFsApi && modelPath && modelPath !== modelFileName">{{ modelPath }}</template>
                <template v-else-if="sessionUrl">Session saved</template>
                <template v-else>Saved</template>
              </p>
            </div>
            <button
              type="button"
              class="text-violet-300 hover:text-red-500 transition shrink-0 p-1 rounded-lg hover:bg-red-50"
              title="Remove model"
              @click="removeModel"
            >
              <UIcon name="i-lucide-x" class="w-4 h-4" />
            </button>
          </div>
        </Transition>

        <div
          class="relative border-2 border-dashed rounded-2xl transition-all duration-200"
          :class="dropActive
            ? 'border-violet-500 bg-violet-50 scale-[1.01]'
            : 'border-gray-200 bg-gray-50/60 hover:border-violet-400 hover:bg-violet-50/30'"
          @dragover.prevent="dropActive = true"
          @dragleave.prevent="dropActive = false"
          @drop.prevent="handleDrop"
        >
          <label class="flex flex-col items-center justify-center gap-3 py-8 px-6 cursor-pointer">
            <input type="file" accept=".glb,.gltf,.obj" class="sr-only" @change="handleFileInput" />

            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
              :class="dropActive ? 'bg-violet-200 scale-110' : 'bg-violet-100'"
            >
              <UIcon
                :name="savingFile ? 'i-lucide-loader-circle' : dropActive ? 'i-lucide-download' : 'i-lucide-box'"
                class="w-7 h-7 text-violet-500"
                :class="{ 'animate-spin': savingFile }"
              />
            </div>

            <div class="text-center">
              <p class="text-sm font-semibold text-gray-700">
                <template v-if="savingFile">Saving file to disk…</template>
                <template v-else-if="dropActive">Drop to save model</template>
                <template v-else-if="hasModel"><span class="text-violet-600">Click to replace</span> or drag a new model</template>
                <template v-else><span class="text-violet-600">Click to browse</span> or drag your 3D model here</template>
              </p>
              <p class="text-xs text-gray-400 mt-1">.glb · .gltf · .obj · max 200 MB</p>
              <p v-if="hasFsApi" class="text-xs text-gray-400 mt-0.5">You'll be asked where to save the file on your computer</p>
            </div>
          </label>

          <div v-if="dropActive" class="absolute inset-0 border-4 border-violet-400 rounded-2xl pointer-events-none animate-pulse" />
        </div>

        <Transition name="fade">
          <div
            v-if="fileError"
            class="mt-2 flex items-start gap-2 text-xs rounded-xl px-3 py-2"
            :class="fileError.startsWith('⚠') ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-red-600'"
          >
            <UIcon name="i-lucide-circle-alert" class="w-3.5 h-3.5 shrink-0 mt-0.5" />
            {{ fileError }}
          </div>
        </Transition>
      </div>

      <!-- Submit -->
      <div class="pt-2 flex items-center gap-3">
        <UButton
          type="submit"
          :loading="saving"
          :disabled="saving"
          class="bg-[#3d52d5] text-white rounded-xl shadow-sm shadow-blue-500/20 cursor-pointer px-7"
          size="md"
        >
          {{ saving ? 'Saving…' : mode === 'create' ? 'Register Booth' : 'Save Changes' }}
        </UButton>
        <span v-if="mode === 'create'" class="text-xs text-gray-400">
          Pending organizer approval after registration.
        </span>
      </div>
    </UForm>

    <!-- Delete (edit only) -->
    <template v-if="mode === 'edit'">
      <div class="mt-10 pt-8 border-t border-gray-100">
        <button
          type="button"
          class="text-sm text-red-400 hover:text-red-600 transition flex items-center gap-2"
          @click="showDelete = !showDelete"
        >
          <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
          Delete this booth
        </button>
        <Transition name="fade">
          <div v-if="showDelete" class="mt-4 p-5 rounded-xl border border-red-200 bg-red-50/40">
            <p class="text-sm text-red-700 mb-3">
              Type <strong>{{ booth?.name }}</strong> to confirm:
            </p>
            <UInput
              v-model="deleteConfirm"
              placeholder="Booth name"
              class="mb-4 w-full max-w-xs"
              :ui="{ base: 'border border-red-200 focus:border-red-400 px-3 h-10 rounded-xl' }"
            />
            <UButton
              :disabled="!canDelete || deleteLoading"
              :loading="deleteLoading"
              size="sm"
              class="rounded-xl cursor-pointer px-5"
              :class="canDelete ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
              @click="deleteBooth"
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
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>