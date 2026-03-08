<script setup lang="ts">
import {
  EDIT_VIEW,
  ENDPOINT,
  TABS,
  type Section,
} from "~/utils/sidebar/admin.sidebar.constants";
import SidebarSection from "./components/SidebarSection.vue";
import SidebarTabs from "./components/SidebarTabs.vue";
import SidebarEmptyState from "./components/SidebarEmptyState.vue";
import SidebarItem from "./components/SidebarItem.vue";

const dashboard = useDashboardStore();

const api = useApi();

const section = ref<Section>("users");

const items = ref<any[]>([]);
const loading = ref(false);

async function load(s: Section) {
  loading.value = true;
  try {
    const res = await api.get(ENDPOINT[s]);
    items.value = (res as any).items ?? res;
  } catch {
    items.value = [];
  } finally {
    loading.value = false;
  }
}

watch(section, (v) => load(v), { immediate: true });
defineExpose({ refresh: () => load(section.value) });

function label(item: any) {
  if (section.value === "users")
    return item.name ?? item.email ?? `User #${item.id}`;
  return item.name ?? `${section.value} #${item.id}`;
}
function sub(item: any) {
  if (section.value === "users") return item.email ?? item.roles?.join(", ");
  if (section.value === "expos") return item.type ?? "#";
  if (section.value === "booths") return item.status ?? "#";
  if (section.value === "companies") return item.industry ?? "#";
}
</script>

<template>
  <aside class="flex flex-col h-full">
    <SidebarTabs v-model="section" :tabs="TABS" :cols="2" />

    <SidebarSection
      :label="TABS.find((t) => t.key === section)!.label"
      :loading="loading"
      @refresh="load(section)"
    />

    <SidebarEmptyState
      v-if="items.length === 0"
      :icon="TABS.find((t) => t.key === section)!.icon"
      :title="`No ${section} found`"
    />

    <div v-else class="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
      <SidebarItem
        v-for="item in items"
        :key="item.id"
        :title="label(item)"
        :subtitle="sub(item)"
        :active="
          dashboard.activeId === item.id &&
          dashboard.activeView === EDIT_VIEW[section]
        "
        @click="dashboard.select(EDIT_VIEW[section], item)"
      />
    </div>
  </aside>
</template>
