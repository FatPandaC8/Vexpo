import type { Booth, Company, Expo, User } from "@vexpo/schema";

type DashboardData = Booth | Expo | Company | User | null

export const useDashboardStore = defineStore('dashboard', () => {
    const activeView = ref<string>('welcome');
    const activeData = ref<DashboardData>(null);
    const activeId = computed(() => activeData.value?.id ?? null);

    function select(view: string, data?: DashboardData) {
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