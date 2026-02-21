<script setup lang="ts">
// Left panel for ADMIN role — navigate between resource types.
// IMPORTANT: Add search bar for each sections 

const emit = defineEmits<{
  select: [payload: { view: string; data?: any }]
}>()

const props = defineProps<{
  activeView: string
  activeId?:  number
}>()

const api = useApi()

type Section = 'users' | 'expos' | 'booths' | 'companies'
const section = ref<Section>('users')

const sections = [
  { key: 'users',     label: 'Users',     icon: 'i-lucide-users',       color: 'text-blue-600',    activeBg: 'bg-blue-50'    },
  { key: 'expos',     label: 'Expos',     icon: 'i-lucide-calendar',    color: 'text-emerald-600', activeBg: 'bg-emerald-50' },
  { key: 'booths',    label: 'Booths',    icon: 'i-lucide-store',       color: 'text-violet-600',  activeBg: 'bg-violet-50'  },
  { key: 'companies', label: 'Companies', icon: 'i-lucide-building-2',  color: 'text-amber-600',   activeBg: 'bg-amber-50'   },
] as const

// Generic list state
const items   = ref<any[]>([])
const loading = ref(false)

const endpointMap: Record<Section, string> = {
  users:     '/admin/users',
  expos:     '/admin/expos',
  booths:    '/admin/booths',
  companies: '/admin/companies',
}

const editViewMap: Record<Section, string> = {
  users:     'admin-user-edit',
  expos:     'admin-expo-edit',
  booths:    'admin-booth-edit',
  companies: 'admin-company-edit',
}

async function loadSection(s: Section) {
  loading.value = true
  try {
    const res = await api.getPaginated(endpointMap[s], {
      page: 1,
      limit: 20
    });
    console.log('Loaded:', s, res)
    items.value = (res as any).items ?? res
  }
  catch (e) {
    console.log('Error:', e)
    items.value = []
  }
  finally {
    loading.value = false
  }
}

watch(section, (v) => loadSection(v), { immediate: true })

defineExpose({ refresh: () => loadSection(section.value) })

function itemLabel(item: any, s: Section) {
  if (s === 'users')     return item.name ?? item.email ?? `User #${item.id}`
  if (s === 'expos')     return item.name ?? `Expo #${item.id}`
  if (s === 'booths')    return item.name  ?? `Booth #${item.id}`
  if (s === 'companies') return item.name  ?? `Company #${item.id}`
  return `#${item.id}`
}

function itemSub(item: any, s: Section) {
  if (s === 'users')     return item.email ?? item.roles?.join(', ')
  if (s === 'expos')     return item.type ?? '—'
  if (s === 'booths')    return item.status ?? '—'
  if (s === 'companies') return item.industry ?? '—'
  return ''
}

const activeSection = computed(() => sections.find(s => s.key === section.value)!)
</script>

<template>
  <aside class="flex flex-col h-full">

    <!-- Section nav -->
    <div class="grid grid-cols-2 gap-1 p-1 mb-4 bg-gray-100 rounded-xl">
      <button
        v-for="s in sections"
        :key="s.key"
        class="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
        :class="section === s.key
          ? `bg-white shadow-sm ${s.color}`
          : 'text-gray-500 hover:text-gray-700'"
        @click="section = s.key"
      >
        <UIcon :name="s.icon" class="w-3.5 h-3.5" />
        {{ s.label }}
      </button>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between mb-3">

      <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {{ activeSection.label }}
      </span>

      <div class="flex items-center gap-2">
        <button class="transition" :class="activeSection.color" @click="loadSection(section)">
          <UIcon name="i-lucide-refresh-cw" class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="items.length === 0" class="flex flex-col items-center justify-center flex-1 py-8 text-center">
      <UIcon :name="activeSection.icon" class="w-8 h-8 text-gray-300 mb-2" />
      <p class="text-xs text-gray-400">No {{ activeSection.label.toLowerCase() }} found</p>
    </div>

    <!-- List -->
    <div v-else class="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
      <button
        v-for="item in items"
        :key="item.id"
        class="w-full text-left rounded-xl border p-3 transition-all group"
        :class="activeId === item.id && activeView === editViewMap[section]
          ? `border-[#3d52d5]/40 ${activeSection.activeBg}`
          : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'"
        @click="emit('select', { view: editViewMap[section], data: item })"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm font-semibold text-gray-800 truncate">{{ itemLabel(item, section) }}</p>
          <UIcon name="i-lucide-chevron-right" class="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition shrink-0" />
        </div>
        <p class="text-xs text-gray-400 truncate mt-0.5">{{ itemSub(item, section) }}</p>
      </button>
    </div>

  </aside>
</template>