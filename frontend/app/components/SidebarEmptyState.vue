<script setup lang="ts">
defineProps<{
  icon:     string
  title:    string
  subtitle?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center flex-1 text-center py-8">
    <div class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
      <UIcon :name="icon" class="w-6 h-6 text-gray-300" />
    </div>
    <p class="text-xs font-semibold text-gray-500 mb-1">{{ title }}</p>
    <p v-if="subtitle" class="text-xs text-gray-400">{{ subtitle }}</p>
    <slot />
  </div>
</template>