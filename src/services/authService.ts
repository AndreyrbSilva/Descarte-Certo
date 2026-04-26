import * as SecureStore from "expo-secure-store";
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
}) {
  const response = await api.post("/auth/login", data);
  const { token, user } = response.data;
  await SecureStore.setItemAsync("token", token);
  return { token, user };
}

export async function logout() {
  await SecureStore.deleteItemAsync("token");
}
