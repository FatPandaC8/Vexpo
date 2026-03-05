<script setup lang="ts">
import { TABS } from "~/utils/sidebar/organizer.sidebar.constants";
import StatusBadge from "../common/StatusBadge.vue";
import SidebarSection from "./components/SidebarSection.vue";
import SidebarTabs from "./components/SidebarTabs.vue";
import SidebarEmptyState from "./components/SidebarEmptyState.vue";
import SidebarItem from "./components/SidebarItem.vue";

const dashboard = useDashboardStore();

const api = useApi();
const section = ref<"expos" | "booths">("expos");

const expos = ref<any[]>([]);
const booths = ref<any[]>([]);
const loadingExpos = ref(false);
const loadingBooths = ref(false);

async function loadExpos() {
  loadingExpos.value = true;
  try {
    expos.value = await api.get("me/expos");
  } catch {
    expos.value = [];
  } finally {
    loadingExpos.value = false;
  }
}

async function loadBooths() {
  loadingBooths.value = true;
  try {
    const res = await api.getPaginated<any>("/booths", { page: 1, limit: 20 });
    booths.value = res.items;
  } catch {
    booths.value = [];
  } finally {
    loadingBooths.value = false;
  }
}

onMounted(loadExpos);
watch(section, (s) => {
  if (s === "booths") loadBooths();
});
watch(
  () => dashboard.activeId,
  () => {
    if (section.value === "booths") loadBooths();
  },
);

defineExpose({ refreshExpos: loadExpos, refreshBooths: loadBooths });
</script>

<template>
  <aside class="flex flex-col h-full">
    <SidebarTabs v-model="section" :tabs="TABS" :cols="2" />

    <!-- Expos -->
    <template v-if="section === 'expos'">
      <SidebarSection
        label="My Expos"
        :loading="loadingExpos"
        @refresh="loadExpos"
      >
        <button
          size="xs"
          icon="i-lucide-plus"
          class="bg-[#3d52d5] text-white rounded w-6 h-6"
          @click="dashboard.select('expo-create')"
        >
          +
        </button>
      </SidebarSection>

      <SidebarEmptyState
        v-if="expos.length === 0"
        icon="i-lucide-calendar-x"
        title="No expos yet"
      />
      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <SidebarItem
          v-for="expo in expos"
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
