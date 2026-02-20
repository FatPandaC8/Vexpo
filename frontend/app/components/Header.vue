<script setup lang="ts">
import Logo from './Logo.vue';
const auth = useAuth();

// Recap: computed - define a value that depends on other reactive data values
const userMenuItems = computed(() => [
  [
    {
      label: auth.user.value?.name ?? 'My Account',
      disabled: true,
      slot: 'account',
    },
  ],
  [
    { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/dashboard' },
    { label: 'My Profile', icon: 'i-lucide-user', to: '/me' },
  ],
  [
    {
      label: 'Sign Out',
      icon: 'i-lucide-log-out',
      onSelect: () => auth.logout(),
    },
  ],
])

</script>

<template>
    <!--3 divs: Logo + Tabs + Account-->
    <header class="flex justify-between items-center bg-blue-50 h-20 sticky top-0 shadow-md z-50">
        <!--Logo-->
        <div class="mb-6 flex items-center ml-20 mt-5">
            <Logo class="w-10 h-10"/>
            <div>
                <h2 class="text-lg font-bold text-[#3d52d5] ml-3">ExpoVerse</h2>
                <p class="text-sm ml-3 text-gray-500">Virtual Expo Platform</p>
            </div>
        </div>
        <!--Logo-->

        <!--Tabs-->
        <nav class="flex gap-3">
            <NuxtLink
                to="/"
                class="gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-200 hover:text-blue-400 transition flex items-center"
                active-class="bg-[#3d52d5] text-white"
            >
                <UIcon name="i-lucide-house"/>
                <span class="mt-1">Home</span>
            </NuxtLink>

            <NuxtLink
                to="/expos"
                class="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-200 hover:text-blue-400 transition gap-2 flex items-center"
                active-class="bg-[#3d52d5] text-white"
            >
                <UIcon name="i-lucide-calendar"/>
                <span class="mt-1">Expos</span>
            </NuxtLink>

            <NuxtLink
                to="/companies"
                class="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-200 hover:text-blue-400 transition gap-2 flex items-center"
                active-class="bg-[#3d52d5] text-white"
            >
                <UIcon name="i-lucide-building"/>
                <span class="mt-1">Companies</span>
            </NuxtLink>
        </nav>
        <!--Tabs-->

        <!--Account-->
        <div class="flex items-center mr-20">
            <!-- Logged IN: dropdown -->
            <template v-if="auth.isLoggedIn">
                <UDropdownMenu :items="userMenuItems" :ui="{ content: 'w-52 rounded-xl shadow-lg z-[200]'}">
                    <UButton
                        variant="ghost"
                        class="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                        <span class="text-sm font-semibold text-gray-700 max-w-24 truncate">
                            {{ auth.user.value?.name ?? 'Account' }}
                        </span>
                        <UIcon name="i-lucide-chevron-down" class="text-gray-400" />
                    </UButton>

                    <template #account>
                        <div class="px-1 py-1.5">
                            <p class="text-xs font-semibold text-gray-800">{{ auth.user.value?.name }}</p>
                            <p class="text-xs text-gray-400 truncate">{{ auth.user.value?.email }}</p>
                        </div>
                    </template>
                </UDropdownMenu>
            </template>

            <!-- Logged OUT: Sign In button -->
            <template v-else>
                <UIcon name="i-lucide-user" class="mr-2 w-6 text-gray-500" />
                <UButton
                    block
                    class="bg-linear-to-r from-[#3d52d5] to-[#090c9b] shadow-lg shadow-blue-500/30 text-white cursor-pointer h-8 rounded-xl"
                    size="lg"
                    to="/auth"
                    >
                    Sign In
                </UButton>
            </template>
        </div>
        <!--Account-->

    </header>
</template>