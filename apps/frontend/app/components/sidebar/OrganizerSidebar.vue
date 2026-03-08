<script setup lang="ts">
import { TABS } from "~/utils/sidebar/organizer.sidebar.constants";
import StatusBadge from "../common/StatusBadge.vue";
import SidebarSection from "./components/SidebarSection.vue";
import SidebarTabs from "./components/SidebarTabs.vue";
import SidebarEmptyState from "./components/SidebarEmptyState.vue";
import SidebarItem from "./components/SidebarItem.vue";
import type { Booth } from "@vexpo/schema";

const dashboard = useDashboardStore();
const expoStore = useExpoStore();
const api = useApi();

const section = ref<"expos" | "booths">("expos");

// Booth requests are always fetched fresh
const booths = ref<Booth[]>([]);
const loadingBooths = ref(false);

async function loadBooths() {
  loadingBooths.value = true;
  try {
    // Fetch booths only from expos that belong to this organizer
    const myExpos = expoStore.myExpos;
    if (!myExpos.length) {
      booths.value = [];
      return;
    }
    const results = await Promise.all(
      myExpos.map((expo) =>
        api.get<Booth[]>(`/expos/${expo.id}/booths/all`).catch(() => []),
      ),
    );
    booths.value = results.flat();
  } catch {
    booths.value = [];
  } finally {
    loadingBooths.value = false;
  }
}

onMounted(() => expoStore.fetchMyExpos(api));

watch(section, async (s) => {
  if (s === "booths") {
    if (!expoStore.loaded) await expoStore.fetchMyExpos(api);
    loadBooths();
  }
});

watch(
  () => dashboard.activeId,
  () => {
    if (section.value === "booths") loadBooths();
  },
);
</script>

<template>
  <aside class="flex flex-col h-full">
    <SidebarTabs v-model="section" :tabs="TABS" :cols="2" />

    <!-- Expos -->
    <template v-if="section === 'expos'">
      <SidebarSection
        label="My Expos"
        :loading="expoStore.loading"
        @refresh="
          expoStore.reset();
          expoStore.fetchMyExpos(api);
        "
      >
        <button
          class="bg-[#3d52d5] text-white rounded w-6 h-6"
          @click="dashboard.select('expo-create')"
        >
          +
        </button>
      </SidebarSection>

      <SidebarEmptyState
        v-if="expoStore.myExpos.length === 0"
        icon="i-lucide-calendar-x"
        title="No expos yet"
      />
      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <SidebarItem
          v-for="expo in expoStore.myExpos"
          :key="expo.id"
          :title="expo.name"
          :active="dashboard.activeId === expo.id"
          active-color="border-[#3d52d5]/40 bg-blue-50"
          @click="dashboard.select('expo-manage', expo)"
        />
      </div>
    </template>

    <!-- Booths -->
    <template v-else>
      <SidebarSection
        label="Booth Requests"
        :loading="loadingBooths"
        @refresh="loadBooths"
      />

      <SidebarEmptyState
        v-if="booths.length === 0"
        icon="i-lucide-store"
        title="No booth requests"
      />
      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <SidebarItem
          v-for="booth in booths"
          :key="booth.id"
          :title="booth.name ?? 'Booth #' + booth.id"
          :subtitle="booth.expo?.name"
          :active="
            dashboard.activeId === booth.id &&
            dashboard.activeView === 'booth-review'
          "
          @click="dashboard.select('booth-review', booth)"
        >
          <StatusBadge :status="booth.status ?? 'pending'" class="mt-1.5" />
        </SidebarItem>
      </div>
    </template>
  </aside>
</template>
