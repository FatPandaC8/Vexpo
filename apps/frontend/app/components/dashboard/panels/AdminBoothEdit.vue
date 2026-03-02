<script setup lang="ts">
import * as z from "zod";
import type { Cell, OccupiedCell } from "~/components/BoothMapPicker.vue";

const props = defineProps<{ booth: any }>();
const emit = defineEmits<{ updated: [booth: any]; deleted: [] }>();

const api = useApi();

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  status: z.string().optional(),
});

const STATUSES = ["pending", "approved", "rejected"];

const state = reactive({
  name: props.booth.name ?? "",
  description: props.booth.description ?? "",
  status: props.booth.status ?? "pending",
});

const mapPosition = ref<Cell | null>(
  props.booth?.mapRow != null && props.booth?.mapCol != null
    ? { row: props.booth.mapRow, col: props.booth.mapCol }
    : null,
);

const occupiedCells = ref<OccupiedCell[]>([]);

async function loadOccupied() {
  const expoId = props.booth?.expoId;
  if (!expoId) return;
  try {
    const booths = await api.get<any[]>(`/expos/${expoId}/booths`);
    occupiedCells.value = (booths as any[])
      .filter((b: any) => b.mapRow != null && b.mapCol != null)
      .map((b: any) => ({ row: b.mapRow, col: b.mapCol, name: b.name }));
  } catch {
    occupiedCells.value = [];
  }
}

onMounted(loadOccupied);

watch(
  () => props.booth,
  (b) => {
    state.name = b.name ?? "";
    state.description = b.description ?? "";
    state.status = b.status ?? "pending";
    mapPosition.value =
      b?.mapRow != null && b?.mapCol != null
        ? { row: b.mapRow, col: b.mapCol }
        : null;
    loadOccupied();
  },
);

const saving = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

async function submit(event: any) {
  saving.value = true;
  error.value = null;
  try {
    const updated = await api.patch<any>(`/booths/${props.booth.id}`, {
      ...event.data,
      mapRow: mapPosition.value?.row ?? null,
      mapCol: mapPosition.value?.col ?? null,
    });
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
const canDelete = computed(() => deleteConfirm.value === props.booth.name);

async function deleteBooth() {
  if (!canDelete.value) return;
  deleteLoading.value = true;
  try {
    await api.del(`/booths/${props.booth.id}`);
    emit("deleted");
  } catch (e: any) {
    error.value = e?.data?.message ?? "Delete failed";
  } finally {
    deleteLoading.value = false;
  }
}

const statusColor: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};
</script>

<template>
  <div>
    <div class="flex items-start justify-between gap-4 mb-8">
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0"
        >
          <UIcon name="i-lucide-store" class="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            {{ booth.name ?? "Booth #" + booth.id }}
          </h2>
          <p class="text-sm text-gray-400 mt-0.5">Expo #{{ booth.expoId }}</p>
        </div>
      </div>
      <span
        class="px-3 py-1 rounded-full text-xs font-semibold border shrink-0 mt-1"
        :class="statusColor[booth.status]"
      >
        {{ booth.status }}
      </span>
    </div>

    <Transition name="fade">
      <div
        v-if="success"
        class="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700"
      >
        <UIcon
          name="i-lucide-circle-check"
          class="shrink-0 text-emerald-500"
        />Booth updated.
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
        label="Booth Name"
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
        name="description"
        label="Description"
        :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
      >
        <UTextarea
          v-model="state.description"
          :rows="3"
          :disabled="saving"
          class="w-full"
          :ui="{
            base: 'border border-gray-200 focus:border-[#3d52d5] px-3 py-2 rounded-xl',
          }"
        />
      </UFormField>
      <UFormField
        name="status"
        label="Status"
        :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
      >
        <USelect
          v-model="state.status"
          variant="soft"
          :items="STATUSES"
          trailing-icon="null"
          :content="{ align: 'start', side: 'bottom' }"
          :ui="{
            base: 'w-full border border-blue-300 h-10 rounded-xl bg-blue-50',
            content: 'bg-white rounded-xl shadow-lg border border-blue-100',
            item: 'px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer rounded-xl',
            itemLabel: 'text-gray-700',
          }"
        />
      </UFormField>

      <!-- Floor Map Position -->
      <BoothMapPicker
        v-model="mapPosition"
        :occupied="occupiedCells"
        label="Floor Map Position"
      />

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
        <UIcon name="i-lucide-trash-2" class="w-4 h-4" />Delete this booth
      </button>
      <Transition name="fade">
        <div
          v-if="showDelete"
          class="mt-4 p-5 rounded-xl border border-red-200 bg-red-50/30"
        >
          <p class="text-sm text-red-700 mb-3">
            Type <strong>{{ booth.name }}</strong> to confirm:
          </p>
          <UInput
            v-model="deleteConfirm"
            placeholder="Booth name"
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
            @click="deleteBooth"
          >
            {{ deleteLoading ? "Deleting…" : "Delete Booth" }}
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
