<script setup lang="ts">
defineProps<{
  label:    string
  loading?: boolean
}>()

const emit = defineEmits<{ refresh: [] }>()
</script>

<template>
  <div class="flex items-center justify-between mb-3">
    <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {{ label }}
    </span>
    <div class="flex items-center gap-2">
      <!-- Extra actions slot (e.g. "New" button) -->
      <slot />
      <button
        class="text-[#3d52d5] hover:text-blue-800 transition"
        @click="emit('refresh')"
      >
        <UIcon
          name="i-lucide-refresh-cw"
          class="w-3.5 h-3.5"
          :class="{ 'animate-spin': loading }"
        />
      </button>
    </div>
  </div>
</template>