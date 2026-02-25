<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import Unsupported from "~/components/Unsupported.vue";

definePageMeta({ middleware: "auth" });

const auth = useAuth();

// Role display helpers
const roleLabel = computed(() => {
  const r = auth.role.value;
  if (!r) return "Unknown";
  return r.charAt(0) + r.slice(1).toLowerCase();
});

const roleBadgeClass = computed(() => {
  if (auth.isVisitor.value)
    return "bg-blue-100 text-blue-700 border border-blue-200";
  if (auth.isExhibitor.value)
    return "bg-violet-100 text-violet-700 border border-violet-200";
  if (auth.isOrganizer.value)
    return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  if (auth.isAdmin.value)
    return "bg-red-100 text-red-700 border border-red-200";
  return "bg-gray-100 text-gray-600 border border-gray-200";
});

const roleIcon = computed(() => {
  if (auth.isVisitor.value) return "i-lucide-user";
  if (auth.isExhibitor.value) return "i-lucide-building-2";
  if (auth.isOrganizer.value) return "i-lucide-calendar-check";
  if (auth.isAdmin.value) return "i-lucide-shield";
  return "i-lucide-user";
});

// Sidebar nav
const activeSection = ref<"profile" | "notifications" | "security">("profile");

const sections = [
  { key: "profile", label: "Profile", icon: "i-lucide-user" },
  { key: "security", label: "Security", icon: "i-lucide-lock" },
] as const;

// Profile form
const profileState = reactive({
  name: auth.user.value?.name ?? "",
  email: auth.user.value?.email ?? "",
});

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
});

const profileSaving = ref(false);
const profileSuccess = ref(false);
const profileError = ref<string | null>(null);

async function saveProfile(event: FormSubmitEvent<typeof profileState>) {
  profileError.value = null;
  profileSuccess.value = false;
  profileSaving.value = true;
  // TODO: wire to PATCH /me when backend endpoint is ready
  await new Promise((r) => setTimeout(r, 600));
  profileSaving.value = false;
  profileSuccess.value = true;
  setTimeout(() => {
    profileSuccess.value = false;
  }, 3000);
}

// Password form
const passwordState = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Must be at least 8 characters"),
    newPassword: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Must be at least 8 characters"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const passwordSaving = ref(false);
const passwordSuccess = ref(false);
const passwordError = ref<string | null>(null);

async function savePassword(event: FormSubmitEvent<typeof passwordState>) {
  passwordError.value = null;
  passwordSuccess.value = false;
  passwordSaving.value = true;
  await new Promise((r) => setTimeout(r, 600));
  passwordSaving.value = false;
  passwordSuccess.value = true;
  passwordState.currentPassword = "";
  passwordState.newPassword = "";
  passwordState.confirmPassword = "";
  setTimeout(() => {
    passwordSuccess.value = false;
  }, 3000);
}
</script>

<template>
  <div class="min-h-screen bg-linear-to-r from-blue-50 to-blue-100">
    <div class="max-w-6xl mx-auto px-8 py-10">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 mb-10 text-sm">
        <NuxtLink
          to="/"
          class="text-gray-400 hover:text-gray-700 transition flex items-center gap-1.5"
        >
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Home
        </NuxtLink>
        <span class="text-gray-300">/</span>
        <span class="text-gray-700 font-medium">My Profile</span>
      </div>

      <div class="grid grid-cols-4 gap-6 items-start">
        <!--  LEFT SIDEBAR -->
        <div class="col-span-1 space-y-4">
          <!-- Avatar card -->
          <UCard
            class="rounded-2xl border border-gray-300 p-6 text-center bg-white"
          >
            <div class="relative inline-block mb-4">
              <!-- Avatar -->
              <div
                class="w-20 h-20 rounded-full bg-[#3d52d5] text-white text-3xl font-bold flex items-center justify-center select-none shadow-lg shadow-blue-500/20 mx-auto"
              >
                {{ auth.user.value?.name?.charAt(0).toUpperCase() ?? "?" }}
              </div>
              <!-- Role badge overlay -->
            </div>

            <p class="font-bold text-gray-900 text-sm mb-0.5 truncate">
              {{ auth.user.value?.name }}
            </p>
            <p class="text-xs text-gray-400 truncate mb-3">
              {{ auth.user.value?.email }}
            </p>

            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              :class="roleBadgeClass"
            >
              <UIcon :name="roleIcon" class="w-3 h-3" />
              {{ roleLabel }}
            </span>
          </UCard>

          <!-- Section nav -->
          <UCard class="rounded-2xl border border-gray-300 p-2 bg-white">
            <nav class="space-y-1">
              <button
                v-for="s in sections"
                :key="s.key"
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                :class="[
                  activeSection === s.key
                    ? 'bg-blue-100 text-[#3d52d5]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                ]"
                @click="activeSection = s.key"
              >
                <UIcon :name="s.icon" class="w-4 h-4 shrink-0" />
                {{ s.label }}
              </button>
            </nav>
          </UCard>
        </div>

        <!-- RIGHT CONTENT -->
        <div class="col-span-3">
          <!--  PROFILE  -->
          <template v-if="activeSection === 'profile'">
            <UCard class="rounded-2xl border border-gray-400 p-8 bg-white">
              <!-- Section heading -->
              <div class="flex items-center gap-3 mb-8">
                <div
                  class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"
                >
                  <UIcon name="i-lucide-user" class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 class="text-lg font-bold text-gray-900">
                    Profile Information
                  </h2>
                  <p class="text-sm text-gray-400">
                    Update your display name and email address
                  </p>
                </div>
              </div>

              <Transition name="fade">
                <div
                  v-if="profileSuccess"
                  class="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700"
                >
                  <UIcon
                    name="i-lucide-circle-check"
                    class="shrink-0 text-emerald-500"
                  />
                  Profile updated successfully.
                </div>
              </Transition>
              <Transition name="fade">
                <div
                  v-if="profileError"
                  class="mb-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                >
                  <UIcon
                    name="i-lucide-circle-alert"
                    class="shrink-0 text-red-500"
                  />
                  {{ profileError }}
                </div>
              </Transition>

              <UForm
                :state="profileState"
                :schema="profileSchema"
                class="space-y-5"
                @submit="saveProfile"
              >
                <UFormField
                  name="name"
                  label="Full Name"
                  :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
                >
                  <UInput
                    v-model="profileState.name"
                    placeholder="John Doe"
                    :disabled="profileSaving"
                    :ui="{
                      base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
                    }"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  name="email"
                  label="Email Address"
                  :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
                >
                  <UInput
                    v-model="profileState.email"
                    type="email"
                    placeholder="you@example.com"
                    :disabled="profileSaving"
                    :ui="{
                      base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
                    }"
                    class="w-full"
                  />
                </UFormField>

                <!-- Role: read-only -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5"
                    >Role</label
                  >
                  <div
                    class="flex items-center gap-3 h-10 px-3 rounded-xl border border-gray-100 bg-gray-50"
                  >
                    <span
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      :class="roleBadgeClass"
                    >
                      <UIcon :name="roleIcon" class="w-3 h-3" />
                      {{ roleLabel }}
                    </span>
                    <span class="text-xs text-gray-400"
                      >Contact admin to change role</span
                    >
                  </div>
                </div>

                <div class="pt-2 flex items-center gap-4">
                  <UButton
                    type="submit"
                    :loading="profileSaving"
                    :disabled="profileSaving"
                    class="bg-[#3d52d5] text-white rounded-xl shadow-sm shadow-blue-500/20 cursor-pointer px-6"
                    size="md"
                  >
                    {{ profileSaving ? "Saving…" : "Save Changes" }}
                  </UButton>
                </div>
              </UForm>
            </UCard>
          </template>

          <!-- SECURITY -->
          <template v-else-if="activeSection === 'security'">
            <Unsupported />

            <UCard class="rounded-2xl border border-gray-400 p-8 bg-white">
              <div class="flex items-center gap-3 mb-8">
                <div
                  class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"
                >
                  <UIcon name="i-lucide-lock" class="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 class="text-lg font-bold text-gray-900">
                    Change Password
                  </h2>
                  <p class="text-sm text-gray-400">
                    Keep your account secure with a strong password
                  </p>
                </div>
              </div>

              <Transition name="fade">
                <div
                  v-if="passwordSuccess"
                  class="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700"
                >
                  <UIcon
                    name="i-lucide-circle-check"
                    class="shrink-0 text-emerald-500"
                  />
                  Password updated successfully.
                </div>
              </Transition>
              <Transition name="fade">
                <div
                  v-if="passwordError"
                  class="mb-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                >
                  <UIcon
                    name="i-lucide-circle-alert"
                    class="shrink-0 text-red-500"
                  />
                  {{ passwordError }}
                </div>
              </Transition>

              <UForm
                :state="passwordState"
                :schema="passwordSchema"
                class="space-y-5"
                @submit="savePassword"
              >
                <UFormField
                  name="currentPassword"
                  label="Current Password"
                  :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
                >
                  <UInput
                    v-model="passwordState.currentPassword"
                    type="password"
                    placeholder="Your current password"
                    :disabled="passwordSaving"
                    :ui="{
                      base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
                    }"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  name="newPassword"
                  label="New Password"
                  :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
                >
                  <UInput
                    v-model="passwordState.newPassword"
                    type="password"
                    placeholder="At least 8 characters"
                    :disabled="passwordSaving"
                    :ui="{
                      base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
                    }"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  name="confirmPassword"
                  label="Confirm New Password"
                  :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
                >
                  <UInput
                    v-model="passwordState.confirmPassword"
                    type="password"
                    placeholder="Re-enter your new password"
                    :disabled="passwordSaving"
                    :ui="{
                      base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
                    }"
                    class="w-full"
                  />
                </UFormField>

                <div class="pt-2">
                  <UButton
                    type="submit"
                    :loading="passwordSaving"
                    :disabled="passwordSaving"
                    class="bg-[#3d52d5] text-white rounded-xl shadow-sm shadow-blue-500/20 cursor-pointer px-6"
                    size="md"
                  >
                    {{ passwordSaving ? "Updating…" : "Update Password" }}
                  </UButton>
                </div>
              </UForm>
            </UCard>
          </template>
        </div>
      </div>
    </div>
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
