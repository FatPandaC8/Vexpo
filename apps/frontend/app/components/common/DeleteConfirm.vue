<script setup lang="ts">
// Why use this instead of state management: in the tip (https://vuejs.org/guide/components/events.html)
// 'If there is a need to communicate between sibling or deeply nested components, use an external event bus or a global state management solution.'
// As this component does not require communicating between sibling -> only need to use emit for simplicity

const props = defineProps<{
  mode: string; // in edit mode or not
  showDelete: boolean; // should the delete box be visible
  title: string; // the thing being deleted
  name?: string; // the name must type
  deleteConfirm: string; // what the user typed
  canDelete: boolean; // is the name correct
  deleteLoading: boolean; // is the deletion running
}>();
// NOTE: these values belong to the parent. The child is NOT allowed
// to change them directly -> important -> use emit & v-model instead

const emit = defineEmits<{
  // eventName: expectedArgument: void (tell typescript that the func responsible for emiiting the event does not return a value)
  (e: "update:showDelete", value: boolean): void;
  (e: "update:deleteConfirm", value: string): void;
  (e: "delete"): void;
}>();
</script>

<template>
  <div class="mt-10 pt-8 border-t border-gray-100">
    <button
      class="text-sm text-red-400 hover:text-red-600 transition flex items-center gap-2"
      @click="emit('update:showDelete', !showDelete)"
    >
      <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
      Delete this {{ title }}
    </button>

    <Transition name="fade">
      <div
        v-if="showDelete"
        class="mt-4 p-5 rounded-xl border border-red-200 bg-red-50/30"
      >
        <p class="text-sm text-red-700 mb-3">
          Type <strong>{{ name }}</strong> to confirm:
        </p>

        <!--:model-value: one-way bind from parent to child component-->
        <!--v-model: two-way binding-->
        <!--The child component must explicitly accept the modelValue prop and emit the update:modelValue event to enable the two-way sync.-->

        <!--User type sth -> input gives new val -> send to parent -> parent update deleteConfirm-->
        <UInput
          :model-value="deleteConfirm"
          @update:model-value="
            (val: string) => emit('update:deleteConfirm', val)
          "
          class="mb-4 w-full max-w-xs"
          :ui="{
            base: 'border border-red-200 focus:border-red-400 px-3 h-10 rounded-xl',
          }"
        />

        <UButton
          :disabled="!canDelete || deleteLoading"
          :loading="deleteLoading"
          size="sm"
          class="rounded-xl px-5"
          :class="
            canDelete ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'
          "
          @click="emit('delete')"
        >
          {{ deleteLoading ? "Deleting…" : "Permanently Delete" }}
        </UButton>
      </div>
    </Transition>
  </div>
</template>

<!-- Example usage -->
<!-- <DeleteConfirm
    :mode="mode"
    v-model:showDelete="showDelete"
    v-model:deleteConfirm="deleteConfirm"
    :title="'expo'"
    :name="expo?.name"
    :can-delete="canDelete"
    :delete-loading="deleteLoading"
    @delete="deleteExpo"
/> -->
