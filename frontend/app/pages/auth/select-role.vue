<script setup lang="ts">
// /auth/select-role
// New Google OAuth users land here with ?token=xxx (a temp token, 10 min TTL).
// They pick a role → POST /auth/oauth/complete → get a full token → go to dashboard.

import Logo from "~/components/Logo.vue";

const route = useRoute();
const auth = useAuth();

const tempToken = route.query.token as string | undefined;

// Guard: if no temp token, the user shouldn't be here
if (!tempToken) {
  await navigateTo("/auth");
}

// Store the temp token so useAuth's authHeaders() works for the /oauth/complete call
auth.setToken(tempToken!);

// UI state
const selectedRole = ref<"visitor" | "exhibitor" | "organizer" | null>(null);
const isLoading = ref(false);
const errorMsg = ref<string | null>(null);

const roleOptions: {
  value: "visitor" | "exhibitor" | "organizer";
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "visitor",
    label: "Visitor",
    description: "Browse expos, explore booths, and connect with exhibitors.",
    icon: "i-lucide-user",
  },
  {
    value: "exhibitor",
    label: "Exhibitor",
    description: "Showcase your company, register booths, and meet visitors.",
    icon: "i-lucide-building-2",
  },
  {
    value: "organizer",
    label: "Organizer",
    description: "Create and manage virtual expos from start to finish.",
    icon: "i-lucide-calendar-check",
  },
];

// Submit
async function confirm() {
  if (!selectedRole.value) {
    errorMsg.value = "Please select a role to continue.";
    return;
  }
  errorMsg.value = null;
  isLoading.value = true;
  try {
    await auth.completeOAuth(selectedRole.value);
    await navigateTo("/");
  } catch (err: any) {
    const msg = err?.data?.message ?? err?.message;
    errorMsg.value = Array.isArray(msg)
      ? msg.join(", ")
      : (msg ?? "Something went wrong.");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex flex-col"
  >
    <!-- Minimal header -->
    <header class="flex items-center gap-3 px-12 py-6">
      <Logo class="w-9 h-9" />
      <span class="text-lg font-bold text-[#3d52d5]">ExpoVerse</span>
    </header>

    <!-- Main content -->
    <main class="flex-1 flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-2xl">
        <!-- Heading -->
        <div class="text-center mb-10">
          <div
            class="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#3d52d5]/10 flex items-center justify-center"
          >
            <UIcon name="i-lucide-sparkles" class="w-8 h-8 text-[#3d52d5]" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">One last step!</h1>
          <p class="text-gray-500">
            Tell us how you plan to use ExpoVerse so we can tailor your
            experience.
          </p>
        </div>

        <!-- Error banner -->
        <Transition name="fade">
          <div
            v-if="errorMsg"
            class="mb-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          >
            <UIcon name="i-lucide-circle-alert" class="shrink-0 text-red-500" />
            <span>{{ errorMsg }}</span>
            <button
              class="ml-auto text-red-400 hover:text-red-600"
              @click="errorMsg = null"
            >
              <UIcon name="i-lucide-x" />
            </button>
          </div>
        </Transition>

        <!-- Role cards -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <button
            v-for="option in roleOptions"
            :key="option.value"
            class="group relative rounded-2xl border-2 p-6 text-left transition-all duration-200 cursor-pointer focus:outline-none"
            :class="[
              selectedRole === option.value
                ? 'border-[#3d52d5] bg-[#3d52d5]/5 shadow-lg shadow-blue-500/10'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md',
            ]"
            @click="selectedRole = option.value"
          >
            <!-- Selected indicator -->
            <div
              class="absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
              :class="[
                selectedRole === option.value
                  ? 'border-[#3d52d5] bg-[#3d52d5]'
                  : 'border-gray-300',
              ]"
            >
              <UIcon
                v-if="selectedRole === option.value"
                name="i-lucide-check"
                class="w-3 h-3 text-white"
              />
            </div>

            <!-- Icon -->
            <div
              class="w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors"
              :class="[
                selectedRole === option.value
                  ? 'bg-[#3d52d5] text-white'
                  : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-[#3d52d5]',
              ]"
            >
              <UIcon :name="option.icon" class="w-6 h-6" />
            </div>

            <h3 class="font-bold text-gray-900 mb-1">{{ option.label }}</h3>
            <p class="text-xs text-gray-500 leading-relaxed">
              {{ option.description }}
            </p>
          </button>
        </div>

        <!-- Continue button -->
        <UButton
          block
          :loading="isLoading"
          :disabled="!selectedRole || isLoading"
          class="h-12 rounded-xl text-base font-semibold shadow-lg shadow-blue-500/20 cursor-pointer"
          :class="[
            selectedRole
              ? 'bg-linear-to-r from-[#3d52d5] to-[#090c9b] text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed',
          ]"
          size="lg"
          @click="confirm"
        >
          {{
            isLoading
              ? "Setting up your account…"
              : `Continue as ${selectedRole ? roleOptions.find((r) => r.value === selectedRole)?.label : "…"}`
          }}
        </UButton>
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
