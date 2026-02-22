<script setup lang="ts">
const api = useApi()
const auth = useAuth()

const loading = ref(false)
const expos = ref<any[]>([])

async function fetchExpos() {
  loading.value = true
  await new Promise(r => setTimeout(r, 2000))
  try {
    expos.value = await api.get<any[]>('/expos')
  } catch {
    expos.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchExpos)

const now = ref(new Date())

function getStatus(expo: any) {
  const start = new Date(expo.startDate)
  const end   = new Date(expo.endDate)
  if (now.value >= start && now.value <= end) return 'Live'
  if (now.value < start) return 'Upcoming'
  return 'Past'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const trendingExpos = computed(() =>
  [...expos.value]
    .sort((a, b) => {
      const order: Record<string, number> = { Live: 0, Upcoming: 1, Past: 2 }
      return (order[getStatus(a)] ?? 2) - (order[getStatus(b)] ?? 2)
    })
    .slice(0, 3)
)

const statusStyle: Record<string, string> = {
  Live:     'bg-emerald-100 text-emerald-700 border border-emerald-200',
  Upcoming: 'bg-blue-100 text-blue-700 border border-blue-200',
  Past:     'bg-gray-100 text-gray-500 border border-gray-200',
}
const statusDot: Record<string, string> = {
  Live:     'bg-emerald-400 animate-pulse',
  Upcoming: 'bg-blue-400',
  Past:     'bg-gray-400',
}
</script>

<template>
  <Header />
  <main class="bg-white">

    <!-- Intro -->
    <section class="min-h-screen flex items-center">
      <div class="grid grid-cols-2 items-center gap-12">
        <div class="p-40">
          <h1 class="text-5xl text-[#3d52d5] font-bold mb-6">
            Experience Virtual Expos Like Never Before
          </h1>
          <p class="text-gray-500 mb-8">
            Connect with global exhibitors, explore interactive booths, and network with
            thousands of professionals from the comfort of your screen.
          </p>
          <div class="flex gap-5">
            <UButton
              to="/expos" block
              class="bg-linear-to-r from-[#3d52d5] to-[#090c9b] hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 text-white cursor-pointer h-10 w-40 rounded-xl items-center flex"
              size="lg">
              <span class="mt-1">Explore Expo</span>
              <UIcon name="i-lucide-arrow-right" />
            </UButton>
            <UButton block
              class="border border-blue-100 hover:bg-blue-50 cursor-pointer h-10 w-40 rounded-xl"
              size="lg">
              Watch Demo
            </UButton>
          </div>
        </div>
        <div class="p-30">
          <img src="~/assets/images/expo_info_home.jpg"
            class="rounded-xl border-[#3d52d5] border-20 shadow-2xl w-200" />
        </div>
      </div>
    </section>

    <!-- Trending -->
    <section class="px-30 pb-24">
      <div class="flex flex-col items-center text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">Trending Virtual Expos</h1>
        <p class="text-gray-500 text-lg max-w-2xl mx-auto">
          Join thousands of professionals at these upcoming and live virtual exhibitions
        </p>
      </div>

      <!-- Skeleton: mirrors the real card layout exactly -->
      <div v-if="loading" class="grid grid-cols-3 gap-6">
        <div
          v-for="i in 3" :key="i"
          class="bg-gray-100 rounded-2xl p-6 flex flex-col gap-4"
        >
          <!-- Status + type pills -->
          <div class="flex gap-2">
            <USkeleton class="h-6 w-16 rounded-full" />
            <USkeleton class="h-6 w-20 rounded-full" />
          </div>
          <!-- Title -->
          <USkeleton class="h-5 w-3/4 rounded-lg" />
          <!-- Description -->
          <div class="flex flex-col gap-2 flex-1">
            <USkeleton class="h-3.5 w-full rounded" />
            <USkeleton class="h-3.5 w-5/6 rounded" />
          </div>
          <!-- Date row -->
          <USkeleton class="h-3 w-2/5 rounded" />
          <!-- Stats row -->
          <div class="pt-3 border-t border-gray-100 flex gap-3">
            <USkeleton class="h-3.5 w-16 rounded" />
            <USkeleton class="h-3.5 w-20 rounded" />
            <USkeleton class="h-3.5 w-12 rounded ml-auto" />
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="trendingExpos.length === 0" class="text-center py-16 text-gray-400">
        No expos available right now.
      </div>

      <!-- Cards -->
      <div v-else class="grid grid-cols-3 gap-6">
        <NuxtLink
          v-for="expo in trendingExpos"
          :key="expo.id"
          :to="`/expos/${expo.id}`"
          class="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
        >
          <div class="p-6 flex flex-col flex-1">
            <div class="flex items-center gap-2 mb-4">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="statusStyle[getStatus(expo)]">
                <span class="w-1.5 h-1.5 rounded-full" :class="statusDot[getStatus(expo)]" />
                {{ getStatus(expo) }}
              </span>
              <span v-if="expo.type"
                class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {{ expo.type }}
              </span>
            </div>

            <h3 class="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#3d52d5] transition-colors line-clamp-1">
              {{ expo.name }}
            </h3>
            <p class="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed flex-1">
              {{ expo.description ?? 'No description provided.' }}
            </p>

            <div class="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
              <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
              {{ formatDate(expo.startDate) }} → {{ formatDate(expo.endDate) }}
            </div>

            <div class="flex items-center gap-4 pt-4 border-t border-gray-100">
              <div class="flex items-center gap-1.5 text-xs text-gray-500">
                <UIcon name="i-lucide-store" class="w-3.5 h-3.5 text-violet-500" />
                <span><strong class="text-gray-800">{{ expo.booths?.length ?? 0 }}</strong> booths</span>
              </div>
              <div class="flex items-center gap-1.5 text-xs text-gray-500">
                <UIcon name="i-lucide-users" class="w-3.5 h-3.5 text-blue-500" />
                <span><strong class="text-gray-800">{{ expo.registrations?.length ?? 0 }}</strong> registered</span>
              </div>
              <div class="ml-auto flex items-center gap-1 text-xs font-semibold text-[#3d52d5] group-hover:gap-2 transition-all">
                Explore <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- See all -->
      <div class="text-center mt-8">
        <NuxtLink to="/expos"
          class="inline-flex items-center gap-2 text-sm font-semibold text-[#3d52d5] hover:text-blue-800 transition">
          Browse all expos <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>
    </section>

    <div v-if="auth.isLoggedIn.value === false">
        <!-- Why -->
        <section class="mb-40">
          <div class="flex flex-col items-center text-center mb-12">
            <h1 class="text-4xl font-bold mb-4">Why Choose ExpoVerse?</h1>
            <p class="text-gray-500 text-lg max-w-2xl mx-auto">
              Powerful features designed to make virtual exhibitions engaging and productive.
            </p>
          </div>
          <div class="grid grid-cols-4 gap-6 pl-30 pr-30 mb-20">
            <UCard class="p-8 text-center border rounded-2xl border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <UIcon name="i-lucide-map-pin" class="w-8 h-8 text-white" />
              </div>
              <h1 class="text-lg font-bold mb-2">Interactive 2D Maps</h1>
              <p class="text-sm text-gray-500">Navigate expo halls with ease using our intuitive floor plans</p>
            </UCard>
            <UCard class="p-8 text-center border rounded-2xl border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <UIcon name="i-lucide-zap" class="w-8 h-8 text-white" />
              </div>
              <h1 class="text-lg font-bold mb-2">Live Booth Experience</h1>
              <p class="text-sm text-gray-500">Immersive 3D booths</p>
            </UCard>
            <UCard class="p-8 text-center border rounded-2xl border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <UIcon name="i-lucide-users" class="w-8 h-8 text-white" />
              </div>
              <h1 class="text-lg font-bold mb-2">Networking Hub</h1>
              <p class="text-sm text-gray-500">Connect with exhibitors and organizers throughout the expo</p>
            </UCard>
            <UCard class="p-8 text-center border rounded-2xl border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <UIcon name="i-lucide-calendar-1" class="w-8 h-8 text-white" />
              </div>
              <h1 class="text-lg font-bold mb-2">Event Scheduling</h1>
              <p class="text-sm text-gray-500">Book meetings and never miss upcoming events</p>
            </UCard>
          </div>
        </section>
    
        <!-- Motto -->
        <section class="max-w-4xl mx-auto pb-24">
          <UCard class="flex justify-center text-center border-blue-200 bg-linear-to-br from-blue-600 to-blue-500 text-white shadow-2xl shadow-blue-500/40 rounded-2xl h-70">
            <div class="mb-8">
              <h1 class="text-4xl mt-8 font-bold">Ready to Transform Your Events?</h1>
              <p class="text-lg text-blue-200 mt-6 pl-30 pr-30">
                Join leading organizations using ExpoVerse to host world-class virtual exhibitions
              </p>
            </div>
            <div class="flex gap-5 justify-center">
              <UButton block
                class="bg-white hover:bg-blue-100 shadow-lg shadow-blue-500/30 text-blue-500 cursor-pointer h-10 w-40 rounded-xl"
                size="lg">Get Started Now</UButton>
              <UButton block
                class="bg-white hover:bg-blue-100 shadow-lg shadow-blue-500/30 text-blue-500 cursor-pointer h-10 w-40 rounded-xl"
                size="lg">Schedule Demo</UButton>
            </div>
          </UCard>
        </section>
    </div>
  </main>
  <Footer />
</template>