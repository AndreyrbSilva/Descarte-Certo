import { api } from "./api";
import type { AdminUser, AdminStats } from "../screens/admin/admin.types";

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await api.get("/admin/stats");
  return res.data;
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const res = await api.get("/admin/users");
  return res.data.users;
}

export async function patchUserRole(id: string, role: string): Promise<void> {
  await api.patch(`/admin/users/${id}/role`, { role });
}

export async function removeUser(id: string): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}

// ── Register (via rota pública de auth) ───────────────────────────────────────

export async function registerUser(payload: {
  name:      string;
  email:     string;
  password:  string;
  matricula: string;
  turma:     string;
}): Promise<{ id: string }> {
  const res = await api.post("/auth/register", payload);
  return res.data;
}
