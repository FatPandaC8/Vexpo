<script setup lang="ts">
import DeleteConfirm from "~/components/common/DeleteConfirm.vue";
import FormInput from "~/components/common/FormInput.vue";
import SuccessIndicator from "~/components/common/SuccessIndicator.vue";
import { useExpoForm } from "~/composables/form/useExpoForm";
import {} from "~/utils/form.constants";
import { stateProps } from "~/utils/form/expo";

// Reminder: defineProps is for falling through attribute from parent to child
const props = defineProps<{
  expo?: any;
}>();

const emit = defineEmits<{
  saved: [expo: any];
  deleted: [];
}>();

const {
  mode,
  schema,
  state,
  saving,
  success,
  error,
  submit,
  showDelete,
  deleteConfirm,
  deleteLoading,
  canDelete,
  deleteExpo,
} = useExpoForm(props, emit);
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <div
        class="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0"
      >
        <UIcon name="i-lucide-calendar" class="w-6 h-6 text-[#3d52d5]" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ mode === "create" ? "Create Expo" : "Edit Expo" }}
        </h2>
        <p class="text-sm text-gray-400 mt-0.5">
          {{
            mode === "create"
              ? "Set up your new expo event"
              : `Editing: ${expo?.name}`
          }}
        </p>
      </div>
    </div>

    <!-- Success -->
    <SuccessIndicator :success="success" :message="expo_successMsg" />

    <!-- Error -->
    <SuccessIndicator :success="success" :message="error" />

    <!-- Form -->
    <UForm :state="state" :schema="schema" class="space-y-5" @submit="submit">
      <!--Make a list & then for loop through it instead :3-->

      <FormInput
        v-for="field in stateProps"
        :key="field.name"
        v-bind="field"
        :saving="saving"
        :state-property="state"
      />

      <div class="pt-2">
        <UButton
          type="submit"
          :loading="saving"
          class="bg-[#3d52d5] text-white rounded-xl px-6"
        >
          {{
            saving
              ? "Saving…"
              : mode === "create"
                ? "Create Expo"
                : "Save Changes"
          }}
        </UButton>
      </div>
    </UForm>

    <!-- Delete -->
    <DeleteConfirm
      :mode="mode"
      v-model:showDelete="showDelete"
      v-model:deleteConfirm="deleteConfirm"
      :title="'expo'"
      :name="expo?.name"
      :can-delete="canDelete"
      :delete-loading="deleteLoading"
      @delete="deleteExpo"
    />
  </div>
</template>
