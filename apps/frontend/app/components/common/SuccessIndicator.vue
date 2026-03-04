<script setup lang="ts">
defineProps<{
    success: boolean;
    message: string | null;
}>();
</script>

<template>
    <Transition name="fade">
        <div 
        v-if="success"
        :class="[
            success === true
            ? 'mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700'
            : 'mb-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700'
        ]">
        {{ message }}
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>