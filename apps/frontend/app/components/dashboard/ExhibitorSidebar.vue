<script setup lang="ts">
const emit = defineEmits<{ select: [payload: { view: string; data?: any }] }>();
const props = defineProps<{ activeView: string; activeId?: string }>();

const api = useApi();
const section = ref<"booth" | "expos" | "company">("booth");

const TABS = [
  { key: "booth", label: "myBooth", icon: "i-lucide-store" },
  { key: "expos", label: "Find Expo", icon: "i-lucide-search" },
  { key: "company", label: "Company", icon: "i-lucide-building-2" },
];

const myBooth = ref<any>();
const expos = ref<any[]>([]);
const company = ref<any>(null);
const loadingBooths = ref(false);
const loadingExpos = ref(false);
const loadingCompany = ref(false);

async function loadBooth() {
  loadingBooths.value = true;
  try {
    myBooth.value = await api.get<any>("/me/booth");
  } catch {
    myBooth.value = [];
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
    if (v === "booth") loadBooth();
    else if (v === "expos") loadExpos();
    else loadCompany();
  },
  { immediate: true },
);

defineExpose({ refreshBooths: loadBooth });
</script>

<template>
  <aside class="flex flex-col h-full">
    <SidebarTabs v-model="section" :tabs="TABS" :cols="3" />

    <!-- My myBooth -->
    <template v-if="section === 'booth'">
      <SidebarSection
        label="My myBooth"
        :loading="loadingBooths"
        @refresh="loadBooth"
      />

      <SidebarEmptyState
        v-if="myBooth === undefined"
        icon="i-lucide-store"
        title="No myBooth yet"
        subtitle='Use "Find Expo" to register a booth'
      />

      <div v-else class="space-y-2 overflow-y-auto flex-1 pr-0.5">
        <SidebarItem
          :key="myBooth.id"
          :title="myBooth.name ?? 'Booth #' + myBooth.id"
          :subtitle="`Expo #${myBooth.expoId}`"
          :active="activeView === 'booth-edit' && activeId === myBooth.id"
          active-color="border-[#3d52d5]/40 bg-blue-50"
          @click="emit('select', { view: 'booth-edit', data: myBooth })"
        >
          <StatusBadge :status="myBooth.status ?? 'pending'" class="mt-1.5" />
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
