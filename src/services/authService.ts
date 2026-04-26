import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "./api";

export async function registerUser(data: {
  name: string;
  matricula: string;
  email: string;
  password: string;
  turma: string;
}) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function loginUser(data: {
  matricula: string;
  password: string;
  rememberMe: boolean;
}) {
  const response = await api.post("/auth/login", data);
  const { token, user } = response.data;

  if (data.rememberMe) {
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
  }
  useAuthStore.getState().setAuth(user, token);
  return { token, user };
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {
    // ignora erro de rede ou token inválido,importante é limpar localmente
  }
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("user");
  useAuthStore.getState().clearAuth();
}

