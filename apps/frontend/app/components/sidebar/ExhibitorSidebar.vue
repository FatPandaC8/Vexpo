<script setup lang="ts">
import { TABS } from "~/utils/sidebar/exhibitor.sidebar.constants";
import StatusBadge from "../common/StatusBadge.vue";
import SidebarSection from "./components/SidebarSection.vue";
import SidebarEmptyState from "./components/SidebarEmptyState.vue";
import SidebarItem from "./components/SidebarItem.vue";
import SidebarTabs from "./components/SidebarTabs.vue";

const dashboard = useDashboardStore();
const boothStore = useBoothStore();
const companyStore = useCompanyStore();
const expoStore = useExpoStore();
const api = useApi();

const section = ref<"booth" | "expos" | "company">("booth");

watch(
  section,
  (v) => {
    if (v === "booth") boothStore.fetchMyBooth(api);
    else if (v === "expos") expoStore.fetchAllExpos(api);
    else companyStore.fetchMyCompany(api);
  },
  { immediate: true },
);
</script>

<template>
  <aside class="flex flex-col h-full">
    <SidebarTabs v-model="section" :tabs="TABS" :cols="3" />

    <!-- My Booth -->
    <template v-if="section === 'booth'">
      <SidebarSection
        label="My Booth"
        :loading="boothStore.loading"
        @refresh="
          boothStore.reset();
          boothStore.fetchMyBooth(api);
        "
      />

      <SidebarEmptyState
        v-if="!boothStore.booth"
        icon="i-lucide-store"
        title="No booth yet"
        subtitle='Use "Find Expo" to register a booth'
      />

      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <SidebarItem
          :title="boothStore.booth.name ?? 'Booth #' + boothStore.booth.id"
          :subtitle="`Expo #${boothStore.booth.expoId}`"
          :active="
            dashboard.activeView === 'booth-edit' &&
            dashboard.activeId === boothStore.booth.id
          "
          active-color="border-[#3d52d5]/40 bg-blue-50"
          @click="dashboard.select('booth-edit', boothStore.booth)"
        >
          <StatusBadge
            :status="boothStore.booth.status ?? 'pending'"
            class="mt-1.5"
          />
        </SidebarItem>
      </div>
    </template>

    <!-- Find Expo -->
    <template v-else-if="section === 'expos'">
      <SidebarSection
        label="Available Expos"
        :loading="expoStore.loading"
        @refresh="expoStore.fetchAllExpos(api)"
      />

      <SidebarEmptyState
        v-if="expoStore.allExpos.length === 0"
        icon="i-lucide-calendar-x"
        title="No expos available"
      />
      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <SidebarItem
          v-for="expo in expoStore.allExpos"
          :key="expo.id"
          :title="expo.name"
          :subtitle="expo.type ?? '#'"
          :active="
            dashboard.activeView === 'register-booth' &&
            dashboard.activeId === expo.id
          "
          active-color="border-[#3d52d5]/40 bg-blue-50"
          @click="dashboard.select('register-booth', expo)"
        >
          <span
            class="inline-flex items-center gap-1 mt-1.5 text-xs text-violet-600 font-medium"
          >
            <UIcon name="i-lucide-store" class="w-3 h-3" />
            Register booth →
          </span>
        </SidebarItem>
      </div>
    </template>

    <!-- My Company -->
    <template v-else>
      <SidebarSection
        label="My Company"
        :loading="companyStore.loading"
        @refresh="
          companyStore.reset();
          companyStore.fetchMyCompany(api);
        "
      />

      <SidebarEmptyState
        v-if="!companyStore.company"
        icon="i-lucide-building-2"
        title="No company yet"
        subtitle="Register your company to start exhibiting"
      >
        <button
          class="mt-3 text-xs font-semibold text-[#3d52d5] hover:underline"
          @click="dashboard.select('company-create')"
        >
          + Register Company
        </button>
      </SidebarEmptyState>

      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <SidebarItem
          :title="companyStore.company.name"
          :subtitle="companyStore.company.industry ?? 'Company'"
          :active="dashboard.activeView === 'company-edit'"
          active-color="border-[#3d52d5]/40 bg-blue-50"
          @click="dashboard.select('company-edit', companyStore.company)"
        />
      </div>
    </template>
  </aside>
</template>
