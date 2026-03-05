import { RegisterCompanySchema, UpdateCompanySchema } from "@vexpo/schema";
import { stateProps } from "~/utils/form/company";

export function useCompanyForm(props: any, emit: any) {
    const api = useApi();
    const mode = computed(() => (props.company ? "edit" : "create"));
    
    const schema = computed(() =>
      props.company ? UpdateCompanySchema : RegisterCompanySchema,
    );
    
    const state = reactive(
      Object.fromEntries(
        stateProps.map(f => [f.name, props.company?.[f.name] ?? ""])
      )
    );
    
    watch(() => props.company, (c) => {
      stateProps.forEach(f => {
        state[f.name] = c?.[f.name] ?? ""
      })
    });
    
    function resetState() {
      stateProps.forEach(f => {
        state[f.name] = ""
      })
    }
    
    const saving = ref(false);
    const success = ref(false);
    const error = ref<string | null>(null);
    
    async function submit(event: any) {
      saving.value = true;
      error.value = null;
      success.value = false;
    
      try {
        let result: any;
        if (mode.value === "create") {
          result = await api.post<any>("/companies", event.data);
        } else {
          result = await api.patch<any>(
            `/companies/${props.company!.id}`,
            event.data,
          );
        }
    
        success.value = true;
        emit("saved", result);
    
        if (mode.value === "create") resetState();
    
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
    
    // Delete
    const showDelete = ref(false);
    const deleteConfirm = ref("");
    const deleteLoading = ref(false);
    const canDelete = computed(() => deleteConfirm.value === props.company?.name);
    
    async function deleteCompany() {
      if (!canDelete.value) return;
      deleteLoading.value = true;
    
      try {
        await api.del(`/companies/${props.company!.id}`);
        emit("deleted");
      } catch (e: any) {
        error.value = e?.data?.message ?? "Delete failed";
      } finally {
        deleteLoading.value = false;
      }
    }

    return {
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
    }
}
