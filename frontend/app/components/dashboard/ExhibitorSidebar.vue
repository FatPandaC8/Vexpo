<script setup lang="ts">

const emit = defineEmits<{
  select: [payload: { view: string; data?: any }]
}>()

const props = defineProps<{
  activeView: string
  activeId?:  number
}>()

const api = useApi()

const section = ref<'booths' | 'expos' | 'company'>('booths')

// My Booths (GET /me/booths)
const booths        = ref<any[]>([])
const loadingBooths = ref(false)
async function loadBooths() {
  loadingBooths.value = true
  try { booths.value = await api.get<any[]>('/me/booths') }
  catch { booths.value = [] }
  finally { loadingBooths.value = false }
}

// Browse expos (GET /expos)
const expos        = ref<any[]>([])
const loadingExpos = ref(false)
async function loadExpos() {
  loadingExpos.value = true
  try { expos.value = await api.get<any[]>('/expos') }
  catch { expos.value = [] }
  finally { loadingExpos.value = false }
}

// My Company – stored as single item (POST /companies, PATCH /companies/:id) ─
// There's no GET /me/company in the spec so we persist locally after create/load
const myCompany        = ref<any>(null)
const loadingCompany   = ref(false)

// We try fetching from a reasonable endpoint; if backend doesn't have it yet,
// we show the create form.
async function loadCompany() {
  loadingCompany.value = true
  try { myCompany.value = await api.get<any>('/me/company') }
  catch { myCompany.value = null }
  finally { loadingCompany.value = false }
}

watch(section, (v) => {
  if (v === 'booths')   loadBooths()
  else if (v === 'expos') loadExpos()
  else                    loadCompany()
}, { immediate: true })

// Called by parent after booth register so My Booths refreshes
defineExpose({ refreshBooths: loadBooths })

const statusColor: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700',
  pending:  'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-700',
}
</script>

<template>
  <aside class="flex flex-col h-full">

    <!-- Tabs -->
    <div class="grid grid-cols-3 gap-0.5 p-1 mb-4 bg-gray-100 rounded-xl">
      <button
        v-for="tab in [
          { key: 'booths',   label: 'Booths',   icon: 'i-lucide-store'       },
          { key: 'expos',    label: 'Find Expo', icon: 'i-lucide-search'      },
          { key: 'company',  label: 'Company',   icon: 'i-lucide-building-2'  },
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

    <!-- My Booths -->
    <template v-if="section === 'booths'">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">My Booths</span>
        <button class="text-[#3d52d5] hover:text-blue-800 transition" @click="loadBooths">
          <UIcon name="i-lucide-refresh-cw" class="w-3.5 h-3.5" :class="{ 'animate-spin': loadingBooths }" />
        </button>
      </div>

      <div v-if="loadingBooths" class="space-y-2">
        <div v-for="i in 3" :key="i" class="h-16 rounded-xl bg-gray-100 animate-pulse" />
      </div>
      <div v-else-if="booths.length === 0" class="flex flex-col items-center justify-center flex-1 text-center py-8">
        <div class="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center mb-3">
          <UIcon name="i-lucide-store" class="w-6 h-6 text-violet-400" />
        </div>
        <p class="text-xs font-semibold text-gray-500 mb-1">No booths yet</p>
        <p class="text-xs text-gray-400">Use "Find Expo" to register a booth</p>
      </div>
      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <button
          v-for="booth in booths"
          :key="booth.id"
          class="w-full text-left rounded-xl border p-3 transition-all"
          :class="activeView === 'booth-edit' && activeId === booth.id
            ? 'border-[#3d52d5]/40 bg-blue-50'
            : 'border-gray-100 bg-white hover:border-violet-200 hover:bg-violet-50/30'"
          @click="emit('select', { view: 'booth-edit', data: booth })"
        >
          <p class="text-sm font-semibold text-gray-800 truncate">{{ booth.name ?? 'Booth #' + booth.id }}</p>
          <p class="text-xs text-gray-400 mt-0.5 truncate">Expo #{{ booth.expoId }}</p>
          <span
            class="inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded-md mt-1.5"
            :class="statusColor[booth.status] ?? 'bg-gray-100 text-gray-600'"
          >
            {{ booth.status ?? 'pending' }}
          </span>
        </button>
      </div>
    </template>

    <!-- Find Expo -->
    <template v-else-if="section === 'expos'">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Available Expos</span>
        <button class="text-[#3d52d5] hover:text-blue-800 transition" @click="loadExpos">
          <UIcon name="i-lucide-refresh-cw" class="w-3.5 h-3.5" :class="{ 'animate-spin': loadingExpos }" />
        </button>
      </div>

      <div v-if="loadingExpos" class="space-y-2">
        <div v-for="i in 4" :key="i" class="h-16 rounded-xl bg-gray-100 animate-pulse" />
      </div>
      <div v-else-if="expos.length === 0" class="flex flex-col items-center justify-center flex-1 py-8 text-center">
        <UIcon name="i-lucide-calendar-x" class="w-8 h-8 text-gray-300 mb-2" />
        <p class="text-xs text-gray-400">No expos available</p>
      </div>
      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <button
          v-for="expo in expos"
          :key="expo.id"
          class="w-full text-left rounded-xl border p-3 transition-all"
          :class="activeView === 'register-booth' && activeId === expo.id
            ? 'border-[#3d52d5]/40 bg-blue-50'
            : 'border-gray-100 bg-white hover:border-violet-200 hover:bg-violet-50/30'"
          @click="emit('select', { view: 'register-booth', data: expo })"
        >
          <p class="text-sm font-semibold text-gray-800 truncate">{{ expo.title }}</p>
          <p class="text-xs text-gray-400 mt-0.5 truncate">{{ expo.location ?? '—' }}</p>
          <span class="inline-flex items-center gap-1 mt-1.5 text-xs text-violet-600 font-medium">
            <UIcon name="i-lucide-store" class="w-3 h-3" />
            Register booth →
          </span>
        </button>
      </div>
    </template>

    <!-- My Company -->
    <template v-else>
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">My Company</span>
        <button class="text-[#3d52d5] hover:text-blue-800 transition" @click="loadCompany">
          <UIcon name="i-lucide-refresh-cw" class="w-3.5 h-3.5" :class="{ 'animate-spin': loadingCompany }" />
        </button>
      </div>

      <div v-if="loadingCompany" class="space-y-2">
        <div class="h-20 rounded-xl bg-gray-100 animate-pulse" />
      </div>

      <div v-else-if="!myCompany" class="flex flex-col items-center justify-center flex-1 text-center py-8">
        <div class="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center mb-3">
          <UIcon name="i-lucide-building-2" class="w-6 h-6 text-violet-400" />
        </div>
          <p class="text-xs font-semibold text-gray-500 mb-1">No company yet</p>
          <p class="text-xs text-gray-400 mb-3">Register your company to start exhibiting</p>
        <button
          class="text-xs font-semibold text-[#3d52d5] hover:underline cursor-pointer"
          @click="emit('select', { view: 'company-create' })"
        >
          + Register Company
        </button>
      </div>
    </template>

  </aside>
</template>