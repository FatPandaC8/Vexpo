<script setup lang="ts">
const props = defineProps<{
  status: string;
}>();

const styles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-600",
  active: "bg-blue-100 text-blue-700",
  inactive: "bg-gray-100 text-gray-500",
};

const cls = computed(
  () => styles[props.status?.toLowerCase()] ?? "bg-gray-100 text-gray-600",
);
</script>

<template>
  <span
    class="inline-block text-xs font-medium px-1.5 py-0.5 rounded-md"
    :class="cls"
  >
    {{ status }}
  </span>
</template>
