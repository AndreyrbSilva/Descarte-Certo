import { create } from "zustand";

interface User {
  id:         string;
  name:       string;
  email:      string;
  turma?:     string;
  avatarUrl?: string;
}

interface AuthState {
  user:      User | null;
  token:     string | null;
  setAuth:   (user: User, token: string) => void;
  setAvatar: (url: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:      null,
  token:     null,
  setAuth:   (user, token) => set({ user, token }),
  setAvatar: (url) => set((state) => ({
    user: state.user ? { ...state.user, avatarUrl: url } : null,
  })),
  clearAuth: () => set({ user: null, token: null }),
}));
