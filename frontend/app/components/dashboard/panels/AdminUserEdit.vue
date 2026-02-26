<script setup lang="ts">
// Admin: view user details, change role, delete
// IMPORTANT: Must be able to change: name, email, role
import * as z from "zod";

const props = defineProps<{ user: any }>();
const emit = defineEmits<{ updated: [user: any]; deleted: [] }>();

const api = useApi();

const ROLES = ["exhibitor", "organizer", "admin"];

const schema = z.object({
  name: z.string().min(4, "Min name length is 4"),
  email: z.email(),
  role: z.string().min(1, "Select a role"),
});

const state = reactive({
  name: props.user.name ?? "",
  userId: props.user.id ?? "",
  email: props.user.email ?? "",
  role: props.user?.roles?.[0] ?? "",
});

watch(
  () => props.user,
  (u) => {
    state.name = u?.name;
    state.email = u?.email;
    state.role = u?.roles?.[0] ?? "";
  },
);

const saving = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

async function save(event: any) {
  saving.value = true;
  error.value = null;
  success.value = false;
  try {
    const updated = await api.patch(`/users/${props.user.id}`, {
      name: event.data.name,
      email: event.data.email,
      role: event.data.role,
    });

    success.value = true;

    emit("updated", { ...props.user, updated });

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

// Delete
const deleteLoading = ref(false);

async function deleteUser() {
  deleteLoading.value = true;
  try {
    console.log(props.user.id)
    await api.del(`/users/${props.user.id}`);
    emit("deleted");
  } catch (e: any) {
    error.value = e?.data?.message ?? "Delete failed";
  } finally {
    deleteLoading.value = false;
  }
}

const roleBadge: Record<string, string> = {
  EXHIBITOR: "bg-violet-100 text-violet-700",
  ORGANIZER: "bg-emerald-100 text-emerald-700",
  ADMIN: "bg-red-100 text-red-700",
};
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-start gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">{{ user.name }}</h2>
        <p class="text-sm text-gray-400 mt-0.5">{{ user.email }}</p>
        <div class="flex gap-2 mt-2 flex-wrap">
          <span
            v-for="role in user.roles"
            :key="role"
            class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            :class="
              roleBadge[role.role.name.toUpperCase()] ??
              'bg-gray-100 text-gray-600'
            "
          >
            {{ role.role.name.toUpperCase() }}
          </span>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="success"
        class="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700"
      >
        <UIcon name="i-lucide-circle-check" class="shrink-0 text-emerald-500" />
        Role updated successfully.
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

    <!-- Role change form -->
    <UCard class="rounded-2xl border border-gray-300 p-6 mb-6">
      <UForm :state="state" :schema="schema" class="space-y-4" @submit="save">
        <UFormField name="name" label="Name">
          <UInput
            type="text"
            v-model="state.name"
            :disabled="saving"
            class="w-full"
            :ui="{
              base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
            }"
          />
        </UFormField>

        <UFormField name="user" label="User ID">
          <UInput
            readonly
            type="text"
            v-model="state.userId"
            :disabled="saving"
            class="w-full"
            :ui="{
              base: 'border border-gray-300 px-3 h-10 rounded-xl cursor-not-allowed bg-gray-200',
            }"
          />
        </UFormField>

        <UFormField name="email" label="Email">
          <UInput
            type="text"
            v-model="state.email"
            :disabled="saving"
            class="w-full"
            :ui="{
              base: 'border border-gray-200 focus:border-[#3d52d5] px-3 h-10 rounded-xl',
            }"
          />
        </UFormField>

        <UFormField name="role" label="Role">
          <USelect
            v-model="state.role"
            variant="soft"
            :items="ROLES"
            placeholder="Select a role"
            :content="{
              align: 'center',
              side: 'bottom',
            }"
            :ui="{
              base: 'w-full border border-blue-300 h-10 rounded bg-blue-50 ',
              content: 'bg-white rounded-xl shadow-lg border border-blue-100',
              item: 'px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer w-100 rounded-xl',
              itemLabel: 'text-gray-700',
              itemTrailingIcon: 'text-blue-500',
            }"
            trailing-icon="null"
          />
        </UFormField>

        <UButton
          type="submit"
          :loading="saving"
          :disabled="saving"
          class="bg-[#3d52d5] text-white rounded-xl"
        >
          Save Changes
        </UButton>
      </UForm>
    </UCard>

    <!-- Delete user -->
    <div class="pt-2">
      <UButton
        :disabled="deleteLoading"
        :loading="deleteLoading"
        size="sm"
        class="rounded-xl cursor-pointer px-5"
        :class="'bg-red-600 text-white'"
        @click="deleteUser"
      >
        {{ deleteLoading ? "Deleting…" : "Delete User" }}
      </UButton>
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
