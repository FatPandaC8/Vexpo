<script setup lang="ts">
import Header from '~/components/Header.vue'

const api = useApi()

const search = ref('')
const selectedType = ref('All')
const selectedStatus = ref('All')
const loading = ref(false)
const expos = ref<any[]>([])

const types = ['All', 'Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing']
const statuses = ['All', 'Live', 'Upcoming', 'Archived']

async function fetchExpos() {
  loading.value = true
  try {
    const params = selectedType.value !== 'All' ? { type: selectedType.value } : {} // consider for filter type for searching expo
    const data = await api.get<any[]>('/expos')
    expos.value = data
  } catch {
    expos.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchExpos)

watch(selectedType, fetchExpos)

const now = ref<Date | null>(null)

onMounted(() => {
  now.value = new Date()
})

function getStatus(expo: any) {
  if (!now.value) return 'Upcoming'

  const start = new Date(expo.startDate)
  const end = new Date(expo.endDate)

  if (now.value >= start && now.value <= end) return 'Live'
  if (now.value < start) return 'Upcoming'
  return 'Past'
}

const filteredExpos = computed(() => {
  let list = expos.value

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(e => e.name?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q))
  }

  if (selectedType.value !== 'All') {
    list = list.filter(e => e.type === selectedType.value)
  }

  if (selectedStatus.value !== 'All') {
    list = list.filter(e => getStatus(e) === selectedStatus.value)
  }

  return list
})

const statusStyle: Record<string, string> = {
  Live:     'bg-emerald-100 text-emerald-700 border border-emerald-200',
  Upcoming: 'bg-blue-100 text-blue-700 border border-blue-200',
  Archive:  'bg-gray-100 text-gray-500 border border-gray-200',
}

const statusDot: Record<string, string> = {
  Live:     'bg-emerald-400',
  Upcoming: 'bg-blue-400',
  Archived: 'bg-gray-400',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function boothCount(expo: any) {
  return expo.booths?.length ?? 0
}

</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <Header />

    <!-- Hero -->
    <section class="bg-linear-to-br from-[#3d52d5] to-[#090c9b] text-white py-16 px-8">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-4xl font-bold mb-3">Discover Virtual Expos</h1>
        <p class="text-blue-200 text-lg mb-8">Explore live and upcoming exhibitions from around the world</p>

        <!-- Search bar -->
        <div class="max-w-2xl mx-auto flex gap-3">
          <div class="flex-1 relative">
            <UIcon name="i-lucide-search" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              v-model="search"
              type="text"
              placeholder="Search expo name or description..."
              class="w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-white text-gray-800 text-sm shadow-lg focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
          <button
            class="px-6 py-3 bg-white text-[#3d52d5] font-semibold rounded-xl shadow-lg hover:bg-blue-50 transition text-sm"
            @click="fetchExpos"
          >
            Search
          </button>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-8 py-10">
      <div class="flex gap-8">

        <!-- Sidebar filters -->
        <aside class="w-64 shrink-0 space-y-5">

          <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-layers" class="w-3.5 h-3.5" />
              Categories
            </h3>
            <div class="space-y-1">
              <button
                v-for="type in types"
                :key="type"
                class="w-full text-left px-3 py-2 rounded-xl text-sm transition-all font-medium"
                :class="selectedType === type
                  ? 'bg-[#3d52d5] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'"
                @click="selectedType = type"
              >
                {{ type }}
              </button>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-radio" class="w-3.5 h-3.5" />
              Status
            </h3>
            <div class="space-y-1">
              <button
                v-for="status in statuses"
                :key="status"
                class="w-full text-left px-3 py-2 rounded-xl text-sm transition-all font-medium flex items-center gap-2"
                :class="selectedStatus === status
                  ? 'bg-[#3d52d5] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'"
                @click="selectedStatus = status"
              >
                <span
                  v-if="status !== 'All'"
                  class="w-2 h-2 rounded-full shrink-0"
                  :class="selectedStatus === status ? 'bg-white' : statusDot[status]"
                />
                {{ status }}
              </button>
            </div>
          </div>
        </aside>

        <!-- Expo grid -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-6">
            <p class="text-sm text-gray-500">
              Showing <strong class="text-gray-800">{{ filteredExpos.length }}</strong> expo{{ filteredExpos.length !== 1 ? 's' : '' }}
            </p>
          </div>

          <!-- Loading -->
          <!--IMPORTANT: change to skeleton animation while loading-->
          <div v-if="loading" class="grid grid-cols-2 gap-5">
            <div v-for="i in 4" :key="i" class="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
              <div class="h-4 bg-gray-200 rounded-full mb-3 w-3/4" />
              <div class="h-3 bg-gray-100 rounded-full mb-2 w-full" />
              <div class="h-3 bg-gray-100 rounded-full mb-5 w-2/3" />
              <div class="h-8 bg-gray-200 rounded-xl w-1/3" />
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="filteredExpos.length === 0" class="text-center py-20">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <UIcon name="i-lucide-calendar-x" class="w-8 h-8 text-gray-400" />
            </div>
            <p class="font-semibold text-gray-700 mb-1">No expos found</p>
            <p class="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>

          <!-- Cards -->
          <div v-else class="grid grid-cols-2 gap-5">
            <NuxtLink
              v-for="expo in filteredExpos"
              :key="expo.id"
              :to="`/expos/${expo.id}`"
              class="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 overflow-hidden"
            >

              <div class="p-6">
                <!-- Status + type row -->
                <div class="flex items-center gap-2 mb-3">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" :class="statusStyle[getStatus(expo)]">
                    <span class="w-1.5 h-1.5 rounded-full" :class="statusDot[getStatus(expo)]" />
                    {{ getStatus(expo) }}
                  </span>
                  <span v-if="expo.type" class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {{ expo.type }}
                  </span>
                </div>

                <h3 class="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#3d52d5] transition-colors line-clamp-1">
                  {{ expo.name }}
                </h3>
                <p class="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed">
                  {{ expo.description ?? 'No description provided.' }}
                </p>

                <!-- Date range -->
                <div class="flex items-center gap-2 text-xs text-gray-400 mb-4">
                  <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                  <span>{{ formatDate(expo.startDate) }} → {{ formatDate(expo.endDate) }}</span>
                </div>

                <!-- Stats row -->
                <div class="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div class="flex items-center gap-1.5 text-xs text-gray-500">
                    <UIcon name="i-lucide-store" class="w-3.5 h-3.5 text-violet-500" />
                    <span><strong class="text-gray-800">{{ boothCount(expo) }}</strong> booths</span>
                  </div>
                  <div class="ml-auto flex items-center gap-1 text-xs font-semibold text-[#3d52d5] group-hover:gap-2 transition-all">
                    Explore
                    <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>