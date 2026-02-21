<script setup lang="ts">
import Header from '~/components/Header.vue'

const route = useRoute()
const api = useApi()

const expoId = Number(route.params.id)
const boothId = Number(route.params.boothId)

const booth = ref<any>(null)
const loading = ref(true)
const activeTab = ref<'overview' | '3d' | 'content'>('3d')

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

const statusStyle: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pending:  'bg-amber-100 text-amber-700 border-amber-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
}

// Deterministic color palette for booth branding
function boothAccent(name: string = '') {
  const palettes = [
    { bg: '#3d52d5', light: '#eef0fb', text: '#ffffff' },
    { bg: '#7c3aed', light: '#f3f0ff', text: '#ffffff' },
    { bg: '#0891b2', light: '#ecfeff', text: '#ffffff' },
    { bg: '#059669', light: '#ecfdf5', text: '#ffffff' },
    { bg: '#d97706', light: '#fffbeb', text: '#ffffff' },
  ]
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) % palettes.length
  return palettes[hash]
}

const accent = computed(() => boothAccent(booth.value?.name))
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
          <NuxtLink :to="`/expos/${expoId}`" class="hover:text-gray-700 transition">{{ booth.expo?.name ?? `Expo #${expoId}` }}</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="w-3.5 h-3.5" />
          <span class="text-gray-800 font-medium">{{ booth.name ?? `Booth #${boothId}` }}</span>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-8 py-8">
        <div class="grid grid-cols-3 gap-6">

          <!-- LEFT: Info panel -->
          <div class="col-span-1 space-y-4">

            <!-- Booth card -->
            <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <!-- Color header -->
              <div class="h-24 flex items-center justify-center" :style="{ background: accent.bg }">
                <div class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  <UIcon name="i-lucide-store" class="w-8 h-8 text-white" />
                </div>
              </div>

              <div class="p-5">
                <div class="flex items-start justify-between gap-2 mb-3">
                  <h1 class="text-xl font-bold text-gray-900 leading-tight">{{ booth.name }}</h1>
                  <span
                    v-if="booth.status"
                    class="px-2 py-0.5 rounded-full text-xs font-semibold border shrink-0 mt-0.5"
                    :class="statusStyle[booth.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'"
                  >
                    {{ booth.status }}
                  </span>
                </div>

                <p class="text-sm text-gray-500 leading-relaxed mb-4">
                  {{ booth.description ?? 'No description provided.' }}
                </p>

                <div v-if="booth.company" class="border-t border-gray-100 pt-4 space-y-2">
                  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Company</p>
                  <p class="text-sm font-bold text-gray-900">{{ booth.company.name }}</p>
                  <p v-if="booth.company.industry" class="text-xs text-gray-500">{{ booth.company.industry }}</p>
                  <p v-if="booth.company.country" class="text-xs text-gray-400 flex items-center gap-1">
                    <UIcon name="i-lucide-map-pin" class="w-3 h-3" />
                    {{ booth.company.city ? `${booth.company.city}, ` : '' }}{{ booth.company.country }}
                  </p>
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
            </div>

            <!-- Expo info -->
            <div v-if="booth.expo" class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Expo</p>
              <NuxtLink :to="`/expos/${expoId}`" class="font-bold text-gray-900 hover:text-[#3d52d5] transition text-sm">
                {{ booth.expo.name }}
              </NuxtLink>
              <p class="text-xs text-gray-400 mt-1">{{ booth.expo.type ?? '—' }}</p>
            </div>

            <!-- Navigation tabs -->
            <div class="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm">
              <button
                v-for="tab in [
                  { key: '3d',       label: '3D View',   icon: 'i-lucide-box'          },
                  { key: 'overview', label: 'Overview',  icon: 'i-lucide-info'         },
                  { key: 'content',  label: 'Content',   icon: 'i-lucide-layout-grid'  },
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
                <Booth3DScene
                  :booth="booth"
                  :accent="accent.bg"
                />
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
                    <p class="text-xs text-gray-400 mb-1">Location</p>
                    <p class="font-semibold text-gray-800">
                      {{ booth.company.city ? `${booth.company.city}, ` : '' }}{{ booth.company.country ?? '—' }}
                    </p>
                  </div>
                  <div class="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p class="text-xs text-gray-400 mb-1">Contact</p>
                    <p class="font-semibold text-gray-800 text-sm truncate">{{ booth.company.email ?? '—' }}</p>
                  </div>
                </div>

                <div v-if="booth.company?.description" class="p-5 rounded-xl bg-blue-50 border border-blue-100">
                  <p class="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Company Description</p>
                  <p class="text-sm text-blue-900 leading-relaxed">{{ booth.company.description }}</p>
                </div>
              </div>
            </template>

            <!-- Content -->
            <template v-else-if="activeTab === 'content'">
              <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 class="text-xl font-bold text-gray-900 mb-6">Booth Content</h2>

                <div v-if="!booth.content" class="text-center py-16">
                  <UIcon name="i-lucide-package-open" class="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p class="text-gray-500 font-medium">No content added yet</p>
                  <p class="text-sm text-gray-400 mt-1">The exhibitor hasn't uploaded materials for this booth.</p>
                </div>

                <div v-else class="space-y-6">
                  <!-- Logo -->
                  <div v-if="booth.content?.logo">
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Logo</p>
                    <img :src="booth.content.logo" alt="Booth logo" class="h-16 object-contain rounded-xl border border-gray-100" />
                  </div>

                  <!-- Banner -->
                  <div v-if="booth.content?.bannerImage">
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Banner</p>
                    <img :src="booth.content.bannerImage" alt="Banner" class="w-full rounded-xl object-cover h-40 border border-gray-100" />
                  </div>

                  <!-- Videos -->
                  <div v-if="booth.content?.videos?.length">
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Videos</p>
                    <div class="space-y-2">
                      <a
                        v-for="(video, i) in booth.content.videos"
                        :key="i"
                        :href="video"
                        target="_blank"
                        class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
                      >
                        <div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                          <UIcon name="i-lucide-play" class="w-4 h-4 text-red-500" />
                        </div>
                        <span class="text-sm text-gray-700 truncate">{{ video }}</span>
                      </a>
                    </div>
                  </div>

                  <!-- Documents -->
                  <div v-if="booth.content?.documents?.length">
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Documents</p>
                    <div class="space-y-2">
                      <a
                        v-for="(doc, i) in booth.content.documents"
                        :key="i"
                        :href="doc"
                        target="_blank"
                        class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
                      >
                        <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <UIcon name="i-lucide-file-text" class="w-4 h-4 text-blue-500" />
                        </div>
                        <span class="text-sm text-gray-700 truncate">Document {{ i + 1 }}</span>
                      </a>
                    </div>
                  </div>
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