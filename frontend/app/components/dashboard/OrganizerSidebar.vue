<script setup lang="ts">
const emit = defineEmits<{
  select: [payload: { view: string; data?: any }]
}>()

const props = defineProps<{
  activeView: string
  activeId?: number
}>()

const api = useApi()
const section = ref<'expos' | 'booths'>('expos')

// Expos
const expos = ref<any[]>([])
const loadingExpos = ref(false)

async function loadExpos() {
  loadingExpos.value = true
  try {
    expos.value = await api.get('/me/expos')
  } catch {
    expos.value = []
  } finally {
    loadingExpos.value = false
  }
}

// Booth Requests 
const booths = ref<any[]>([])
const loadingBooths = ref(false)

async function loadBooths() {
  loadingBooths.value = true
  try {
    booths.value = await api.get('/me/booth-requests')
  } catch {
    booths.value = []
  } finally {
    loadingBooths.value = false
  }
}

onMounted(() => {
  loadExpos()
})

watch(section, (s) => {
  if (s === 'booths') loadBooths()
})

defineExpose({
  refreshExpos: loadExpos,
  refreshBooths: loadBooths
})

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
}
</script>

<template>
  <aside class="flex flex-col h-full">

    <!-- Tabs -->
    <div class="grid grid-cols-2 gap-0.5 p-1 mb-4 bg-gray-100 rounded-xl">
      <button
        v-for="tab in [
          { key: 'expos',  label: 'My Expos', icon: 'i-lucide-calendar' },
          { key: 'booths', label: 'Booths',   icon: 'i-lucide-store' }
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

    <!-- Header row -->
    <template v-if="section === 'expos'">

      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          My Expos
        </span>

        <div class="flex items-center gap-2">
          <UButton
            variant="ghost"
            size="xs"
            icon="i-lucide-refresh-cw"
            :loading="loadingExpos"
            class="text-[#3d52d5] hover:text-blue-800"
            @click="loadExpos"
          />

          <UButton
            size="xs"
            icon="i-lucide-plus"
            class="bg-[#3d52d5] text-white hover:bg-blue-700"
            @click="emit('select', { view: 'create-expo' })"
          >
            New
          </UButton>
        </div>
      </div>

      <div v-if="expos.length === 0"
           class="flex flex-col items-center justify-center flex-1 text-center py-8">
        <UIcon name="i-lucide-calendar-x" class="w-8 h-8 text-gray-300 mb-2" />
        <p class="text-xs text-gray-400">No expos yet</p>
      </div>

      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <button
          v-for="expo in expos"
          :key="expo.id"
          class="w-full text-left rounded-xl border p-3 transition-all"
          :class="activeId === expo.id
            ? 'border-[#3d52d5]/40 bg-blue-50'
            : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/20'"
          @click="emit('select', { view: 'expo-manage', data: expo })"
        >
          <p class="text-sm font-semibold text-gray-800 truncate">
            {{ expo.title }}
          </p>

          <p class="text-xs text-gray-400 mt-0.5 truncate">
            {{ expo.location ?? '—' }}
          </p>
        </button>
      </div>

    </template>

    <template v-else>

      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Booth Requests
        </span>

        <UButton
            variant="ghost"
            size="xs"
            icon="i-lucide-refresh-cw"
            :loading="loadingExpos"
            class="text-[#3d52d5] hover:text-blue-800"
            @click="loadBooths"
        />
      </div>

      <div v-if="booths.length === 0"
           class="flex flex-col items-center justify-center flex-1 text-center py-8">
        <UIcon name="i-lucide-store" class="w-8 h-8 text-gray-300 mb-2" />
        <p class="text-xs text-gray-400">No booth requests</p>
      </div>

      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <button
          v-for="booth in booths"
          :key="booth.id"
          class="w-full text-left rounded-xl border p-3 transition-all"
          @click="emit('select', { view: 'booth-review', data: booth })"
        >
          <p class="text-sm font-semibold text-gray-800 truncate">
            {{ booth.company?.name ?? 'Booth #' + booth.id }}
          </p>

          <p class="text-xs text-gray-400 mt-0.5 truncate">
            {{ booth.expo?.title ?? 'Expo' }}
          </p>

          <span
            class="text-xs font-medium px-1.5 py-0.5 rounded-md mt-1.5 inline-block"
            :class="statusColor[booth.status] ?? 'bg-gray-100 text-gray-600'"
          >
            {{ booth.status ?? 'pending' }}
          </span>
        </button>
      </div>

    </template>

  </aside>
</template>