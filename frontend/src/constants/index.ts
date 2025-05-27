export type ThemeOption = {
  name: string;
  label: string;
  colors: [string, string, string]; // fixed length tuple for 3 colors
};

export const THEMES: ThemeOption[] = [
  {
    name: "coffee",
    label: "Coffee",
    colors: ["#20161F", "#A67C58", "#807666"],
  },
  {
    name: "forest",
    label: "Forest",
    colors: ["#171212", "#2B4C3F", "#6BAA75"],
  },

  {
    name: "luxury",
    label: "Luxury",
    colors: ["#171618", "#B6862D", "#E2C697"],
  },
  {
    name: "autumn",
    label: "Autumn",
    colors: ["#D8B4A0", "#D27548", "#BA4A00"],
  },
  {
    name: "valentine",
    label: "Valentine",
    colors: ["#E96D7B", "#FF8FAB", "#FFB3C6"],
  },
  {
    name: "aqua",
    label: "Aqua",
    colors: ["#2DD4BF", "#06B6D4", "#0EA5E9"],
  },
  {
    name: "business",
    label: "Business",
    colors: ["#1C4E80", "#0091D5", "#7DB9DE"],
  },
  {
    name: "night",
    label: "Night",
    colors: ["#0F172A", "#334155", "#64748B"],
  },
  {
    name: "dracula",
    label: "Dracula",
    colors: ["#282A36", "#BD93F9", "#FF79C6"],
  },
];
