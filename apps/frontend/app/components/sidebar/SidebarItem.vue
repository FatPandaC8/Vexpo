<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  active?: boolean;
  activeColor?: string;
}>();

const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    class="w-full text-left rounded-xl border p-3 transition-all group"
    :class="
      active
        ? (activeColor ?? 'border-[#3d52d5]/40 bg-blue-50')
        : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
    "
    @click="emit('click')"
  >
    <div class="flex items-center justify-between gap-2">
      <p class="text-sm font-semibold text-gray-800 truncate">{{ title }}</p>
      <UIcon
        name="i-lucide-chevron-right"
        class="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition shrink-0"
      />
    </div>
    <p v-if="subtitle" class="text-xs text-gray-400 truncate mt-0.5">
      {{ subtitle }}
    </p>
    <!-- Badge / extra content slot -->
    <slot />
  </button>
</template>
