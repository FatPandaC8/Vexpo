<script setup lang="ts">
defineProps<{
  name: string
  type?: string
  label: string
  saving: boolean
  placeholder?: string
  component?: string
  stateProperty: Record<string, any>
}>()
</script>

<template>
  <UFormField
    :name="name"
    :label="label"
    :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
  >
    <!-- Textarea -->
    <UTextarea
      v-if="component === 'textarea'"
      v-model="stateProperty[name]"
      :placeholder="placeholder"
      :disabled="saving"
      :rows="4"
      class="w-full"
      :ui="{
        base: 'border border-gray-200 focus:border-[#3d52d5] px-3 py-2 rounded-xl',
      }"
    />

    <!-- Input -->
    <UInput
      v-else
      :type="type || 'text'"
      v-model="stateProperty[name]"
      :placeholder="placeholder"
      :disabled="saving"
      class="w-full"
      :ui="{
        base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
      }"
    />
  </UFormField>
</template>