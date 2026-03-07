<script setup lang="ts">
import { CreateBoothSchema, UpdateBoothSchema, type Booth, type Expo } from "@vexpo/schema";
import DeleteConfirm from "~/components/common/DeleteConfirm.vue";
import SuccessIndicator from "~/components/common/SuccessIndicator.vue";
import { useBoothMap } from "~/composables/booth/useBoothMap";
import { useBoothModel } from "~/composables/booth/useBoothModel";
import { useBoothForm } from "~/composables/form/useBoothForm";
import { STATUSES } from "~/utils/sidebar/admin.sidebar.constants";
import type { BoothFormEmit } from "@vexpo/schema";

const auth = useAuth();
const api = useApi();
const companyStore = useCompanyStore()
const canEditStatus = computed(
  () =>
    auth.user.value?.role === "admin" || auth.user.value?.role === "organizer",
);

const props = defineProps<{
  expo?: Expo;
  booth?: Booth;
}>();

const emit = defineEmits<BoothFormEmit>();

const map = useBoothMap(
  api,
  () => props.expo?.id ?? props.booth?.expoId
);

const model = useBoothModel(
  api,
  () => props.booth?.id
);

const form = useBoothForm(
  api,
  props,
  emit,
  () => map.mapPosition.value,
  () => model.modelPath.value,
  canEditStatus,
);

const schema = computed(() =>
  form.mode.value === "edit" ? UpdateBoothSchema : CreateBoothSchema
);

watch(map.mapPosition, (pos) => form.syncMap(pos));

watch(model.modelPath, (val) => form.syncModel(val));

watch(
  () => companyStore.company,
  (company) => form.syncCompany(company?.id)
);

watch(
  () => props.booth,
  (b) => {
    form.syncFromBooth(b);
    map.initPosition(b);
    model.initModel(b);
    map.loadOccupied();
  }
);

onMounted(() => {
  map.initPosition(props.booth);
  model.initModel(props.booth);
  map.loadOccupied();
  companyStore.fetchMyCompany(api);
});

defineExpose({ modelPath: model.modelPath });

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
            {{ form.mode.value === "create" ? "Register Booth" : "Edit Booth" }}
          </h2>
          <p class="text-sm text-gray-400 mt-0.5">
            <template v-if="form.mode.value === 'create'">
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
        <template v-if="form.mode.value === 'create'">
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

    <SuccessIndicator :success="form.success.value" :message="booth_successMsg" />
    <SuccessIndicator :success="form.success.value" :message="form.error.value" />

    <UForm :state="form.state" :schema="schema" class="space-y-5" @submit="form.submit">
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
              v-model="form.state.name"
              placeholder="e.g. TechCorp Innovation Booth"
              :disabled="form.saving.value"
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
              v-model="form.state.description"
              placeholder="What will you be showcasing at this booth?"
              :rows="4"
              :disabled="form.saving.value"
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
              v-model="form.state.status"
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
          v-model="map.mapPosition.value"
          :occupied="map.occupiedCells.value"
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
            v-if="model.hasModel.value"
            class="mb-3 flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3"
          >
            <UIcon
              name="i-lucide-box"
              class="w-5 h-5 text-violet-500 shrink-0"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-violet-900 truncate">
                {{ model.modelFileName.value }}
              </p>
            </div>
            <button
              type="button"
              :disabled="model.removingModel.value"
              class="text-violet-300 hover:text-red-500 transition shrink-0 p-1 rounded-lg hover:bg-red-50 disabled:opacity-40"
              title="Remove model"
              @click="model.removeModel"
            >
              <UIcon
                :name="model.removingModel.value ? 'i-lucide-loader-circle' : 'i-lucide-x'"
                class="w-4 h-4"
                :class="{ 'animate-spin': model.removingModel.value }"
              />
            </button>
          </div>
        </Transition>

        <UFileUpload
          :key="model.fileUploadKey.value"
          v-model="model.uploadedFile.value"
          accept=".glb"
          :multiple="false"
          label="Drop your 3D model here or click to browse"
          description="Supported: .glb - max 20 MB"
          icon="i-lucide-box"
          class="border-gray-200 bg-gray-50/60 hover:border-violet-500 hover:bg-violet-50/30 cursor-pointer"
        />

        <Transition name="fade">
          <div
            v-if="model.fileError.value"
            class="mt-2 flex items-start gap-2 text-xs text-red-600 rounded-xl px-3 py-2"
          >
            <UIcon
              name="i-lucide-circle-alert"
              class="w-3.5 h-3.5 shrink-0 mt-0.5"
            />
            {{ model.fileError }}
          </div>
        </Transition>
      </div>

      <!-- Submit -->
      <div class="pt-2">
        <UButton
          type="submit"
          :loading="form.saving.value"
          :disabled="form.saving.value"
          class="bg-[#3d52d5] text-white rounded-xl shadow-sm shadow-blue-500/20 cursor-pointer px-6"
          size="md"
        >
          {{
            form.saving.value
              ? "Saving…"
              : form.mode.value === "create"
                ? "Register Booth"
                : "Save Changes"
          }}
        </UButton>
      </div>
    </UForm>

    <!-- Delete (edit only) -->
    <DeleteConfirm
      :mode="form.mode.value"
      v-model:showDelete="form.showDelete.value"
      v-model:deleteConfirm="form.deleteConfirm.value"
      :title="'booth'"
      :name="booth?.name"
      :can-delete="form.canDelete.value"
      :delete-loading="form.deleteLoading.value"
      @delete="form.deleteBooth"
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
