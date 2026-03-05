<script setup lang="ts">
defineProps<{
    name: string;
    label: string;
    saving: boolean;
    placeholder: string;
    stateProperty: string;
}>();
</script>

<template>
    <UFormField
        :name="name"
        :label="label"
        :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
      >
        <UInput
          :model-value="stateProperty"
          @update:model-value="(val) => $emit('update:stateProperty', val)"
          :placeholder="placeholder"
          :disabled="saving"
          class="w-full"
          :ui="{
            base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
          }"
        />
      </UFormField>
</template>