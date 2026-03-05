<script setup lang="ts">
import { CreateExpoSchema, UpdateExpoSchema } from "@vexpo/schema";
import DeleteConfirm from "~/components/common/DeleteConfirm.vue";
import Input from "~/components/common/Input.vue";
import SuccessIndicator from "~/components/common/SuccessIndicator.vue";
import {} from "~/utils/form.constants";

// Reminder: defineProps is for falling through attribute from parent to child
const props = defineProps<{
  expo?: any;
}>();

const emit = defineEmits<{
  saved: [expo: any];
  deleted: [];
}>();

const api = useApi();
const mode = computed(() => (props.expo ? "edit" : "create"));

const schema = computed(() =>
  props.expo ? UpdateExpoSchema : CreateExpoSchema,
);

const state = reactive({
  name: props.expo?.name ?? "",
  type: props.expo?.type ?? "",
  description: props.expo?.description ?? "",
  startDate: props.expo?.startDate ?? "",
  endDate: props.expo?.endDate ?? "",
});

watch(
  () => props.expo,
  (e) => {
    state.name = e?.name ?? "";
    state.type = e?.type ?? "";
    state.description = e?.description ?? "";
    state.startDate = e?.startDate ?? "";
    state.endDate = e?.endDate ?? "";
  },
);

const saving = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

async function submit(event: any) {
  saving.value = true;
  error.value = null;
  success.value = false;

  try {
    let result;

    if (mode.value === "create") {
      result = await api.post("/expos", event.data);
    } else {
      result = await api.patch(`/expos/${props.expo!.id}`, event.data);
    }

    success.value = true;
    emit("saved", result);

    if (mode.value === "create") {
      state.name = "";
      state.description = "";
      state.startDate = "";
      state.endDate = "";
    }

    setTimeout(() => (success.value = false), 3000);
  } catch (e: any) {
    const msg = e?.data?.message ?? e?.message;
    error.value = Array.isArray(msg) ? msg.join(", ") : (msg ?? "Save failed");
  } finally {
    saving.value = false;
  }
}

const showDelete = ref(false);
const deleteConfirm = ref("");
const deleteLoading = ref(false);
const canDelete = computed(() => deleteConfirm.value === props.expo?.name);

async function deleteExpo() {
  if (!canDelete.value) return;
  deleteLoading.value = true;

  try {
    await api.del(`/expos/${props.expo!.id}`);
    emit("deleted");
  } catch (e: any) {
    error.value = e?.data?.message ?? "Delete failed";
  } finally {
    deleteLoading.value = false;
  }
}
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
      <Input
        :name="'name'"
        :label="'Expo name'"
        :saving="saving"
        :placeholder="'Tech Innovation Expo 2026'"
        :state-property="state.name"
      />

      <UFormField name="type" label="Expo type">
        <UInput
          v-model="state.type"
          placeholder="Tech, Healthcare, ..."
          :disabled="saving"
          class="w-full"
          :ui="{
            base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
          }"
        />
      </UFormField>

      <UFormField name="startDate" label="Start Date">
        <UInput
          type="date"
          v-model="state.startDate"
          :disabled="saving"
          class="w-full"
          :ui="{
            base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
          }"
        />
      </UFormField>

      <UFormField name="endDate" label="End Date">
        <UInput
          type="date"
          v-model="state.endDate"
          :disabled="saving"
          class="w-full"
          :ui="{
            base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
          }"
        />
      </UFormField>

      <UFormField name="description" label="Description">
        <UTextarea
          v-model="state.description"
          placeholder="Describe your expo..."
          :rows="4"
          :disabled="saving"
          class="w-full"
          :ui="{
            base: 'border border-gray-200 focus:border-[#3d52d5] px-3 py-2 rounded-xl',
          }"
        />
      </UFormField>

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
