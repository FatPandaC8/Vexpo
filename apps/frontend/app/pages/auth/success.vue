<script setup lang="ts">
// /auth/success
// Google OAuth (existing users) land here with ?token=xxx
// We save it as a cookie (not localStorage) then redirect to dashboard.

const route = useRoute();
const auth = useAuth();

const token = route.query.token as string | undefined;

if (!token) {
  // No token - something went wrong upstream
  await navigateTo("/auth");
} else {
  auth.setToken(token);
  // Fetch the user profile so the header shows their name immediately
  await auth.fetchProfile();
  await navigateTo("/");
}
</script>

<template>
  <!-- Shown for a split second before the redirect fires -->
  <div class="min-h-screen flex items-center justify-center bg-blue-50">
    <div class="text-center space-y-4">
      <div
        class="w-12 h-12 mx-auto rounded-full bg-[#3d52d5]/10 flex items-center justify-center"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="w-6 h-6 text-[#3d52d5] animate-spin"
        />
      </div>
      <p class="text-gray-500 text-sm">Logging you in…</p>
    </div>
  </div>
</template>
