import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

import type { NotificationCategory } from "../types/notifications";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "../types/notifications";

// ── Persistence key ──────────────────────────────────────
const STORAGE_KEY = "notification-preferences";

// ── Types ────────────────────────────────────────────────
type Preferences = Record<NotificationCategory, boolean>;

interface NotificationState {
  /** Per-category toggle preferences */
  preferences:        Preferences;
  /** Expo push token for remote notifications */
  expoPushToken:      string | null;
  /** ISO string of last scan date — used for streak reminder logic */
  lastScanDate:       string | null;
  /** Last known ranking position — used to detect ranking changes */
  lastRankingPosition: number | null;
  /** Last known total points — used for milestone detection */
  lastTotalPoints:    number;
  /** Whether the store has been hydrated from storage */
  hydrated:           boolean;

  // ── Actions ──
  setPreference:       (category: NotificationCategory, enabled: boolean) => void;
  setAllPreferences:   (prefs: Preferences) => void;
  setExpoPushToken:    (token: string | null) => void;
  setLastScanDate:     (date: string | null) => void;
  setLastRankingPosition: (pos: number | null) => void;
  setLastTotalPoints:  (points: number) => void;
  /** Check if a specific category is enabled */
  isEnabled:           (category: NotificationCategory) => boolean;
  /** Load preferences from SecureStore */
  hydrate:             () => Promise<void>;
  /** Persist current preferences to SecureStore */
  persist:             () => Promise<void>;
}

// ── Store ────────────────────────────────────────────────
export const useNotificationStore = create<NotificationState>((set, get) => ({
  preferences:         { ...DEFAULT_NOTIFICATION_PREFERENCES },
  expoPushToken:       null,
  lastScanDate:        null,
  lastRankingPosition: null,
  lastTotalPoints:     0,
  hydrated:            false,

  setPreference: (category, enabled) => {
    set((state) => ({
      preferences: { ...state.preferences, [category]: enabled },
    }));
    // Auto-persist after change
    get().persist();
  },

  setAllPreferences: (prefs) => {
    set({ preferences: prefs });
    get().persist();
  },

  setExpoPushToken: (token) => {
    set({ expoPushToken: token });
    get().persist();
  },

  setLastScanDate: (date) => {
    set({ lastScanDate: date });
    get().persist();
  },

  setLastRankingPosition: (pos) => {
    set({ lastRankingPosition: pos });
    get().persist();
  },

  setLastTotalPoints: (points) => {
    set({ lastTotalPoints: points });
    get().persist();
  },

  isEnabled: (category) => {
    return get().preferences[category] ?? true;
  },

  hydrate: async () => {
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set({
          preferences:         { ...DEFAULT_NOTIFICATION_PREFERENCES, ...parsed.preferences },
          expoPushToken:       parsed.expoPushToken ?? null,
          lastScanDate:        parsed.lastScanDate ?? null,
          lastRankingPosition: parsed.lastRankingPosition ?? null,
          lastTotalPoints:     parsed.lastTotalPoints ?? 0,
          hydrated:            true,
        });
      } else {
        set({ hydrated: true });
      }
    } catch (e) {
      console.warn("[NotificationStore] Failed to hydrate:", e);
      set({ hydrated: true });
    }
  },

  persist: async () => {
    try {
      const { preferences, expoPushToken, lastScanDate, lastRankingPosition, lastTotalPoints } = get();
      await SecureStore.setItemAsync(
        STORAGE_KEY,
        JSON.stringify({ preferences, expoPushToken, lastScanDate, lastRankingPosition, lastTotalPoints }),
      );
    } catch (e) {
      console.warn("[NotificationStore] Failed to persist:", e);
    }
  },
}));
