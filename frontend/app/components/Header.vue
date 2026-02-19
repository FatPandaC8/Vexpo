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
        <div class="mb-6 flex items-center ml-5 mt-5">
            <Logo class="w-10 h-10"/>
            <div>
                <h2 class="text-lg font-bold text-[#3d52d5] ml-3">ExpoVerse</h2>
                <p class="text-sm ml-3 text-gray-500">Virtual Expo Platform</p>
            </div>
        </div>
        <!--Logo-->

        <!--Tabs-->
        <UTabs :items="tabs_items" variant="pill" :ui="{
            list: 'flex justify-between rounded gap-3 mt-3',
            trigger: `
                flex-1 text-center rounded-xl py-2 px-5 text-sm font-semibold cursor-pointer
                hover:rounded-xl hover:bg-gray-200 hover:text-blue-400
                transition-all duration-300 ease-in-out
                text-[#b4c5e4]
                data-[state=active]:bg-[#3d52d5]
                data-[state=active]:text-white
                `,
        }"/>
        <!--Tabs-->

        <!--Account-->
        <div class="flex items-center mr-10">
            <UIcon name="i-lucide-user" class="mr-2 w-10"/>
            <UButton 
                v-model="selectedTab"
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