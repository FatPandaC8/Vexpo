<script setup lang="ts">
import * as z from "zod";
import type { Cell, OccupiedCell } from "~/components/BoothMapPicker.vue";

const auth = useAuth();
const api = useApi();

const canEditStatus = computed(
  () =>
    auth.user.value?.roles?.includes("admin") ||
    auth.user.value?.roles?.includes("organizer"),
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

const schema = z.object({
  name: z.string().min(2, "Booth name must be at least 2 characters"),
  description: z.string().optional(),
  companyId: z.number().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

const state = reactive({
  name: props.booth?.name ?? "",
  description: props.booth?.description ?? "",
  companyId: props.booth?.companyId ?? (undefined as number | undefined),
  status: props.booth?.status ?? "pending",
});

const myCompany = ref<any>(null);
const loadingCompany = ref(false);

async function loadMyCompany() {
  if (mode.value !== 'create') return
  loadingCompany.value = true
  try {
    myCompany.value = await api.get<any>('/me/company')
    if (myCompany.value?.id && !state.companyId) {
      state.companyId = myCompany.value.id
    }
  } catch {
    myCompany.value = null
  } finally {
    loadingCompany.value = false
  }
}

// Map position
const mapPosition = ref<Cell | null>(
  props.booth?.mapRow != null && props.booth?.mapCol != null
    ? { row: props.booth.mapRow, col: props.booth.mapCol }
    : null,
);

// Occupied cells from the same expo (loaded once)
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
  loadMyCompany();
});

watch(
  () => props.booth,
  (b) => {
    state.name = b?.name ?? "";
    state.description = b?.description ?? "";
    state.companyId = b?.companyId ?? undefined;
    state.status = b?.status ?? "pending";
    mapPosition.value =
      b?.mapRow != null && b?.mapCol != null
        ? { row: b.mapRow, col: b.mapCol }
        : null;
    modelPath.value = b?.modelPath ?? null;
    console.log("MODEL PATH: ", modelPath);
    modelFileName.value = b?.modelPath
      ? (b.modelPath.split(/[\\/]/).pop() ?? null)
      : null;
    console.log("MODEL FILENAME: ", modelFileName);
    uploadedFile.value = null;
    fileUploadKey.value++; // remount UFileUpload so it shows empty
    fileError.value = null;
    loadOccupied();
  },
);

const STATUSES = ["pending", "approved", "rejected"];

const saving = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

async function submit(event: any) {
  saving.value = true;
  error.value = null;
  success.value = false;
  try {
    const payload: any = {
      ...event.data,
      companyId: state.companyId,
      modelPath: modelPath.value ?? null,
      status: state.status,
      mapRow: mapPosition.value?.row ?? null,
      mapCol: mapPosition.value?.col ?? null,
    };

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

// Delete booth
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

// 3D Model handling
const modelPath = ref<string | null>(props.booth?.modelPath ?? null);
const modelFileName = ref<string | null>(
  props.booth?.modelPath
    ? (props.booth.modelPath.split(/[\\/]/).pop() ?? null)
    : null,
);
const uploadedFile = ref<File | null>(null);
const fileError = ref<string | null>(null);
// Incrementing this key forces UFileUpload to fully remount (clears its internal state)
const fileUploadKey = ref(0);

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

const removingModel = ref(false);

async function removeModel() {
  // Clear local state immediately
  uploadedFile.value = null;
  modelPath.value = null;
  modelFileName.value = null;
  fileError.value = null;
  fileUploadKey.value++; // force UFileUpload to remount empty

  // If editing an existing booth, persist the removal to the DB right away
  // so that a page reload doesn't bring the old modelPath back
  if (mode.value === "edit" && props.booth?.id) {
    removingModel.value = true;
    try {
      await api.patch(`/booths/${props.booth.id}`, { modelPath: null });
    } catch {
      // non-fatal the next "Save Changes" will also send null
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
          <div v-if="loadingCompany" class="flex items-center gap-2 text-sm text-gray-400">
            <UIcon name="i-lucide-loader-circle" class="w-4 h-4 animate-spin" />
            Detecting your company…
          </div>
          <div v-else-if="myCompany" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-building-2" class="w-4 h-4 text-violet-600" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ myCompany.name }}</p>
              <p class="text-xs text-gray-400">ID #{{ myCompany.id }} - {{ myCompany.industry ?? '—' }}</p>
            </div>
          </div>
          <div v-else class="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <UIcon name="i-lucide-triangle-alert" class="w-4 h-4 shrink-0 mt-0.5" />
            <span>No company found. Go to <strong>Company</strong> tab in the sidebar to register one first.</span>
          </div>
        </template>
  
        <template v-else>
          <div v-if="booth?.company" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-building-2" class="w-4 h-4 text-violet-600" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ booth.company.name }}</p>
              <p class="text-xs text-gray-400">ID #{{ booth.companyId }} · {{ booth.company.industry ?? '—' }}</p>
            </div>
          </div>
          <div v-else-if="booth?.companyId" class="text-sm text-gray-500">
            Company ID: <strong>#{{ booth.companyId }}</strong>
          </div>
          <div v-else class="text-sm text-gray-400 italic">No company linked to this booth</div>
        </template>
      </div>
    </div>

    <!-- Alerts -->
    <Transition name="fade">
      <div
        v-if="success"
        class="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700"
      >
        <UIcon name="i-lucide-circle-check" class="shrink-0 text-emerald-500" />
        Booth {{ mode === "create" ? "registered" : "updated" }} successfully!
        <span v-if="mode === 'create'" class="text-emerald-600 ml-1"
          >Check "My Booths" in the sidebar.</span
        >
      </div>
    </Transition>

    <Transition name="fade">
      <div
        v-if="error"
        class="mb-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
      >
        <UIcon name="i-lucide-circle-alert" class="shrink-0 text-red-500" />
        {{ error }}
      </div>
    </Transition>

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

        <!-- Currently linked model pill -->
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

        <!-- Key forces full remount when we need to clear the picker -->
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
      <div class="pt-2 flex items-center gap-3">
        <UButton
          type="submit"
          :loading="saving"
          :disabled="saving"
          class="bg-[#3d52d5] text-white rounded-xl shadow-sm shadow-blue-500/20 cursor-pointer px-7"
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
    <template v-if="mode === 'edit'">
      <div class="mt-10 pt-8 border-t border-gray-100">
        <button
          type="button"
          class="text-sm text-red-400 hover:text-red-600 transition flex items-center gap-2 cursor-pointer----"
          @click="showDelete = !showDelete"
        >
          <UIcon name="i-lucide-trash-2" class="w-4 h-4" />Delete this booth
        </button>
        <Transition name="fade">
          <div
            v-if="showDelete"
            class="mt-4 p-5 rounded-xl border border-red-200 bg-red-50/40"
          >
            <p class="text-sm text-red-700 mb-3">
              Type <strong>{{ booth?.name }}</strong> to confirm:
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
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              "
              @click="deleteBooth"
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
