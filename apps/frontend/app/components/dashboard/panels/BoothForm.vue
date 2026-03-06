<script setup lang="ts">
import { CreateBoothSchema, UpdateBoothSchema } from "@vexpo/schema";
import type { Cell, OccupiedCell } from "~/components/BoothMapPicker.vue";
import DeleteConfirm from "~/components/common/DeleteConfirm.vue";
import SuccessIndicator from "~/components/common/SuccessIndicator.vue";
import { STATUSES } from "~/utils/sidebar/admin.sidebar.constants";

const auth = useAuth();
const api = useApi();

const canEditStatus = computed(
  () =>
    auth.user.value?.role === "admin" || auth.user.value?.role === "organizer",
);

const props = defineProps<{
  expo?: any;
  booth?: any;
}>();

const emit = defineEmits<{
  saved: [booth: any];
  registered: [booth: any];
  deleted: [];
}>();

const mode = computed(() => (props.booth ? "edit" : "create"));

const schema = computed(() =>
  mode.value === "edit" ? UpdateBoothSchema : CreateBoothSchema,
);

// Map position
const mapPosition = ref<Cell | null>(
  props.booth?.mapRow != null && props.booth?.mapCol != null
    ? { row: props.booth.mapRow, col: props.booth.mapCol }
    : null,
);

// 3D model
const modelPath = ref<string | null>(props.booth?.modelPath ?? null);
const modelFileName = ref<string | null>(
  props.booth?.modelPath
    ? (props.booth.modelPath.split(/[\\/]/).pop() ?? null)
    : null,
);
const uploadedFile = ref<File | null>(null);
const fileError = ref<string | null>(null);
const fileUploadKey = ref(0);
const removingModel = ref(false);

// Company
const companyStore = useCompanyStore();

// State (must contain every field the schema needs)
const state = reactive({
  name: props.booth?.name ?? "",
  description: props.booth?.description ?? "",
  companyId: props.booth?.companyId as string | undefined,
  status: props.booth?.status ?? "pending",
  modelPath: props.booth?.modelPath as string | undefined,
  mapRow: props.booth?.mapRow as number | undefined,
  mapCol: props.booth?.mapCol as number | undefined,
});

// Keep state.mapRow / mapCol in sync with the map picker
watch(mapPosition, (pos) => {
  state.mapRow = pos?.row;
  state.mapCol = pos?.col;
});

// Keep state.modelPath in sync with the model ref
watch(modelPath, (val) => {
  state.modelPath = val ?? undefined;
});

// Keep state.companyId in sync when company loads (create mode)
watch(companyStore.company, (company) => {
  if (company?.id && !state.companyId) {
    state.companyId = company.id;
  }
});

// Occupied cells
const occupiedCells = ref<OccupiedCell[]>([]);

async function loadOccupied() {
  const expoId = props.expo?.id ?? props.booth?.expoId;
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

onMounted(() => {
  loadOccupied();
  companyStore.fetchMyCompany(api);
});

// Sync everything when the booth prop changes (e.g. switching between booths)
watch(
  () => props.booth,
  (b) => {
    state.name = b?.name ?? "";
    state.description = b?.description ?? "";
    state.companyId = b?.companyId ?? undefined;
    state.status = b?.status ?? "pending";
    state.mapRow = b?.mapRow ?? undefined;
    state.mapCol = b?.mapCol ?? undefined;
    state.modelPath = b?.modelPath ?? undefined;

    mapPosition.value =
      b?.mapRow != null && b?.mapCol != null
        ? { row: b.mapRow, col: b.mapCol }
        : null;

    modelPath.value = b?.modelPath ?? null;
    modelFileName.value = b?.modelPath
      ? (b.modelPath.split(/[\\/]/).pop() ?? null)
      : null;

    uploadedFile.value = null;
    fileUploadKey.value++;
    fileError.value = null;
    loadOccupied();
  },
);

// Submit
const saving = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

// UForm calls @submit only after schema passes — event.data is the validated payload
async function submit(event: any) {
  console.log("Pressed", event.data);
  saving.value = true;
  error.value = null;
  success.value = false;

  try {
    const payload = { ...event.data };

    // Exhibitors cannot set status
    if (!canEditStatus.value) delete payload.status;

    let result: any;
    if (mode.value === "create") {
      result = await api.post<any>(`/expos/${props.expo!.id}/booths`, payload);
      emit("registered", result);
    } else {
      result = await api.patch<any>(`/booths/${props.booth!.id}`, payload);
      emit("saved", result);
    }

    success.value = true;
    setTimeout(() => {
      success.value = false;
    }, 4000);
  } catch (e: any) {
    const msg = e?.data?.message ?? e?.message;
    error.value = Array.isArray(msg) ? msg.join(", ") : (msg ?? "Save failed");
  } finally {
    saving.value = false;
  }
}

// Delete
const showDelete = ref(false);
const deleteConfirm = ref("");
const deleteLoading = ref(false);
const canDelete = computed(() => deleteConfirm.value === props.booth?.name);

async function deleteBooth() {
  if (!canDelete.value) return;
  deleteLoading.value = true;
  try {
    await api.del(`/booths/${props.booth!.id}`);
    emit("deleted");
  } catch (e: any) {
    error.value = e?.data?.message ?? "Delete failed";
  } finally {
    deleteLoading.value = false;
  }
}

// File upload
watch(uploadedFile, (file) => {
  if (!file) return;
  fileError.value = null;

  const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  if (ext !== ".glb") {
    fileError.value = "Only a .glb file is accepted.";
    uploadedFile.value = null;
    fileUploadKey.value++;
    return;
  }

  if (file.size > 20 * 1024 * 1024) {
    fileError.value = "File too large (max 20 MB).";
    uploadedFile.value = null;
    fileUploadKey.value++;
    return;
  }

  modelPath.value = file.name;
  modelFileName.value = file.name;
});

async function removeModel() {
  uploadedFile.value = null;
  modelPath.value = null;
  modelFileName.value = null;
  fileError.value = null;
  fileUploadKey.value++;

  if (mode.value === "edit" && props.booth?.id) {
    removingModel.value = true;
    try {
      await api.patch(`/booths/${props.booth.id}`, { modelPath: null });
    } catch {
      // non-fatal — next Save will also send null
    } finally {
      removingModel.value = false;
    }
  }
}

const hasModel = computed(() => !!modelFileName.value);

defineExpose({ modelPath });
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between">
      <div class="flex items-center gap-4 mb-8">
        <div
          class="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0"
        >
          <UIcon name="i-lucide-store" class="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            {{ mode === "create" ? "Register Booth" : "Edit Booth" }}
          </h2>
          <p class="text-sm text-gray-400 mt-0.5">
            <template v-if="mode === 'create'">
              Registering for:
              <strong class="text-gray-700">{{ expo?.name }}</strong>
            </template>
            <template v-else>
              Editing: <strong class="text-gray-700">{{ booth?.name }}</strong>
            </template>
          </p>
        </div>
      </div>

      <!-- Company -->
      <div class="rounded-xl border border-gray-400 bg-gray-50 px-8 py-3">
        <p
          class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2.5"
        >
          Company info
        </p>
        <template v-if="mode === 'create'">
          <div
            v-if="companyStore.loading"
            class="flex items-center gap-2 text-sm text-gray-400"
          >
            <UIcon name="i-lucide-loader-circle" class="w-4 h-4 animate-spin" />
            Detecting your company…
          </div>
          <div v-else-if="companyStore.company" class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0"
            >
              <UIcon
                name="i-lucide-building-2"
                class="w-4 h-4 text-violet-600"
              />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-gray-800 truncate">
                {{ companyStore.company.name }}
              </p>
              <p class="text-xs text-gray-400">
                ID #{{ companyStore.company.id }}
              </p>
            </div>
          </div>
          <div
            v-else
            class="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
          >
            <UIcon
              name="i-lucide-triangle-alert"
              class="w-4 h-4 shrink-0 mt-0.5"
            />
            <span
              >No company found. Go to <strong>Company</strong> tab in the
              sidebar to register one first.</span
            >
          </div>
        </template>
        <template v-else>
          <div v-if="booth?.company" class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0"
            >
              <UIcon
                name="i-lucide-building-2"
                class="w-4 h-4 text-violet-600"
              />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">
                {{ booth.company.name }}
              </p>
              <p class="text-xs text-gray-400">ID #{{ booth.companyId }}</p>
            </div>
          </div>
          <div v-else class="text-sm text-gray-400 italic">
            No company linked to this booth
          </div>
        </template>
      </div>
    </div>

    <SuccessIndicator :success="success" :message="booth_successMsg" />
    <SuccessIndicator :success="success" :message="error" />

    <UForm :state="state" :schema="schema" class="space-y-5" @submit="submit">
      <div class="grid grid-cols-2 gap-5">
        <div class="space-y-3">
          <UFormField
            name="name"
            label="Booth Name"
            :ui="{
              error: 'text-red-500 italic text-xs mt-1',
              label: 'font-bold',
            }"
          >
            <UInput
              v-model="state.name"
              placeholder="e.g. TechCorp Innovation Booth"
              :disabled="saving"
              class="w-full"
              :ui="{
                base: 'border border-gray-400 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
              }"
            />
          </UFormField>

          <UFormField
            name="description"
            label="Description"
            :ui="{
              error: 'text-red-500 italic text-xs mt-1',
              label: 'font-bold',
            }"
          >
            <UTextarea
              v-model="state.description"
              placeholder="What will you be showcasing at this booth?"
              :rows="4"
              :disabled="saving"
              class="w-full"
              :ui="{
                base: 'border border-gray-400 focus:border-[#3d52d5] px-3 py-2 rounded-xl',
              }"
            />
          </UFormField>

          <UFormField
            v-if="canEditStatus"
            name="status"
            label="Status"
            :ui="{ error: 'text-red-500 italic text-xs mt-1' }"
          >
            <USelect
              trailing-icon="null"
              v-model="state.status"
              variant="soft"
              :items="STATUSES"
              placeholder="Select a status"
              :content="{ align: 'start', side: 'bottom' }"
              :ui="{
                base: 'w-full border border-blue-300 h-10 rounded-xl bg-blue-50',
                content: 'bg-white rounded-xl shadow-lg border border-blue-100',
                item: 'px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer rounded-xl',
                itemLabel: 'text-gray-700',
              }"
            />
          </UFormField>
        </div>

        <!-- Floor Map Position -->
        <BoothMapPicker
          v-model="mapPosition"
          :occupied="occupiedCells"
          label="Floor Map Position"
        />
      </div>

      <!-- 3D Model Upload -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">
          3D Booth Model
          <span class="font-normal text-gray-400 text-xs ml-1"
            >(only .glb - max 20 MB)</span
          >
        </label>

        <Transition name="slide-down">
          <div
            v-if="hasModel"
            class="mb-3 flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3"
          >
            <UIcon
              name="i-lucide-box"
              class="w-5 h-5 text-violet-500 shrink-0"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-violet-900 truncate">
                {{ modelFileName }}
              </p>
            </div>
            <button
              type="button"
              :disabled="removingModel"
              class="text-violet-300 hover:text-red-500 transition shrink-0 p-1 rounded-lg hover:bg-red-50 disabled:opacity-40"
              title="Remove model"
              @click="removeModel"
            >
              <UIcon
                :name="removingModel ? 'i-lucide-loader-circle' : 'i-lucide-x'"
                class="w-4 h-4"
                :class="{ 'animate-spin': removingModel }"
              />
            </button>
          </div>
        </Transition>

        <UFileUpload
          :key="fileUploadKey"
          v-model="uploadedFile"
          accept=".glb,.gltf"
          :multiple="false"
          label="Drop your 3D model here or click to browse"
          description="Supported: .glb - max 20 MB"
          icon="i-lucide-box"
          class="border-gray-200 bg-gray-50/60 hover:border-violet-500 hover:bg-violet-50/30 cursor-pointer"
        />

        <Transition name="fade">
          <div
            v-if="fileError"
            class="mt-2 flex items-start gap-2 text-xs text-red-600 rounded-xl px-3 py-2"
          >
            <UIcon
              name="i-lucide-circle-alert"
              class="w-3.5 h-3.5 shrink-0 mt-0.5"
            />
            {{ fileError }}
          </div>
        </Transition>
      </div>

      <!-- Submit -->
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
                ? "Register Booth"
                : "Save Changes"
          }}
        </UButton>
      </div>
    </UForm>

    <!-- Delete (edit only) -->
    <DeleteConfirm
      :mode="mode"
      v-model:showDelete="showDelete"
      v-model:deleteConfirm="deleteConfirm"
      :title="'booth'"
      :name="booth?.name"
      :can-delete="canDelete"
      :delete-loading="deleteLoading"
      @delete="deleteBooth"
    />
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
