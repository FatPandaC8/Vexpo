<script setup lang="ts">
// Exhibitor: create a new company (mode='create') or edit existing (mode='edit')
import DeleteConfirm from "~/components/common/DeleteConfirm.vue";
import FormInput from "~/components/common/FormInput.vue";
import SuccessIndicator from "~/components/common/SuccessIndicator.vue";
import { useCompanyForm } from "~/composables/form/useCompanyForm";
import { stateProps } from "~/utils/form/company";

const props = defineProps<{
  company?: any;
}>();

const emit = defineEmits<{
  saved: [company: any];
  deleted: [];
}>();

const {
  state,
  schema,
  mode,
  saving,
  success,
  error,
  submit,
  deleteCompany,
  showDelete,
  deleteConfirm,
  deleteLoading,
  canDelete,
} = useCompanyForm(props, emit);
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <div
        class="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0"
      >
        <UIcon name="i-lucide-building-2" class="w-6 h-6 text-violet-600" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ mode === "create" ? "Register Company" : "Edit Company" }}
        </h2>
        <p class="text-sm text-gray-400 mt-0.5">
          {{
            mode === "create"
              ? "Register your company to start exhibiting at expos"
              : `Editing: ${company?.name}`
          }}
        </p>
      </div>
    </div>

    <SuccessIndicator :success="success" :message="company_successMsg" />
    <SuccessIndicator :success="success" :message="error" />

    <UForm :state="state" :schema="schema" class="space-y-5" @submit="submit">
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
          :disabled="saving"
          class="bg-[#3d52d5] text-white rounded-xl shadow-sm shadow-blue-500/20 cursor-pointer px-6"
          size="md"
        >
          {{
            saving
              ? "Saving…"
              : mode === "create"
                ? "Register Company"
                : "Save Changes"
          }}
        </UButton>
      </div>
    </UForm>

    <!-- Delete (edit mode only) -->
    <DeleteConfirm
      :mode="mode"
      v-model:showDelete="showDelete"
      v-model:deleteConfirm="deleteConfirm"
      :title="'company'"
      :name="company?.name"
      :can-delete="canDelete"
      :delete-loading="deleteLoading"
      @delete="deleteCompany"
    />
  </div>
</template>
