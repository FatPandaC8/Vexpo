<script setup lang="ts">
// TODO Today: Add organizer information tab next to the expo information
import Header from "~/components/Header.vue";

const route = useRoute();
const router = useRouter();
const api = useApi();
const MAP_ROWS = 5;
const MAP_COLS = 6;

const rows = Array.from({ length: MAP_ROWS }, (_, i) => i);
const cols = Array.from({ length: MAP_COLS }, (_, j) => j);

const expoId = Number(route.params.id);

const expo = ref<any>(null);
const booths = ref<any[]>([]);
const loading = ref(true);
const organizer = ref<any>(null);

async function fetchExpo() {
  loading.value = true;
  try {
    expo.value = await api.get<any>(`/expos/${expoId}`);
    organizer.value = await api.get<any>(`/users/${expo.value.organizerId}`);
    booths.value = await api.get<any[]>(`/expos/${expoId}/booths`);
  } catch {
    expo.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchExpo);

const today = new Date();

const expoStatus = computed(() => {
  if (!expo.value) return "Unknown";
  const start = new Date(expo.value.startDate);
  const end = new Date(expo.value.endDate);
  if (today >= start && today <= end) return "Live";
  if (today < start) return "Upcoming";
  return "Past";
});

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function boothAt(r: number, c: number) {
  return booths.value.find((b) => b.mapRow === r && b.mapCol === c);
}

function openBooth(id: number) {
  router.push(`/booths/${id}`);
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <Header />

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-40">
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-10 h-10 border-4 border-[#3d52d5]/20 border-t-[#3d52d5] rounded-full animate-spin"
        />
        <p class="text-sm text-gray-400">Loading expo…</p>
      </div>
    </div>

    <template v-else>
      <!-- Hero -->
      <section
        class="bg-linear-to-br from-[#3d52d5] via-[#2a3ab0] to-[#090c9b] text-white"
      >
        <div class="max-w-7xl mx-auto px-8 py-12">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-sm text-blue-300 mb-8">
            <NuxtLink to="/expos" class="hover:text-white transition"
              >Expos</NuxtLink
            >
            <span class="text-blue-400">/</span>
            <span class="text-white truncate max-w-xs">{{
              expo?.name || "Unknown"
            }}</span>
          </div>

          <div class="flex flex-col lg:flex-row items-start gap-10">
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5 border"
                :class="{
                  'bg-emerald-400/20 border-emerald-400/40 text-emerald-300':
                    expoStatus === 'Live',
                  'bg-blue-400/20 border-blue-400/40 text-blue-300':
                    expoStatus === 'Upcoming',
                  'bg-white/10 border-white/20 text-white/60':
                    expoStatus === 'Past',
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

              <h1
                class="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight"
              >
                {{ expo?.name || "Unknown" }}
              </h1>
              <p class="text-blue-200 text-base leading-relaxed mb-7 max-w-2xl">
                {{ expo?.description || "No description provided." }}
              </p>

              <div class="flex flex-wrap gap-3">
                <div
                  class="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-sm"
                >
                  {{ formatDate(expo?.startDate) }} –
                  {{ formatDate(expo?.endDate) }}
                </div>
                <div
                  v-if="expo.type"
                  class="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-sm"
                >
                  {{ expo.type }}
                </div>
              </div>
            </div>

            <!--Organizer Information: name + email-->
            <div>
              <UCard
                variant="soft"
                class="border-2 border-blue-500 bg-[#3d52d5]/50 p-3"
              >
                <h1>
                  <span class="font-bold">Organized by: </span>
                  <span> {{ organizer.name || "Unknown organizer" }} </span>
                </h1>
              </UCard>
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
        </div>

        <!-- Empty -->
        <div
          v-if="booths.length === 0"
          class="bg-white rounded-2xl border border-gray-200 py-24 text-center"
        >
          <p class="font-semibold text-gray-500">No approved booths yet</p>
        </div>

        <!-- Floor Map -->
        <div v-else>
          <div
            class="border-2 border-gray-400 rounded-xl p-5 w-full h-150 flex flex-col items-center justify-center gap-6"
          >
            <!-- Rows -->
            <div v-for="r in rows" :key="r" class="flex gap-6">
              <!-- Cells -->
              <button
                v-for="c in cols"
                :key="c"
                type="button"
                class="w-40 h-20 border rounded-xl hover:bg-gray-100 transition cursor-pointer"
                :class="
                  boothAt(r, c)
                    ? 'bg-blue-100 border-blue-400 hover:bg-blue-200'
                    : 'hover:bg-gray-100'
                "
                @click="boothAt(r, c) && openBooth(boothAt(r, c).id)"
              >
                <div
                  v-if="boothAt(r, c)"
                  class="text-center leading-tight px-2"
                >
                  <div class="font-semibold truncate">
                    {{ boothAt(r, c).name }}
                  </div>
                  <div class="text-xs text-gray-500">View booth</div>
                </div>

                <div v-else class="text-gray-300 text-xs">Empty</div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
