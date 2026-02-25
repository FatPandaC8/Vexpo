<script setup lang="ts">
import Header from '~/components/Header.vue'

const route = useRoute()
const api = useApi()

const expoId = Number(route.params.id)
const boothId = Number(route.params.id)

const booth = ref<any>(null)
const loading = ref(true)
const activeTab = ref<'overview' | '3d'>('3d')

async function fetchBooth() {
  loading.value = true
  try {
    booth.value = await api.get<any>(`/booths/${boothId}`)
  } catch {
    booth.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchBooth)

console.log(booth.value);

</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <Header />

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-32">
      <UIcon name="i-lucide-loader-circle" class="w-8 h-8 text-[#3d52d5] animate-spin" />
    </div>

    <!-- Not found -->
    <div v-else-if="!booth" class="text-center py-32">
      <p class="text-gray-500">Booth not found.</p>
      <NuxtLink :to="`/expos/${expoId}`" class="text-[#3d52d5] hover:underline text-sm mt-2 block">← Back to Expo</NuxtLink>
    </div>

    <template v-else>
      <!-- Topbar -->
      <div class="bg-white border-b border-gray-100 px-8 py-4">
        <div class="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-400">
          <NuxtLink to="/expos" class="hover:text-gray-700 transition">Expos</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="w-3.5 h-3.5" />
          <NuxtLink :to="`/expos/${expoId}`" class="hover:text-gray-700 transition">{{ booth.expo?.name }}</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="w-3.5 h-3.5" />
          <span class="text-gray-800 font-medium">{{ booth.name }}</span>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-8 py-8">
        <div class="grid grid-cols-3 gap-6">

          <!-- LEFT: Info panel -->
          <div class="col-span-1 space-y-4">
            <!-- Navigation tabs -->
            <div class="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm space-y-1">
              <button
                  v-for="tab in [
                    { key: '3d',       label: '3D View',   icon: 'i-lucide-box'          },
                    { key: 'overview', label: 'Overview',  icon: 'i-lucide-info'         },
                  ]"
                  :key="tab.key"
                  class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                  :class="activeTab === tab.key
                    ? 'bg-[#3d52d5] text-white'
                    : 'text-gray-600 hover:bg-gray-100'"
                  @click="activeTab = tab.key as any"
                >
                <UIcon :name="tab.icon" class="w-4 h-4" />
                {{ tab.label }}
              </button>
            </div>

          </div>

          <!-- RIGHT: Main content -->
          <div class="col-span-2">

            <!-- 3D Booth Viewer -->
            <template v-if="activeTab === '3d'">
              <div class="bg-gray-950 rounded-2xl overflow-hidden shadow-xl border border-gray-800" style="height: 560px;">
                <!-- 3D Scene rendered with CSS + canvas-like technique -->
                
              </div>
              <p class="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1.5">
                <UIcon name="i-lucide-mouse-pointer-2" class="w-3.5 h-3.5" />
                Interactive 3D booth — drag to rotate, scroll to zoom
              </p>
            </template>

            <!-- Overview -->
            <template v-else-if="activeTab === 'overview'">
              <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
                <div>
                  <h2 class="text-xl font-bold text-gray-900 mb-2">About this Booth</h2>
                  <p class="text-gray-600 leading-relaxed">
                    {{ booth.description ?? 'No description provided for this booth.' }}
                  </p>
                </div>

                <div v-if="booth.company" class="grid grid-cols-2 gap-4">
                  <div class="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p class="text-xs text-gray-400 mb-1">Company</p>
                    <p class="font-semibold text-gray-800">{{ booth.company.name }}</p>
                  </div>
                  <div class="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p class="text-xs text-gray-400 mb-1">Industry</p>
                    <p class="font-semibold text-gray-800">{{ booth.company.industry ?? '—' }}</p>
                  </div>
                  <div class="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p class="text-xs text-gray-400 mb-1">Contact</p>
                    <p class="font-semibold text-gray-800 text-sm truncate">{{ booth.company.email ?? '—' }}</p>
                  </div>
                  <div class="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p class="text-xs text-gray-400 mb-1">Website</p>
                    <a
                      v-if="booth.company.website"
                      :href="booth.company.website"
                      target="_blank"
                      class="text-xs text-[#3d52d5] hover:underline flex items-center gap-1"
                    >
                      <UIcon name="i-lucide-external-link" class="w-3 h-3" />
                      Visit Website
                    </a>
                  </div>
                </div>

                <div v-if="booth.company?.description" class="p-5 rounded-xl bg-blue-50 border border-blue-100">
                  <p class="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Company Description</p>
                  <p class="text-sm text-blue-900 leading-relaxed">{{ booth.company.description }}</p>
                </div>
              </div>
            </template>

          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
  .fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
  .fade-enter-from, .fade-leave-to { opacity: 0; }
</style>