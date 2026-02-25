<script setup lang="ts">
const emit = defineEmits<{ select: [payload: { view: string; data?: any }] }>();
const props = defineProps<{ activeView: string; activeId?: number }>();

const api = useApi();
const section = ref<"booths" | "expos" | "company">("booths");

const TABS = [
  { key: "booths", label: "Booths", icon: "i-lucide-store" },
  { key: "expos", label: "Find Expo", icon: "i-lucide-search" },
  { key: "company", label: "Company", icon: "i-lucide-building-2" },
];

const booths = ref<any[]>([]);
const expos = ref<any[]>([]);
const company = ref<any>(null);
const loadingBooths = ref(false);
const loadingExpos = ref(false);
const loadingCompany = ref(false);

async function loadBooths() {
  loadingBooths.value = true;
  try {
    booths.value = await api.get<any[]>("/me/booths");
  } catch {
    booths.value = [];
  } finally {
    loadingBooths.value = false;
  }
}
async function loadExpos() {
  loadingExpos.value = true;
  try {
    expos.value = await api.get<any[]>("/expos");
  } catch {
    expos.value = [];
  } finally {
    loadingExpos.value = false;
  }
}
async function loadCompany() {
  loadingCompany.value = true;
  try {
    company.value = await api.get<any>("/me/company");
  } catch {
    company.value = null;
  } finally {
    loadingCompany.value = false;
  }
}

watch(
  section,
  (v) => {
    if (v === "booths") loadBooths();
    else if (v === "expos") loadExpos();
    else loadCompany();
  },
  { immediate: true },
);

defineExpose({ refreshBooths: loadBooths });
</script>

<template>
  <aside class="flex flex-col h-full">
    <SidebarTabs v-model="section" :tabs="TABS" :cols="3" />

    <!-- My Booths -->
    <template v-if="section === 'booths'">
      <SidebarSection
        label="My Booths"
        :loading="loadingBooths"
        @refresh="loadBooths"
      />

      <SidebarEmptyState
        v-if="booths.length === 0"
        icon="i-lucide-store"
        title="No booths yet"
        subtitle='Use "Find Expo" to register a booth'
      />
      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <SidebarItem
          v-for="booth in booths"
          :key="booth.id"
          :title="booth.name ?? 'Booth #' + booth.id"
          :subtitle="`Expo #${booth.expoId}`"
          :active="activeView === 'booth-edit' && activeId === booth.id"
          active-color="border-[#3d52d5]/40 bg-blue-50"
          @click="emit('select', { view: 'booth-edit', data: booth })"
        >
          <StatusBadge :status="booth.status ?? 'pending'" class="mt-1.5" />
        </SidebarItem>
      </div>
    </template>

    <!-- Find Expo -->
    <template v-else-if="section === 'expos'">
      <SidebarSection
        label="Available Expos"
        :loading="loadingExpos"
        @refresh="loadExpos"
      />

      <SidebarEmptyState
        v-if="expos.length === 0"
        icon="i-lucide-calendar-x"
        title="No expos available"
      />
      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <SidebarItem
          v-for="expo in expos"
          :key="expo.id"
          :title="expo.name"
          :subtitle="expo.type ?? '#'"
          :active="activeView === 'register-booth' && activeId === expo.id"
          active-color="border-[#3d52d5]/40 bg-blue-50"
          @click="emit('select', { view: 'register-booth', data: expo })"
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
        :loading="loadingCompany"
        @refresh="loadCompany"
      />

      <SidebarEmptyState
        v-if="!company"
        icon="i-lucide-building-2"
        title="No company yet"
        subtitle="Register your company to start exhibiting"
      >
        <button
          class="mt-3 text-xs font-semibold text-[#3d52d5] hover:underline"
          @click="emit('select', { view: 'company-create' })"
        >
          + Register Company
        </button>
      </SidebarEmptyState>

      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <SidebarItem
          :title="company.name"
          :subtitle="company.industry ?? 'Company'"
          :active="activeView === 'company-edit'"
          active-color="border-[#3d52d5]/40 bg-blue-50"
          @click="emit('select', { view: 'company-edit', data: company })"
        />
      </div>
    </template>
  </aside>
</template>
