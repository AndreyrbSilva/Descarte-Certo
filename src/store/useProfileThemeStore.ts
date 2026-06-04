import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

const PROFILE_COLOR_KEY = "profile_theme_color";

export const DEFAULT_PROFILE_COLOR = "#22c55e"; // Default Green

export const PROFILE_COLOR_OPTIONS = [
  { id: "green",  value: "#22c55e", name: "Verde Original", colors: ["#16a34a", "#22c55e", "#4ade80"] },
  { id: "emerald",value: "#10b981", name: "Esmeralda",      colors: ["#059669", "#10b981", "#34d399"] },
  { id: "blue",   value: "#3b82f6", name: "Azul Oceano",    colors: ["#2563eb", "#3b82f6", "#60a5fa"] },
  { id: "indigo", value: "#6366f1", name: "Índigo",         colors: ["#4f46e5", "#6366f1", "#818cf8"] },
  { id: "purple", value: "#a855f7", name: "Roxo",           colors: ["#9333ea", "#a855f7", "#c084fc"] },
  { id: "pink",   value: "#ec4899", name: "Rosa",           colors: ["#db2777", "#ec4899", "#f472b6"] },
  { id: "rose",   value: "#f43f5e", name: "Rubi",           colors: ["#e11d48", "#f43f5e", "#fb7185"] },
  { id: "orange", value: "#f97316", name: "Laranja",        colors: ["#ea580c", "#f97316", "#fb923c"] },
  { id: "amber",  value: "#f59e0b", name: "Âmbar",          colors: ["#d97706", "#f59e0b", "#fbbf24"] },
  { id: "slate",  value: "#64748b", name: "Chumbo",         colors: ["#475569", "#64748b", "#94a3b8"] },
];

interface ProfileThemeStore {
  activeColor: string;
  setProfileColor: (color: string) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useProfileThemeStore = create<ProfileThemeStore>((set) => ({
  activeColor: DEFAULT_PROFILE_COLOR,

  setProfileColor: async (color: string) => {
    set({ activeColor: color });
    try {
      await SecureStore.setItemAsync(PROFILE_COLOR_KEY, color);
    } catch (err) {
      console.warn("Failed to save profile theme color", err);
    }
  },

  hydrate: async () => {
    try {
      const savedColor = await SecureStore.getItemAsync(PROFILE_COLOR_KEY);
      if (savedColor) {
        set({ activeColor: savedColor });
      }
    } catch (err) {
      console.warn("Failed to load profile theme color", err);
    }
  },
}));
