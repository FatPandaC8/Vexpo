<script setup lang="ts">
// Admin: edit or delete any company

import * as z from "zod";

const props = defineProps<{ company: any }>();
const emit = defineEmits<{ updated: [company: any]; deleted: [] }>();

const api = useApi();

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  industry: z.string().optional(),
  website: z.url("Must be a valid URL").optional().or(z.literal("")),
});

const state = reactive({
  name: props.company.name ?? "",
  exhibitorId: props.company.exhibitorId ?? "",
  description: props.company.description ?? "",
  industry: props.company.industry ?? "",
  website: props.company.website ?? "",
});

watch(
  () => props.company,
  (c) => {
    state.name = c.name ?? "";
    state.exhibitorId = c.exhibitorId ?? "";
    state.description = c.description ?? "";
    state.industry = c.industry ?? "";
    state.website = c.website ?? "";
  },
);

const saving = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

async function submit(event: any) {
  saving.value = true;
  error.value = null;
  try {
    const updated = await api.patch<any>(
      `/companies/${props.company.id}`,
      event.data,
    );
    success.value = true;
    emit("updated", updated);
    setTimeout(() => {
      success.value = false;
    }, 3000);
  } catch (e: any) {
    const msg = e?.data?.message ?? e?.message;
    error.value = Array.isArray(msg)
      ? msg.join(", ")
      : (msg ?? "Update failed");
  } finally {
    saving.value = false;
  }
}

const showDelete = ref(false);
const deleteConfirm = ref("");
const deleteLoading = ref(false);
const canDelete = computed(() => deleteConfirm.value === props.company.name);

async function deleteCompany() {
  if (!canDelete.value) return;
  deleteLoading.value = true;
  try {
    await api.del(`/companies/${props.company.id}`);
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
    <div class="flex items-center gap-3 mb-8">
      <div
        class="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0"
      >
        <UIcon name="i-lucide-building-2" class="w-6 h-6 text-amber-600" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">{{ company.name }}</h2>
        <p class="text-sm text-gray-400 mt-0.5">
          {{ company.industry ?? "Admin - edit company" }}
        </p>
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="success"
        class="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700"
      >
        <UIcon
          name="i-lucide-circle-check"
          class="shrink-0 text-emerald-500"
        />Company updated.
      </div>
    </Transition>
    <Transition name="fade">
      <div
        v-if="error"
        class="mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
      >
        <UIcon name="i-lucide-circle-alert" class="shrink-0 text-red-500" />{{
          error
        }}
      </div>
    </Transition>

    <UForm :state="state" :schema="schema" class="space-y-5" @submit="submit">
      <UFormField
        name="name"
        label="Company Name"
        :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
      >
        <UInput
          v-model="state.name"
          :disabled="saving"
          class="w-full"
          :ui="{
            base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
          }"
        />
      </UFormField>

      <UFormField
        name="exhibitor"
        label="Exhibitor ID"
        :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
      >
        <UInput
          readonly
          v-model="state.exhibitorId"
          :disabled="saving"
          class="w-full"
          :ui="{
            base: 'border border-gray-300 px-3 h-10 rounded-xl cursor-not-allowed bg-gray-200',
          }"
        />
      </UFormField>

      <UFormField
        name="industry"
        label="Industry"
        :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
      >
        <UInput
          v-model="state.industry"
          placeholder="Technology, Healthcare…"
          :disabled="saving"
          class="w-full"
          :ui="{
            base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
          }"
        />
      </UFormField>

      <UFormField
        name="website"
        label="Website"
        :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
      >
        <UInput
          v-model="state.website"
          placeholder="https://…"
          :disabled="saving"
          class="w-full"
          :ui="{
            base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
          }"
        />
      </UFormField>

      <UFormField
        name="description"
        label="Description"
        :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
      >
        <UTextarea
          v-model="state.description"
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
          :disabled="saving"
          class="bg-[#3d52d5] text-white rounded-xl shadow-sm shadow-blue-500/20 cursor-pointer px-6"
          size="md"
        >
          {{ saving ? "Saving…" : "Save Changes" }}
        </UButton>
      </div>
    </UForm>

    <div class="mt-10 pt-8 border-t border-gray-100">
      <button
        class="text-sm text-red-400 hover:text-red-600 transition flex items-center gap-2 cursor-pointer"
        @click="showDelete = !showDelete"
      >
        <UIcon name="i-lucide-trash-2" class="w-4 h-4" />Delete this company
      </button>
      <Transition name="fade">
        <div
          v-if="showDelete"
          class="mt-4 p-5 rounded-xl border border-red-200 bg-red-50/30"
        >
          <p class="text-sm text-red-700 mb-3">
            Type <strong>{{ company.name }}</strong> to confirm:
          </p>
          <UInput
            v-model="deleteConfirm"
            placeholder="Company name"
            class="mb-4 w-full max-w-xs"
            :ui="{
              base: 'border border-red-200 focus:border-red-400 px-3 h-10 rounded-xl',
            }"
          />
          <UButton
            :disabled="!canDelete || deleteLoading"
            :loading="deleteLoading"
            size="sm"
            class="rounded-xl cursor-pointer px-5"
            :class="
              canDelete
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            "
            @click="deleteCompany"
          >
            {{ deleteLoading ? "Deleting…" : "Delete Company" }}
          </UButton>
        </div>
      </Transition>
    </div>
  </div>
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
