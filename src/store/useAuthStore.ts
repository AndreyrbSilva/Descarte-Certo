import { create } from "zustand";

interface User {
  id:               string;
  name:             string;
  email:            string;
  turma?:           string;
  avatarUrl?:       string;
  emailVerified?:   boolean;
  twoFactorEnabled?: boolean;
}

interface AuthState {
  user:         User | null;
  token:        string | null;
  streak:       number;
  leveledUp:    boolean;
  setAuth:      (user: User, token: string) => void;
  setAvatar:    (url: string) => void;
  setStreak:    (streak: number) => void;
  setLeveledUp: (v: boolean) => void;
  setUser:      (user: Partial<User>) => void;
  clearAuth:    () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:         null,
  token:        null,
  streak:       0,
  leveledUp:    false,
  setAuth:      (user, token) => set({ user, token }),
  setAvatar:    (url) => set((state) => ({
    user: state.user ? { ...state.user, avatarUrl: url } : null,
  })),
  setStreak:    (streak) => set({ streak }),
  setLeveledUp: (v) => set({ leveledUp: v }),
  setUser:      (partial) => set((state) => ({
    user: state.user ? { ...state.user, ...partial } : null,
  })),
  clearAuth:    () => set({ user: null, token: null, streak: 0, leveledUp: false }),
}));
