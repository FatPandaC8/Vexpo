<script setup lang="ts">
import Logo from "~/components/common/Logo.vue";
import ExhibitorSidebar from "~/components/sidebar/ExhibitorSidebar.vue";
import OrganizerSidebar from "~/components/sidebar/OrganizerSidebar.vue";
import AdminSidebar from "~/components/sidebar/AdminSidebar.vue";

definePageMeta({ middleware: "auth" });

const auth = useAuth();
const dashboard = useDashboardStore();
const boothStore = useBoothStore();
const companyStore = useCompanyStore();
const expoStore = useExpoStore();
const { roleBadgeColor, roleLabel, greeting, welcomeConfig } =
  useDashboardUI(auth);

function onBoothRegistered(booth: any) {
  boothStore.setBooth(booth);
}

function onCompanyUpdated(company: any) {
  companyStore.company = company;
  dashboard.activeData = company;
}

function onCompanyDeleted() {
  companyStore.reset();
  dashboard.reset();
}

function onExpoCreated(expo: any) {
  expoStore.addExpo(expo);
  dashboard.select("expo-manage", expo);
}

function onExpoDeleted() {
  expoStore.removeExpo(dashboard.activeData?.id);
  dashboard.reset();
}

function onExpoUpdated(expo: any) {
  expoStore.updateExpo(expo);
  dashboard.activeData = expo;
}

function onBoothReviewed(booth: any) {
  dashboard.activeData = booth;
}

function onAdminSaved() {
  dashboard.reset();
}

function onAdminUpdated(item: any) {
  dashboard.activeData = item;
}

function onAdminDeleted() {
  dashboard.reset();
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Top bar -->
    <header
      class="bg-white border-b border-gray-100 px-6 py-3.5 sticky top-0 z-10"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Logo class="w-6 h-6" />
          <NuxtLink to="/">
            <span class="font-bold text-gray-900">ExpoVerse</span>
          </NuxtLink>
          <span class="text-gray-300">/</span>
          <h1 class="text-sm text-gray-600">
            {{ greeting }},
            <strong class="text-gray-900">{{
              auth.user.value?.name?.split(" ")[0]
            }}</strong>
          </h1>
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            :class="roleBadgeColor"
          >
            {{ roleLabel }}
          </span>
        </div>
      </div>
    </header>

    <!-- Body -->
    <div class="flex flex-1 overflow-hidden">
      <!-- LEFT SIDEBAR -->
      <aside
        class="w-72 shrink-0 border-r border-gray-100 bg-white flex flex-col overflow-hidden"
      >
        <div class="flex-1 overflow-y-auto p-4 flex flex-col min-h-0">
          <!-- Sidebars use stores directly — no props/emits needed -->
          <ExhibitorSidebar v-if="auth.isExhibitor.value" />
          <OrganizerSidebar v-else-if="auth.isOrganizer.value" />
          <AdminSidebar v-else-if="auth.isAdmin.value" />
          <div v-else class="flex-1 flex items-center justify-center">
            <UIcon
              name="i-lucide-loader-circle"
              class="w-6 h-6 text-blue-400 animate-spin"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-100 p-3 shrink-0">
          <div class="flex items-center gap-2.5 mb-2.5">
            <div class="min-w-0 flex-1">
              <p class="text-xs font-semibold text-gray-800 truncate">
                {{ auth.user.value?.name }}
              </p>
              <p class="text-xs text-gray-400 truncate">
                {{ auth.user.value?.email }}
              </p>
            </div>
          </div>
          <div class="flex gap-1">
            <NuxtLink
              to="/me"
              class="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
            >
              <UIcon name="i-lucide-user" class="w-3.5 h-3.5" />
              Profile
            </NuxtLink>
            <button
              class="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-600 hover:bg-red-50 transition"
              @click="
                auth.logout();
                boothStore.reset();
                companyStore.reset();
                expoStore.reset();
                dashboard.reset();
              "
            >
              <UIcon name="i-lucide-log-out" class="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <!-- MAIN CONTENT PANEL -->
      <main class="flex-1 overflow-y-auto p-8 min-w-0">
        <!-- Welcome -->
        <template v-if="dashboard.activeView === 'welcome' && welcomeConfig">
          <div
            class="h-full flex flex-col items-center justify-center text-center py-20"
          >
            <div
              class="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg"
              :class="welcomeConfig.color.split(' ')[0]"
            >
              <UIcon
                :name="welcomeConfig.icon"
                class="w-10 h-10"
                :class="welcomeConfig.color.split(' ')[1]"
              />
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
              {{ welcomeConfig.title }}
            </h2>
            <p class="text-gray-400 text-sm max-w-sm">
              {{ welcomeConfig.body }}
            </p>
          </div>
        </template>

        <!-- EXHIBITOR PANELS -->
        <DashboardPanelsBoothForm
          v-else-if="
            dashboard.activeView === 'booth-edit' && dashboard.activeData
          "
          :booth="dashboard.activeData"
          @updated="
            dashboard.activeData = $event;
            boothStore.setBooth($event);
          "
        />
        <DashboardPanelsBoothForm
          v-else-if="
            dashboard.activeView === 'register-booth' && dashboard.activeData
          "
          :expo="dashboard.activeData"
          @registered="onBoothRegistered"
        />
        <DashboardPanelsCompanyForm
          v-else-if="dashboard.activeView === 'company-create'"
          @saved="onCompanyUpdated"
        />
        <DashboardPanelsCompanyForm
          v-else-if="
            dashboard.activeView === 'company-edit' && dashboard.activeData
          "
          :company="dashboard.activeData"
          @saved="onCompanyUpdated"
          @deleted="onCompanyDeleted"
        />

        <!-- ORGANIZER PANELS -->
        <DashboardPanelsExpoForm
          v-else-if="
            dashboard.activeView === 'expo-manage' && dashboard.activeData
          "
          :expo="dashboard.activeData"
          @saved="onExpoUpdated"
          @deleted="onExpoDeleted"
        />
        <DashboardPanelsExpoForm
          v-else-if="dashboard.activeView === 'expo-create'"
          @saved="onExpoCreated"
        />
        <DashboardPanelsBoothForm
          v-else-if="
            dashboard.activeView === 'booth-review' && dashboard.activeData
          "
          :booth="dashboard.activeData"
          @updated="onBoothReviewed"
        />

        <!-- ADMIN PANELS -->
        <DashboardPanelsAdminUserEdit
          v-else-if="
            dashboard.activeView === 'admin-user-edit' && dashboard.activeData
          "
          :user="dashboard.activeData"
          :key="dashboard.activeData.id"
          @updated="onAdminUpdated"
          @deleted="onAdminDeleted"
        />
        <DashboardPanelsAdminExpoEdit
          v-else-if="dashboard.activeView === 'admin-expo-create'"
          @saved="onAdminSaved"
        />
        <DashboardPanelsAdminExpoEdit
          v-else-if="
            dashboard.activeView === 'admin-expo-edit' && dashboard.activeData
          "
          :expo="dashboard.activeData"
          @saved="onAdminUpdated"
          @deleted="onAdminDeleted"
        />
        <DashboardPanelsAdminBoothEdit
          v-else-if="
            dashboard.activeView === 'admin-booth-edit' && dashboard.activeData
          "
          :booth="dashboard.activeData"
          @updated="onAdminUpdated"
          @deleted="onAdminDeleted"
        />
        <DashboardPanelsAdminCompanyEdit
          v-else-if="
            dashboard.activeView === 'admin-company-edit' &&
            dashboard.activeData
          "
          :company="dashboard.activeData"
          @updated="onAdminUpdated"
          @deleted="onAdminDeleted"
        />
      </main>
    </div>
  </div>
</template>
