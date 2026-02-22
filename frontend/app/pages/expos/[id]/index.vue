<script setup lang="ts">
import Header from '~/components/Header.vue'

const route = useRoute()
const router = useRouter()
const api = useApi()

const expoId = Number(route.params.id)

const expo = ref<any>(null)
const booths = ref<any[]>([])
const loading = ref(true)
const registering = ref(false)
const registerSuccess = ref(false)
const registerError = ref<string | null>(null)
const viewMode = ref<'map' | 'list'>('map')
const hoveredBoothId = ref<number | null>(null)

async function fetchExpo() {
  loading.value = true
  try {
    expo.value = await api.get<any>(`/expos/${expoId}`)
    // booths.value = await api.get<any[]>(`/expos/${expoId}/booths`)
  } catch {
    expo.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchExpo)

const today = new Date()

const expoStatus = computed(() => {
  if (!expo.value) return 'Unknown'
  const start = new Date(expo.value.startDate)
  const end = new Date(expo.value.endDate)
  if (today >= start && today <= end) return 'Live'
  if (today < start) return 'Upcoming'
  return 'Past'
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

// SVG Floor Map constants
const COLS   = 4
const BW     = 172   // booth width
const BH     = 118   // booth height
const GAP_X  = 20    // horizontal gap between booths
const GAP_Y  = 56    // vertical gap = aisle
const OUTER  = 52    // outer hall padding

const boothPositions = computed(() =>
  booths.value.map((booth, i) => ({
    ...booth,
    x: OUTER + (i % COLS) * (BW + GAP_X),
    y: OUTER + Math.floor(i / COLS) * (BH + GAP_Y),
  }))
)

const numCols = computed(() => Math.min(booths.value.length, COLS))
const numRows = computed(() => Math.ceil(booths.value.length / COLS))

const svgW = computed(() =>
  Math.max(600, OUTER * 2 + numCols.value * (BW + GAP_X) - GAP_X)
)
const svgH = computed(() =>
  OUTER * 2 + numRows.value * BH + Math.max(0, numRows.value - 1) * GAP_Y + 52 // entrance footer
)

// Status styling maps
const boothFill: Record<string, string> = {
  approved: '#eef0fb',
  pending:  '#fffbeb',
  rejected: '#fef2f2',
}
const boothStroke: Record<string, string> = {
  approved: '#3d52d5',
  pending:  '#f59e0b',
  rejected: '#ef4444',
}

function trunc(str: string, max: number) {
  if (!str) return ''
  return str.length > max ? str.slice(0, max - 1) + '…' : str
}

function navigateToBooth(id: number) {
  router.push(`/expos/${expoId}/booths/${id}`)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <Header />

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-40">
      <div class="flex flex-col items-center gap-4">
        <div class="w-10 h-10 border-4 border-[#3d52d5]/20 border-t-[#3d52d5] rounded-full animate-spin" />
        <p class="text-sm text-gray-400">Loading expo…</p>
      </div>
    </div>

    <!-- Not found -->
    <div v-else-if="!expo" class="text-center py-40">
      <p class="text-gray-500 mb-3">Expo not found.</p>
      <NuxtLink to="/expos" class="text-[#3d52d5] hover:underline text-sm">← Back to Expos</NuxtLink>
    </div>

    <template v-else>
      <!-- Hero -->
      <section class="bg-linear-to-br from-[#3d52d5] via-[#2a3ab0] to-[#090c9b] text-white">
        <div class="max-w-7xl mx-auto px-8 py-12">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-sm text-blue-300 mb-8">
            <NuxtLink to="/expos" class="hover:text-white transition">Expos</NuxtLink>
            <span class="text-blue-400">/</span>
            <span class="text-white truncate max-w-xs">{{ expo.name }}</span>
          </div>

          <div class="flex flex-col lg:flex-row items-start gap-10">
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5 border"
                :class="{
                  'bg-emerald-400/20 border-emerald-400/40 text-emerald-300': expoStatus === 'Live',
                  'bg-blue-400/20 border-blue-400/40 text-blue-300': expoStatus === 'Upcoming',
                  'bg-white/10 border-white/20 text-white/60': expoStatus === 'Past',
                }"
              >
                <span
                  class="w-2 h-2 rounded-full"
                  :class="{
                    'bg-emerald-400 animate-pulse': expoStatus === 'Live',
                    'bg-blue-400': expoStatus === 'Upcoming',
                    'bg-white/40': expoStatus === 'Past',
                  }"
                />
                {{ expoStatus }}
              </div>

              <h1 class="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">{{ expo.name }}</h1>
              <p class="text-blue-200 text-base leading-relaxed mb-7 max-w-2xl">
                {{ expo.description || 'No description provided.' }}
              </p>

              <div class="flex flex-wrap gap-3">
                <div class="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-sm">
                  {{ formatDate(expo.startDate) }} – {{ formatDate(expo.endDate) }}
                </div>
                <div v-if="expo.type" class="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-sm">
                  {{ expo.type }}
                </div>
                <div class="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-sm">
                  {{ booths.length }} booth{{ booths.length !== 1 ? 's' : '' }}
                </div>
                <div class="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-sm">
                  {{ expo.registrations?.length ?? 0 }} registered
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Hall section -->
      <section class="max-w-7xl mx-auto px-8 py-10">

        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Expo Hall</h2>
          </div>
          <div v-if="booths.length > 0" class="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm gap-1">
            <button
              class="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              :class="viewMode === 'map' ? 'bg-[#3d52d5] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'"
              @click="viewMode = 'map'"
            >⊞ Map</button>
            <button
              class="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              :class="viewMode === 'list' ? 'bg-[#3d52d5] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'"
              @click="viewMode = 'list'"
            >≡ List</button>
          </div>
        </div>

        <!-- Empty -->
        <div v-if="booths.length === 0" class="bg-white rounded-2xl border border-gray-200 py-24 text-center">
          <p class="font-semibold text-gray-500">No approved booths yet</p>
        </div>

        <!-- SVG Floor Map -->
        <template v-else-if="viewMode === 'map'">
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            <!-- Legend -->
            <div class="flex items-center gap-6 px-6 py-3 border-b border-gray-100 bg-gray-50/80">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Legend</span>
              <span class="flex items-center gap-1.5 text-xs text-gray-600">
                <span class="inline-block w-3 h-3 rounded border-2 border-[#3d52d5] bg-[#eef0fb]" />Approved
              </span>
              <span class="flex items-center gap-1.5 text-xs text-gray-600">
                <span class="inline-block w-3 h-3 rounded border-2 border-amber-400 bg-amber-50" />Pending
              </span>
              <span class="ml-auto text-xs text-gray-400">{{ booths.length }} booth{{ booths.length !== 1 ? 's' : '' }}</span>
            </div>

            <!-- Scrollable SVG -->
            <div class="overflow-auto" style="max-height: 700px;">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                :viewBox="`0 0 ${svgW} ${svgH}`"
                :width="svgW"
                :height="svgH"
                style="display: block; min-width: 100%;"
              >
                <!-- Dot-grid background -->
                <defs>
                  <pattern id="grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1.2" fill="#c7d2fe" opacity="0.45" />
                  </pattern>
                  <!-- Glow filter for hovered booths -->
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
                    <feFlood flood-color="#3d52d5" flood-opacity="0.25" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="shadow" />
                    <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                <!-- Floor -->
                <rect x="0" y="0" :width="svgW" :height="svgH" fill="#f0f4ff" />
                <rect x="0" y="0" :width="svgW" :height="svgH" fill="url(#grid)" />

                <!-- Inner hall card -->
                <rect
                  :x="OUTER / 2" :y="OUTER / 2"
                  :width="svgW - OUTER" :height="svgH - OUTER"
                  rx="20" fill="white"
                  stroke="#dde4ff" stroke-width="2"
                />

                <!-- Hall header bar -->
                <rect :x="OUTER / 2" :y="OUTER / 2" :width="svgW - OUTER" height="36" rx="20" fill="#f5f7ff" />
                <rect :x="OUTER / 2" :y="OUTER / 2 + 16" :width="svgW - OUTER" height="20" fill="#f5f7ff" />
                <text
                  :x="svgW / 2" :y="OUTER / 2 + 22"
                  font-family="system-ui,-apple-system,sans-serif"
                  font-size="12" font-weight="700" fill="#6366f1"
                  text-anchor="middle" letter-spacing="0.12em"
                >EXPO HALL A — {{ trunc(expo.name, 50) }}</text>

                <!-- Aisle dashed lines between rows -->
                <g v-for="r in numRows - 1" :key="r">
                  <line
                    :x1="OUTER / 2 + 10"
                    :y1="OUTER + r * BH + (r - 0.5) * GAP_Y + GAP_Y / 2"
                    :x2="svgW - OUTER / 2 - 10"
                    :y2="OUTER + r * BH + (r - 0.5) * GAP_Y + GAP_Y / 2"
                    stroke="#c7d2fe" stroke-width="1" stroke-dasharray="10 6"
                  />
                  <text
                    :x="OUTER / 2 + 16"
                    :y="OUTER + r * BH + (r - 0.5) * GAP_Y + GAP_Y / 2 - 5"
                    font-family="system-ui,sans-serif" font-size="9" fill="#a5b4fc" font-weight="600"
                  >AISLE {{ r }}</text>
                </g>

                <!-- Entrance -->
                <rect :x="svgW / 2 - 64" :y="svgH - 44" width="128" height="30" rx="15" fill="#3d52d5" />
                <text
                  :x="svgW / 2" :y="svgH - 23"
                  font-family="system-ui,sans-serif" font-size="12" font-weight="800"
                  fill="white" text-anchor="middle" letter-spacing="0.08em"
                >▲  ENTRANCE</text>

                <!-- Booth cards -->
                <g
                  v-for="booth in boothPositions"
                  :key="booth.id"
                  style="cursor:pointer"
                  @click="navigateToBooth(booth.id)"
                  @mouseenter="hoveredBoothId = booth.id"
                  @mouseleave="hoveredBoothId = null"
                >
                  <!-- Card bg -->
                  <rect
                    :x="booth.x" :y="booth.y"
                    :width="BW" :height="BH"
                    rx="12"
                    :fill="hoveredBoothId === booth.id ? '#eef2ff' : (boothFill[booth.status] ?? '#f5f7ff')"
                    :stroke="boothStroke[booth.status] ?? '#a5b4fc'"
                    :stroke-width="hoveredBoothId === booth.id ? 2.5 : 1.5"
                    :filter="hoveredBoothId === booth.id ? 'url(#glow)' : 'none'"
                  />

                  <!-- Top accent bar -->
                  <rect :x="booth.x" :y="booth.y" :width="BW" height="7" rx="12" :fill="boothStroke[booth.status] ?? '#3d52d5'" />
                  <rect :x="booth.x" :y="booth.y + 4" :width="BW" height="3" :fill="boothStroke[booth.status] ?? '#3d52d5'" />

                  <!-- ID badge top-right -->
                  <rect :x="booth.x + BW - 38" :y="booth.y + 12" width="30" height="18" rx="6"
                    :fill="boothStroke[booth.status] ?? '#3d52d5'" opacity="0.14" />
                  <text
                    :x="booth.x + BW - 23" :y="booth.y + 24"
                    font-family="ui-monospace,monospace" font-size="10" font-weight="800"
                    :fill="boothStroke[booth.status] ?? '#3d52d5'" text-anchor="middle"
                  >#{{ booth.id }}</text>

                  <!-- Booth name -->
                  <text
                    :x="booth.x + 12" :y="booth.y + 32"
                    font-family="system-ui,-apple-system,sans-serif"
                    font-size="13" font-weight="700" fill="#1e293b"
                  >{{ trunc(booth.name ?? 'Unnamed Booth', 18) }}</text>

                  <!-- Company -->
                  <text
                    :x="booth.x + 12" :y="booth.y + 50"
                    font-family="system-ui,sans-serif" font-size="10" fill="#64748b"
                  >{{ trunc(booth.company?.name ?? '—', 24) }}</text>

                  <!-- Divider -->
                  <line
                    :x1="booth.x + 12" :y1="booth.y + 62"
                    :x2="booth.x + BW - 12" :y2="booth.y + 62"
                    stroke="#e2e8f0" stroke-width="1"
                  />

                  <!-- Status label -->
                  <rect :x="booth.x + 12" :y="booth.y + 70" width="66" height="18" rx="9"
                    :fill="boothStroke[booth.status] ?? '#3d52d5'" opacity="0.13" />
                  <text
                    :x="booth.x + 45" :y="booth.y + 82"
                    font-family="system-ui,sans-serif" font-size="9" font-weight="800"
                    :fill="boothStroke[booth.status] ?? '#3d52d5'" text-anchor="middle"
                    letter-spacing="0.06em"
                  >{{ (booth.status ?? 'pending').toUpperCase() }}</text>

                  <!-- Enter arrow / label -->
                  <text
                    v-if="hoveredBoothId !== booth.id"
                    :x="booth.x + BW - 18" :y="booth.y + BH - 10"
                    font-family="system-ui,sans-serif" font-size="16" font-weight="700"
                    :fill="boothStroke[booth.status] ?? '#3d52d5'" text-anchor="middle" opacity="0.45"
                  >→</text>
                  <g v-else>
                    <rect :x="booth.x + BW - 88" :y="booth.y + BH - 26" width="80" height="20" rx="10"
                      :fill="boothStroke[booth.status] ?? '#3d52d5'" />
                    <text
                      :x="booth.x + BW - 48" :y="booth.y + BH - 12"
                      font-family="system-ui,sans-serif" font-size="10" font-weight="700"
                      fill="white" text-anchor="middle"
                    >Enter Booth →</text>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </template>

        <!-- ── List view ── -->
        <template v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              v-for="booth in booths"
              :key="booth.id"
              class="group text-left bg-white rounded-2xl border border-gray-200 hover:border-[#3d52d5] hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 p-5 flex items-center gap-4"
              @click="navigateToBooth(booth.id)"
            >
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-white text-lg"
                :style="{ background: boothStroke[booth.status] ?? '#3d52d5' }"
              >
                {{ (booth.name ?? '#')[0].toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-900 truncate group-hover:text-[#3d52d5] transition-colors">
                  {{ booth.name ?? 'Booth #' + booth.id }}
                </p>
                <p class="text-xs text-gray-400 truncate mt-0.5">{{ booth.company?.name ?? '—' }}</p>
                <span
                  class="inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                  :style="{ background: (boothStroke[booth.status] ?? '#3d52d5') + '22', color: boothStroke[booth.status] ?? '#3d52d5' }"
                >{{ booth.status }}</span>
              </div>
              <span class="text-gray-300 group-hover:text-[#3d52d5] transition-colors text-lg shrink-0">→</span>
            </button>
          </div>
        </template>

      </section>
    </template>
  </div>
</template>