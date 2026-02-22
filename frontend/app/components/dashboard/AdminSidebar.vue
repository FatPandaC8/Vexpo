<script setup lang="ts">
const emit = defineEmits<{ select: [payload: { view: string; data?: any }] }>()
const props = defineProps<{ activeView: string; activeId?: number }>()

const api = useApi()

type Section = 'users' | 'expos' | 'booths' | 'companies'
const section = ref<Section>('users')

const TABS = [
  { key: 'users',     label: 'Users',     icon: 'i-lucide-users'      },
  { key: 'expos',     label: 'Expos',     icon: 'i-lucide-calendar'   },
  { key: 'booths',    label: 'Booths',    icon: 'i-lucide-store'      },
  { key: 'companies', label: 'Companies', icon: 'i-lucide-building-2' },
]

const ENDPOINT: Record<Section, string> = {
  users: '/admin/users', expos: '/expos',
  booths: '/booths', companies: '/companies',
}
const EDIT_VIEW: Record<Section, string> = {
  users: 'admin-user-edit', expos: 'admin-expo-edit',
  booths: 'admin-booth-edit', companies: 'admin-company-edit',
}

const items   = ref<any[]>([])
const loading = ref(false)

async function load(s: Section) {
  loading.value = true
  try {
    const res = await api.getPaginated(ENDPOINT[s], { page: 1, limit: 20 })
    items.value = (res as any).items ?? res
  } catch { items.value = [] }
  finally { loading.value = false }
}

watch(section, (v) => load(v), { immediate: true })
defineExpose({ refresh: () => load(section.value) })

function label(item: any) {
  if (section.value === 'users') return item.name ?? item.email ?? `User #${item.id}`
  return item.name ?? `${section.value} #${item.id}`
}
function sub(item: any) {
  if (section.value === 'users')     return item.email ?? item.roles?.join(', ')
  if (section.value === 'expos')     return item.type ?? '—'
  if (section.value === 'booths')    return item.status ?? '—'
  if (section.value === 'companies') return item.industry ?? '—'
}
</script>

<template>
  <aside class="flex flex-col h-full">
    <SidebarTabs v-model="section" :tabs="TABS" :cols="2" />

    <SidebarSection
      :label="TABS.find(t => t.key === section)!.label"
      :loading="loading"
      @refresh="load(section)"
    />

    <SidebarEmptyState
      v-if="items.length === 0"
      :icon="TABS.find(t => t.key === section)!.icon"
      :title="`No ${section} found`"
    />

    <div v-else class="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
      <SidebarItem
        v-for="item in items"
        :key="item.id"
        :title="label(item)"
        :subtitle="sub(item)"
        :active="activeId === item.id && activeView === EDIT_VIEW[section]"
        @click="emit('select', { view: EDIT_VIEW[section], data: item })"
      />
    </div>
  </aside>
</template>