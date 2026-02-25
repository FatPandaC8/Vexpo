<script setup lang="ts">
// Admin: create (expo=undefined) or edit/delete an expo

import * as z from "zod";

const props = defineProps<{ expo?: any }>();
const emit = defineEmits<{ saved: [expo: any]; deleted: [] }>();

const api = useApi();
const mode = computed(() => "edit");

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.string(),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

const state = reactive({
  name: props.expo?.name ?? "",
  organizerId: props.expo.organizerId ?? "",
  type: props.expo?.type ?? "",
  description: props.expo?.description ?? "",
  startDate: props.expo?.startDate ?? "",
  endDate: props.expo?.endDate ?? "",
});

watch(
  () => props.expo,
  (e) => {
    state.name = e?.name ?? "";
    state.organizerId = e?.organizerId ?? "";
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
  try {
    const result = await api.patch<any>(`expos/${props.expo!.id}`, event.data);
    success.value = true;
    emit("saved", result);

    setTimeout(() => {
      success.value = false;
    }, 3000);
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
const canDelete = computed(() => deleteConfirm.value === props.expo?.title);

async function deleteExpo() {
  if (!canDelete.value) return;
  deleteLoading.value = true;
  try {
    await api.del(`expos/${props.expo!.id}`);
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
        class="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0"
      >
        <UIcon name="i-lucide-calendar" class="w-6 h-6 text-emerald-600" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ expo?.name }}
        </h2>
        <p class="text-sm text-gray-400 mt-0.5">
          {{ "Edit expo details" }}
        </p>
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="success"
        class="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700"
      >
        <UIcon name="i-lucide-circle-check" class="shrink-0 text-emerald-500" />
        Expo {{ "updated" }} successfully.
      </div>
    </Transition>
    <Transition name="fade">
      <div
        v-if="error"
        class="mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
      >
        <UIcon name="i-lucide-circle-alert" class="shrink-0 text-red-500" />
        {{ error }}
      </div>
    </Transition>

    <UForm :state="state" :schema="schema" class="space-y-5" @submit="submit">
      <UFormField
        name="name"
        label="Name"
        :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
      >
        <UInput
          v-model="state.name"
          placeholder="Expo name"
          :disabled="saving"
          class="w-full"
          :ui="{
            base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
          }"
        />
      </UFormField>

      <UFormField
        name="organizerId"
        label="Organizer ID"
        :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
      >
        <UInput
          readonly
          v-model="state.organizerId"
          placeholder="Expo name"
          :disabled="saving"
          class="w-full"
          :ui="{
            base: 'border border-gray-300 px-3 h-10 rounded-xl cursor-not-allowed bg-gray-200',
          }"
        />
      </UFormField>

      <UFormField
        name="type"
        label="Industry"
        :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
      >
        <UInput
          v-model="state.type"
          placeholder="Technology, Healthcare, ..."
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

    <template v-if="mode === 'edit'">
      <div class="mt-10 pt-8 border-t border-gray-100">
        <button
          class="text-sm text-red-400 hover:text-red-600 transition flex items-center gap-2 cursor-pointer"
          @click="showDelete = !showDelete"
        >
          <UIcon name="i-lucide-trash-2" class="w-4 h-4" />Delete this expo
        </button>
        <Transition name="fade">
          <div
            v-if="showDelete"
            class="mt-4 p-5 rounded-xl border border-red-200 bg-red-50/30"
          >
            <p class="text-sm text-red-700 mb-3">
              Type <strong>{{ expo?.name }}</strong> to confirm:
            </p>
            <UInput
              v-model="deleteConfirm"
              placeholder="Expo title"
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
              @click="deleteExpo"
            >
              {{ deleteLoading ? "Deleting…" : "Permanently Delete" }}
            </UButton>
          </div>
        </Transition>
      </div>
    </template>
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
