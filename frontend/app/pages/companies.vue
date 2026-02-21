<script setup lang="ts">
import Header from '~/components/Header.vue'

const api = useApi()

const search = ref('')
const selectedIndustry = ref('All')
const loading = ref(false)
const companies = ref<any[]>([])

const industries = ['All', 'Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Energy']

async function fetchCompanies() {
  loading.value = true
  try {
    const data = await api.getPaginated<any>('/companies', { page: 1, limit: 20 })
    companies.value = data.items ?? data
  } catch {
    // fallback: try non-paginated
    try {
      companies.value = await api.get<any[]>('/companies')
    } catch {
      companies.value = []
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchCompanies)

const filteredCompanies = computed(() => {
  let list = companies.value

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.industry?.toLowerCase().includes(q)
    )
  }

  if (selectedIndustry.value !== 'All') {
    list = list.filter(c => c.industry === selectedIndustry.value)
  }

  return list
})

// Deterministic pastel color per company name
function companyColor(name: string = '') {
  const colors = [
    'from-blue-400 to-blue-600',
    'from-violet-400 to-violet-600',
    'from-emerald-400 to-emerald-600',
    'from-amber-400 to-amber-600',
    'from-rose-400 to-rose-600',
    'from-cyan-400 to-cyan-600',
    'from-indigo-400 to-indigo-600',
  ]
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) % colors.length
  return colors[hash]
}

function initials(name: string = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function boothCount(company: any) {
  return company.booths?.length ?? 0
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <Header />

    <!-- Hero -->
    <section class="bg-linear-to-br from-slate-800 to-slate-900 text-white py-16 px-8">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-4xl font-bold mb-3">Exhibiting Companies</h1>
        <p class="text-slate-400 text-lg mb-8">Browse companies showcasing at ExpoVerse events</p>

        <div class="max-w-2xl mx-auto flex gap-3">
          <div class="flex-1 relative">
            <UIcon name="i-lucide-search" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              v-model="search"
              type="text"
              placeholder="Search company name, industry..."
              class="w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-white text-gray-800 text-sm shadow-lg focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
          <button
            class="px-6 py-3 bg-[#3d52d5] text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition text-sm"
            @click="fetchCompanies"
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
              <UIcon name="i-lucide-building-2" class="w-3.5 h-3.5" />
              Industry
            </h3>
            <div class="space-y-1">
              <button
                v-for="industry in industries"
                :key="industry"
                class="w-full text-left px-3 py-2 rounded-xl text-sm transition-all font-medium"
                :class="selectedIndustry === industry
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'"
                @click="selectedIndustry = industry"
              >
                {{ industry }}
              </button>
            </div>
          </div>
        </aside>

        <!-- Companies grid -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-6">
            <p class="text-sm text-gray-500">
              Showing <strong class="text-gray-800">{{ filteredCompanies.length }}</strong> compan{{ filteredCompanies.length !== 1 ? 'ies' : 'y' }}
            </p>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="grid grid-cols-3 gap-5">
            <div v-for="i in 6" :key="i" class="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
              <div class="w-14 h-14 bg-gray-200 rounded-2xl mb-4" />
              <div class="h-4 bg-gray-200 rounded-full mb-2 w-3/4" />
              <div class="h-3 bg-gray-100 rounded-full w-1/2" />
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="filteredCompanies.length === 0" class="text-center py-20">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <UIcon name="i-lucide-building-2" class="w-8 h-8 text-gray-400" />
            </div>
            <p class="font-semibold text-gray-700 mb-1">No companies found</p>
            <p class="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>

          <!-- Cards -->
          <div v-else class="grid grid-cols-3 gap-5">
            <div
              v-for="company in filteredCompanies"
              :key="company.id"
              class="group bg-white rounded-2xl border border-gray-200 hover:border-slate-400 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div class="p-6">
                <!-- Logo / avatar -->
                <div
                  class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg mb-4 bg-linear-to-br shadow-md"
                  :class="companyColor(company.name)"
                >
                  {{ initials(company.name) }}
                </div>

                <h3 class="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#3d52d5] transition-colors">
                  {{ company.name }}
                </h3>

                <div class="flex items-center gap-1.5 mb-3">
                  <span v-if="company.industry" class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {{ company.industry }}
                  </span>
                  <span v-if="company.country" class="text-xs text-gray-400">{{ company.city ? `${company.city}, ` : '' }}{{ company.country }}</span>
                </div>

                <p class="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                  {{ company.description ?? 'No description provided.' }}
                </p>

                <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div class="flex items-center gap-1.5 text-xs text-gray-400">
                    <UIcon name="i-lucide-store" class="w-3.5 h-3.5 text-violet-400" />
                    <span>{{ boothCount(company) }} booth{{ boothCount(company) > 1 ? 's' : '' }}</span>
                  </div>
                  <a
                    v-if="company.website"
                    :href="company.website"
                    target="_blank"
                    class="text-xs text-[#3d52d5] hover:underline flex items-center gap-1"
                    @click.stop
                  >
                    Website
                    <UIcon name="i-lucide-external-link" class="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>