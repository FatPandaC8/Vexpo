export type Section = "users" | "expos" | "booths" | "companies";

export const TABS = [
  { key: "users", label: "Users", icon: "i-lucide-users" },
  { key: "expos", label: "Expos", icon: "i-lucide-calendar" },
  { key: "booths", label: "Booths", icon: "i-lucide-store" },
  { key: "companies", label: "Companies", icon: "i-lucide-building-2" },
];

export const ENDPOINT: Record<Section, string> = {
  users: "/users",
  expos: "/expos",
  booths: "/booths",
  companies: "/companies",
};

export const EDIT_VIEW: Record<Section, string> = {
  users: "admin-user-edit",
  expos: "admin-expo-edit",
  booths: "admin-booth-edit",
  companies: "admin-company-edit",
};

export const ROLES = ["exhibitor", "organizer", "admin"];
export const STATUSES = ["pending", "approved", "rejected"];
