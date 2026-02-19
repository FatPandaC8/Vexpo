<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';
import Logo from './Logo.vue';
const tabs_items = ref<TabsItem[]>([
    {
        label: 'Home',
    },
    {
        label: 'Expos',
    },
    {
        label: 'Companies',
    },
    {
        label: 'Dashboard',
    }
])

const selectedTab = ref('Home')
</script>

<template>
    <!--3 divs: Logo + Tabs + Account-->
    <header class="flex justify-between items-center bg-blue-50 h-20 sticky top-0 shadow-md">
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
                class="gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-[#b4c5e4] hover:bg-gray-200 hover:text-blue-400 transition flex items-center"
                active-class="bg-[#3d52d5] text-white"
            >
                <UIcon name="i-lucide-house"/>
                <span class="mt-1">Home</span>
            </NuxtLink>

            <NuxtLink
                to="/expos"
                class="px-5 py-2 rounded-xl text-sm font-semibold text-[#b4c5e4] hover:bg-gray-200 hover:text-blue-400 transition gap-2 flex items-center"
                active-class="bg-[#3d52d5] text-white"
            >
                <UIcon name="i-lucide-calendar"/>
                <span class="mt-1">Expos</span>
            </NuxtLink>

            <NuxtLink
                to="/companies"
                class="px-5 py-2 rounded-xl text-sm font-semibold text-[#b4c5e4] hover:bg-gray-200 hover:text-blue-400 transition gap-2 flex items-center"
                active-class="bg-[#3d52d5] text-white"
            >
                <UIcon name="i-lucide-building"/>
                <span class="mt-1">Companies</span>
            </NuxtLink>

            <NuxtLink
                to="/dashboard"
                class="px-5 py-2 rounded-xl text-sm font-semibold text-[#b4c5e4] hover:bg-gray-200 hover:text-blue-400 transition gap-2 flex items-center"
                active-class="bg-[#3d52d5] text-white"
            >
                <UIcon name="i-lucide-layout-dashboard"/>
                <span class="mt-1">Dashboard</span>
            </NuxtLink>
        </nav>

        <!--Tabs-->

        <!--Account-->
        <div class="flex items-center mr-20">
            <UIcon name="i-lucide-user" class="mr-2 w-10"/>
            <UButton 
                block 
                class="text-center bg-linear-to-r from-[#3d52d5] to-[#090c9b] shadow-lg shadow-blue-500/30 text-white cursor-pointer h-8 rounded-xl"
                size="lg"
                to="http://localhost:3000/auth"
            >
                Sign In
            </UButton>
        </div>
        <!--Account-->

    </header>
</template>