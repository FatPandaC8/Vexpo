import { CreateExpoSchema, UpdateExpoSchema } from "@vexpo/schema";
import { stateProps } from "~/utils/form/expo";

export function useExpoForm(props: any, emit: any) {
    const api = useApi();
    const mode = computed(() => (props.expo ? "edit" : "create"));

    const schema = computed(() =>
        props.expo ? UpdateExpoSchema : CreateExpoSchema,
    );

    const state = reactive(
        Object.fromEntries(
        stateProps.map(f => [f.name, props.expo?.[f.name] ?? ""])
        )
    )


    watch(() => props.expo, (e) => {
        stateProps.forEach(f => {
        state[f.name] = e?.[f.name] ?? ""
        })
    })

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

    return {
        mode,
        schema,
        state,
        saving,
        success,
        error,
        submit,
        showDelete,
        deleteConfirm,
        deleteLoading,
        canDelete,
        deleteExpo
    }
}