<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';
import Header from '~/components/Header.vue';

const cat_items = ref<TabsItem[]>([
    {
        label: 'All'
    },
    {
        label: 'Technology'
    },
    {
        label: 'Finance'
    },
    {
        label: 'Healthcare'
    }
])
</script>

<template>
    <Header/>
    <section class="grid grid-cols-2 pt-20">
        <!--Search & Filters-->
        <div class="space-y-6 sticky top-24 h-fit w-72 ml-20">
            <!-- Search -->
            <form class="flex items-center gap-2">
                <div class="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search company name..."
                        class="w-full rounded-xl border border-gray-200 bg-white
                            px-4 py-2.5 text-sm shadow-sm
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                            transition"
                    />
                </div>

                <UButton
                    class="rounded-xl px-4 py-2.5 bg-blue-600
                            hover:bg-blue-700 transition cursor-pointer"
                    >
                    <UIcon name="i-lucide-search" class="text-white w-5 h-5"/>
                </UButton>
            </form>

            <!-- Categories -->
            <UCard
                class="rounded-2xl border border-blue-100 bg-blue-50/60
                    shadow-sm p-5"
            >
                <div class="flex items-center gap-2 mb-4">
                    <UIcon name="i-lucide-funnel" class="text-blue-600 w-4 h-4"/>
                    <h3 class="font-semibold text-gray-800 text-sm tracking-wide">
                        Industries
                    </h3>
                </div>

                <UTabs
                    orientation="vertical"
                    variant="pill"
                    :items="cat_items"
                    class="space-y-1"
                    :ui="{
                        trigger: 'mt-1 w-60 justify-start rounded-lg px-3 py-2 text-sm transition hover:bg-blue-100 text-gray-500 data-[state=active]:bg-blue-600 data-[state=active]:text-white'
                    }"
                />
            </UCard>
        </div>
        <!--Search & Filters-->

        <!--Expos list-->
        <div>
            <!--Genenrate from server-->
        </div>
        <!--Expos list-->
    </section>
</template>