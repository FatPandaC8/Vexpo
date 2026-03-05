export const useDashboardStore = defineStore('dashboard', () => {
    const activeView = ref<string>('welcome');
    const activeData = ref<any>(null);
    const activeId = computed(() => activeData.value?.id ?? null);

    function select(view: string, data?: any) {
        activeView.value = view;
        activeData.value = data ?? null;
    }
    
    function reset() {
        activeView.value = 'welcome';
        activeData.value = null;
    }

    return {
        activeView,
        activeData,
        activeId,
        select,
        reset
    }
})