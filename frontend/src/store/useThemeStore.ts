import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "autumn", // default
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage", // Key in localStorage
    }
  )
);
