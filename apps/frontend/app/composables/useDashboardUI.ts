export function useDashboardUI(auth: { role: { value: any; }; isExhibitor: { value: any; }; isOrganizer: { value: any; }; isAdmin: { value: any; }; }) {
    // Role display
    const roleLabel = computed(() => {
        const r = auth.role.value;
        if (!r) return "";
        return r.charAt(0) + r.slice(1).toLowerCase();
    });

    const roleBadgeColor = computed(() => {
        if (auth.isExhibitor.value) return "bg-violet-100 text-violet-700";
        if (auth.isOrganizer.value) return "bg-emerald-100 text-emerald-700";
        if (auth.isAdmin.value) return "bg-red-100 text-red-700";
        return "bg-gray-100 text-gray-600";
    });

    const greeting = computed(() => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning";
        if (h < 18) return "Good afternoon";
        return "Good evening";
    });

    // Welcome copy per role
    const welcomeConfig = computed(() => {
        if (auth.isExhibitor.value)
            return {
            icon: "i-lucide-store",
            color: "bg-violet-100 text-violet-500",
            title: "Manage Your Booths & Company",
            body: "Select a booth to edit it, find an expo to register a new booth, or manage your company.",
            };
        if (auth.isOrganizer.value)
            return {
            icon: "i-lucide-calendar",
            color: "bg-emerald-100 text-emerald-500",
            title: "Select or Create an Expo",
            body: "Click an expo in the sidebar to manage it, approve booths, or hit + New to create one.",
            };
        if (auth.isAdmin.value)
            return {
            icon: "i-lucide-shield",
            color: "bg-red-100 text-red-500",
            title: "Admin Control Panel",
            body: "Manage users, expos, booths, and companies. Select a resource type from the sidebar.",
            };
        return null;
    });

    return {
        roleLabel,
        roleBadgeColor,
        greeting,
        welcomeConfig
    }
}