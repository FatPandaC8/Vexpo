export const items = [
  { label: "Sign In", value: "signin", slot: "signin" },
  { label: "Sign Up", value: "signup", slot: "signup" },
];

export const roles = ["exhibitor", "organizer"];

export const roleOptions: {
  value: "exhibitor" | "organizer";
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "exhibitor",
    label: "Exhibitor",
    description: "Showcase your company, register booths.",
    icon: "i-lucide-building-2",
  },
  {
    value: "organizer",
    label: "Organizer",
    description: "Create and manage virtual expos from start to finish.",
    icon: "i-lucide-calendar-check",
  },
];