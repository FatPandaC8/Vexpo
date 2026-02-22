<script setup lang="ts">
import Logo from '~/components/Logo.vue'
import Unsupported from '~/components/Unsupported.vue'

definePageMeta({ middleware: 'auth' })

const auth = useAuth()

// Role display
const roleLabel = computed(() => {
  const r = auth.role.value
  if (!r) return ''
  return r.charAt(0) + r.slice(1).toLowerCase()
})

const roleBadgeColor = computed(() => {
  if (auth.isVisitor.value)   return 'bg-blue-100 text-blue-700'
  if (auth.isExhibitor.value) return 'bg-violet-100 text-violet-700'
  if (auth.isOrganizer.value) return 'bg-emerald-100 text-emerald-700'
  if (auth.isAdmin.value)     return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-600'
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
})

// Active view state
const activeView = ref<string>('welcome')
const activeData = ref<any>(null)
const activeId   = computed(() => activeData.value?.id ?? null)

function select({ view, data }: { view: string; data?: any }) {
  activeView.value = view
  activeData.value = data ?? null
}

// Sidebar refs (for programmatic refresh)
const visitorSidebar   = ref<any>(null)
const exhibitorSidebar = ref<any>(null)
const organizerSidebar = ref<any>(null)
const adminSidebar     = ref<any>(null)

// VISITOR events
function onVisitorRegistered() {
  visitorSidebar.value?.refresh()
}

// EXHIBITOR events
function onBoothRegistered() {
  exhibitorSidebar.value?.refreshBooths()
  // Keep the success state visible in the panel — don't navigate away
}

function onCompanyUpdated(company: any) {
  // Switch to edit mode with the newly saved company
  activeData.value = company;
}

function onCompanyDeleted() {
  select({ view: 'welcome' })
  exhibitorSidebar.value?.refresh()
}

// ORGANIZER events
function onExpoCreated(expo: any) {
  select({ view: 'expo-manage', data: expo })
  organizerSidebar.value?.refresh()
}

function onExpoDeleted() {
  select({ view: 'welcome' })
  organizerSidebar.value?.refresh()
}

function onExpoUpdated(expo: any) {
  activeData.value = expo
}

function onBoothReviewed(booth: any) {
  activeData.value = booth
  organizerSidebar.value?.refreshBooths()
}

// ADMIN events
function onAdminSaved() {
  adminSidebar.value?.refresh()
  select({ view: 'welcome' })
}

function onAdminUpdated(item: any) {
  activeData.value = item
  adminSidebar.value?.refresh()
}

function onAdminDeleted() {
  select({ view: 'welcome' })
  adminSidebar.value?.refresh()
}

// Welcome copy per role
const welcomeConfig = computed(() => {
  if (auth.isVisitor.value)   return { icon: 'i-lucide-ticket',      color: 'bg-blue-100 text-blue-500',     title: 'Browse & Register for Expos',  body: 'Pick an expo from the sidebar to view details and register, or browse all available expos.' }
  if (auth.isExhibitor.value) return { icon: 'i-lucide-store',       color: 'bg-violet-100 text-violet-500', title: 'Manage Your Booths & Company',  body: 'Select a booth to edit it, find an expo to register a new booth, or manage your company.' }
  if (auth.isOrganizer.value) return { icon: 'i-lucide-calendar',    color: 'bg-emerald-100 text-emerald-500', title: 'Select or Create an Expo',   body: 'Click an expo in the sidebar to manage it, approve booths, or hit + New to create one.' }
  if (auth.isAdmin.value)     return { icon: 'i-lucide-shield',      color: 'bg-red-100 text-red-500',       title: 'Admin Control Panel',          body: 'Manage users, expos, booths, and companies. Select a resource type from the sidebar.' }
  return null
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">

    <!-- Top bar -->
    <header class="bg-white border-b border-gray-100 px-6 py-3.5 sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Logo mark -->
          <Logo class="w-6 h-6"/>
          <NuxtLink to="/">
            <span class="font-bold text-gray-900">ExpoVerse</span>
          </NuxtLink>
          <span class="text-gray-300">/</span>
          <h1 class="text-sm text-gray-600">
            {{ greeting }}, <strong class="text-gray-900">{{ auth.user.value?.name?.split(' ')[0] }}</strong>
          </h1>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold" :class="roleBadgeColor">
            {{ roleLabel }}
          </span>
        </div>
      </div>
    </header>

    <!-- Body: sidebar + main -->
    <div class="flex flex-1 overflow-hidden">
      <!--  LEFT SIDEBAR  -->
      <aside class="w-72 shrink-0 border-r border-gray-100 bg-white flex flex-col overflow-hidden">

        <!-- Scrollable sidebar body -->
        <div class="flex-1 overflow-y-auto p-4 flex flex-col min-h-0">

          <Unsupported
            v-if="auth.isVisitor.value"
          />

          <DashboardExhibitorSidebar
            v-else-if="auth.isExhibitor.value"
            ref="exhibitorSidebar"
            :active-view="activeView"
            :active-id="activeId"
            @select="select"
          />

          <DashboardOrganizerSidebar
            v-else-if="auth.isOrganizer.value"
            ref="organizerSidebar"
            :active-view="activeView"
            :active-id="activeId"
            @select="select"
          />

          <DashboardAdminSidebar
            v-else-if="auth.isAdmin.value"
            ref="adminSidebar"
            :active-view="activeView"
            :active-id="activeId"
            @select="select"
          />

          <div v-else class="flex-1 flex items-center justify-center">
            <UIcon name="i-lucide-loader-circle" class="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        </div>

        <!-- Sidebar footer -->
        <div class="border-t border-gray-100 p-3 shrink-0">
          <div class="flex items-center gap-2.5 mb-2.5">
            <div class="min-w-0 flex-1">
              <p class="text-xs font-semibold text-gray-800 truncate">{{ auth.user.value?.name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ auth.user.value?.email }}</p>
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
              @click="auth.logout()"
            >
              <UIcon name="i-lucide-log-out" class="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <!--  MAIN CONTENT PANEL -->
      <main class="flex-1 overflow-y-auto p-8 min-w-0">

        <!-- Welcome / empty state -->
        <template v-if="activeView === 'welcome' && welcomeConfig">
          <div class="h-full flex flex-col items-center justify-center text-center py-20">
            <div class="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg" :class="welcomeConfig.color.split(' ')[0]">
              <UIcon :name="welcomeConfig.icon" class="w-10 h-10" :class="welcomeConfig.color.split(' ')[1]" />
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ welcomeConfig.title }}</h2>
            <p class="text-gray-400 text-sm max-w-sm">{{ welcomeConfig.body }}</p>
          </div>
        </template>

        <!-- EXHIBITOR PANELS -->

        <!-- Edit booth -->
        <DashboardPanelsBoothForm
          v-else-if="activeView === 'booth-edit' && activeData"
          :booth="activeData"
          @updated="activeData = $event"
        />

        <!-- Register booth for an expo -->
        <DashboardPanelsBoothForm
          v-else-if="activeView === 'register-booth' && activeData"
          :expo="activeData"
          @registered="onBoothRegistered"
        />

        <!-- Create company -->
        <DashboardPanelsCompanyForm
          v-else-if="activeView === 'company-create'"
          @saved="onCompanyUpdated"
        />

        <!-- Edit company -->
        <DashboardPanelsCompanyForm
          v-else-if="activeView === 'company-edit' && activeData"
          :company="activeData"
          @saved="onCompanyUpdated"
          @deleted="onCompanyDeleted"
        />

        <!-- ORGANIZER PANELS -->

        <!-- Manage expo: edit details + approve booths -->
        <DashboardPanelsExpoForm
          v-else-if="activeView === 'expo-manage' && activeData"
          :expo="activeData"
          @saved="onExpoUpdated"
          @deleted="onExpoDeleted"
        />

        <!--Create Expo-->
        <DashboardPanelsExpoForm
          v-else-if="activeView === 'expo-create'"
          @saved="onExpoCreated"
        />

        <!-- Manage booths -->
        <DashboardPanelsBoothForm
          v-else-if="activeView === 'booth-review' && activeData"
          :booth="activeData"
          @updated="onBoothReviewed"
        />

        <!-- ADMIN PANELS -->

        <!-- Edit user role / delete user -->
        <DashboardPanelsAdminUserEdit
          v-else-if="activeView === 'admin-user-edit' && activeData"
          :user="activeData"
          :key="activeData.id"
          @updated="onAdminUpdated"
          @deleted="onAdminDeleted"
        />

        <!-- Create expo (admin) -->
        <DashboardPanelsAdminExpoEdit
          v-else-if="activeView === 'admin-expo-create'"
          @saved="onAdminSaved"
        />

        <!-- Edit expo (admin) -->
        <DashboardPanelsAdminExpoEdit
          v-else-if="activeView === 'admin-expo-edit' && activeData"
          :expo="activeData"
          @saved="onAdminUpdated"
          @deleted="onAdminDeleted"
        />

        <!-- Edit booth (admin) -->
        <DashboardPanelsAdminBoothEdit
          v-else-if="activeView === 'admin-booth-edit' && activeData"
          :booth="activeData"
          @updated="onAdminUpdated"
          @deleted="onAdminDeleted"
        />

        <!-- Edit company (admin) -->
        <DashboardPanelsAdminCompanyEdit
          v-else-if="activeView === 'admin-company-edit' && activeData"
          :company="activeData"
          @updated="onAdminUpdated"
          @deleted="onAdminDeleted"
        />

      </main>
    </div>
  </div>
</template>