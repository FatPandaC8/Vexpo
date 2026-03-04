<script setup lang="ts">
export interface SidebarTab {
  key: string;
  label: string;
  icon: string;
}

const props = defineProps<{
  tabs: SidebarTab[];
  cols?: number; // default: tabs.length (up to 4)
}>();

const model = defineModel<string>({ required: true });

const colClass = computed(() => {
  const n = props.cols ?? props.tabs.length;
  return (
    { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" }[n] ?? "grid-cols-2"
  );
});
</script>

<template>
  <div :class="`grid gap-0.5 p-1 mb-4 bg-gray-100 rounded-xl ${colClass}`">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="flex flex-col items-center gap-0.5 py-2 rounded-lg text-xs font-semibold transition-all"
      :class="
        model === tab.key
          ? 'bg-white text-[#3d52d5] shadow-sm'
          : 'text-gray-500 hover:text-gray-700'
      "
      @click="model = tab.key"
    >
      <UIcon :name="tab.icon" class="w-3.5 h-3.5" />
      {{ tab.label }}
    </button>
  </div>
</template>
