<script setup lang="ts">

const emit = defineEmits<{
  select: [payload: { view: string; data?: any }]
}>()

const props = defineProps<{
  activeView: string
  activeId?:  number
}>()

const api = useApi()

// Section tabs 
const section = ref<'registrations' | 'browse' | 'visited'>('registrations')

// My Registrations (GET /me/registrations) 
const registrations = ref<any[]>([])
const loadingRegs   = ref(false)
async function loadRegistrations() {
  loadingRegs.value = true
  try { registrations.value = await api.get<any[]>('/me/registrations') }
  catch { registrations.value = [] }
  finally { loadingRegs.value = false }
}

//  Browse all expos (GET /expos) 
const expos        = ref<any[]>([])
const loadingExpos = ref(false)
async function loadExpos() {
  loadingExpos.value = true
  try { expos.value = await api.get<any[]>('/expos') }
  catch { expos.value = [] }
  finally { loadingExpos.value = false }
}

//  Visited booths (GET /me/visited-booths)
const visitedBooths    = ref<any[]>([])
const loadingVisited   = ref(false)
async function loadVisitedBooths() {
  loadingVisited.value = true
  try { visitedBooths.value = await api.get<any[]>('/me/visited-booths') }
  catch { visitedBooths.value = [] }
  finally { loadingVisited.value = false }
}

watch(section, (v) => {
  if (v === 'registrations') loadRegistrations()
  else if (v === 'browse')   loadExpos()
  else                       loadVisitedBooths()
}, { immediate: true })

defineExpose({ refresh: () => {
  if (section.value === 'registrations') loadRegistrations()
  else if (section.value === 'browse')   loadExpos()
  else                                   loadVisitedBooths()
}})
</script>

<template>
  <aside class="flex flex-col h-full">

    <!-- Tabs -->
    <div class="grid grid-cols-2 gap-0.5 p-1 mb-4 bg-gray-100 rounded-xl">
      <button
        v-for="tab in [
          { key: 'registrations', label: 'My Expos',  icon: 'i-lucide-ticket'      },
          { key: 'visited',       label: 'Visited',    icon: 'i-lucide-store'       },
        ]"
        :key="tab.key"
        class="flex flex-col items-center gap-0.5 py-2 rounded-lg text-xs font-semibold transition-all"
        :class="section === tab.key
          ? 'bg-white text-[#3d52d5] shadow-sm'
          : 'text-gray-500 hover:text-gray-700'"
        @click="section = tab.key as any"
      >
        <UIcon :name="tab.icon" class="w-3.5 h-3.5" />
        {{ tab.label }}
      </button>
    </div>

    <!-- My Registrations -->
    <template v-if="section === 'registrations'">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Registered Expos</span>
        <button class="text-[#3d52d5] hover:text-blue-800 transition" @click="loadRegistrations">
          <UIcon name="i-lucide-refresh-cw" class="w-3.5 h-3.5" :class="{ 'animate-spin': loadingRegs }" />
        </button>
      </div>

      <div v-if="registrations.length === 0" class="flex flex-col items-center justify-center flex-1 text-center py-8">
        <div class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
          <UIcon name="i-lucide-ticket" class="w-6 h-6 text-gray-300" />
        </div>
        <p class="text-xs font-semibold text-gray-500 mb-1">No registrations yet</p>
        <p class="text-xs text-gray-400">Use Browse to find expos</p>
      </div>
      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <button
          v-for="reg in registrations"
          :key="reg.id"
          class="w-full text-left rounded-xl border p-3 transition-all"
          :class="activeView === 'expo-detail' && activeId === reg.expo?.id
            ? 'border-[#3d52d5]/40 bg-blue-50'
            : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/30'"
          @click="emit('select', { view: 'expo-detail', data: reg.expo })"
        >
          <p class="text-sm font-semibold text-gray-800 truncate">{{ reg.expo?.title ?? 'Expo' }}</p>
          <p class="text-xs text-gray-400 mt-0.5 truncate">{{ reg.expo?.location ?? '—' }}</p>
          <span class="inline-flex items-center gap-1 mt-1.5 text-xs text-emerald-600 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Registered
          </span>
        </button>
      </div>
    </template>

    <!-- Visited Booths -->
    <template v-else>
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Visited Booths</span>
        <button class="text-[#3d52d5] hover:text-blue-800 transition" @click="loadVisitedBooths">
          <UIcon name="i-lucide-refresh-cw" class="w-3.5 h-3.5" :class="{ 'animate-spin': loadingVisited }" />
        </button>
      </div>

      <div v-if="visitedBooths.length === 0" class="flex flex-col items-center justify-center flex-1 text-center py-8">
        <div class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
          <UIcon name="i-lucide-store" class="w-6 h-6 text-gray-300" />
        </div>
        <p class="text-xs font-semibold text-gray-500 mb-1">No visited booths</p>
        <p class="text-xs text-gray-400">Register for an expo to visit booths</p>
      </div>
      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <button
          v-for="booth in visitedBooths"
          :key="booth.id"
          class="w-full text-left rounded-xl border p-3 transition-all"
          :class="activeView === 'visited-booth' && activeId === booth.id
            ? 'border-[#3d52d5]/40 bg-blue-50'
            : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/30'"
          @click="emit('select', { view: 'visited-booth', data: booth })"
        >
          <p class="text-sm font-semibold text-gray-800 truncate">{{ booth.name ?? 'Booth #' + booth.id }}</p>
          <p class="text-xs text-gray-400 mt-0.5 truncate">{{ booth.expo?.title ?? '—' }}</p>
          <span class="inline-flex items-center gap-1 mt-1.5 text-xs text-blue-600 font-medium">
            <UIcon name="i-lucide-eye" class="w-3 h-3" />
            Visited
          </span>
        </button>
      </div>
    </template>

  </aside>
</template>