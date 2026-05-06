import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "./api";

export async function registerUser(data: {
  name:      string;
  matricula: string;
  email:     string;
  password:  string;
  turma:     string;
}) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function loginUser(data: {
  matricula:  string;
  password:   string;
  rememberMe: boolean;
}) {
  const response    = await api.post("/auth/login", data);
  const { token, user } = response.data;

  await SecureStore.setItemAsync("token", token);
  await SecureStore.setItemAsync("user",  JSON.stringify(user));
  await SecureStore.setItemAsync("rememberMe", data.rememberMe ? "true" : "false");

  useAuthStore.getState().setAuth(user, token);
  return { token, user };
}

export async function logout() {
  try { await api.post("/auth/logout"); } catch {}
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("user");
  await SecureStore.deleteItemAsync("rememberMe");
  useAuthStore.getState().clearAuth();
}

// email
export async function sendVerifyCode() {
  await api.post("/auth/email/send-code");
}

export async function verifyEmail(code: string) {
  await api.post("/auth/email/verify", { code });
}

export async function changeEmail(newEmail: string, totpCode?: string) {
  await api.post("/auth/email/change", { newEmail, totpCode });
}

export async function confirmChangeEmail(code: string) {
  await api.post("/auth/email/change/confirm", { code });
}

// senha
export async function changePassword(currentPassword: string, newPassword: string, totpCode?: string) {
  await api.post("/auth/password/change", { currentPassword, newPassword, totpCode });
}

// 2FA
export async function setup2FA(): Promise<{ qrCode: string; secret: string }> {
  const res = await api.post("/auth/2fa/setup");
  return res.data;
}

export async function verify2FA(totpCode: string) {
  await api.post("/auth/2fa/verify", { totpCode });
}

export async function disable2FA(totpCode: string) {
  await api.post("/auth/2fa/disable", { totpCode });
}

// dados atuais do usuário
export async function fetchMe() {
  const res = await api.get("/auth/me");
  return res.data.user;
}
