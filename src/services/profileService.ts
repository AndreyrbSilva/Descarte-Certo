import * as FileSystem from "expo-file-system/legacy";
import * as SecureStore from "expo-secure-store";
import { decode } from "base64-arraybuffer";
import { supabase } from "../lib/supabase";
import { api } from "./api";
import { useAuthStore } from "../store/useAuthStore";

export async function fetchProfile() {
  const [pointsRes, historyRes, rankingRes] = await Promise.all([
    api.get("/scan/points"),
    api.get("/scan/history"),
    api.get("/ranking/me"),
  ]);

  return {
    totalPoints: pointsRes.data.total,
    scans:       historyRes.data.scans,
    totalScans:  historyRes.data.scans.length,
    schoolRank:  rankingRes.data.schoolRank,
    turmaRank:   rankingRes.data.turmaRank,
  };
}

export async function uploadAvatar(localUri: string): Promise<string> {
  const userId   = useAuthStore.getState().user?.id;
  const base64   = await FileSystem.readAsStringAsync(localUri, { encoding: FileSystem.EncodingType.Base64 });
  const buffer   = decode(base64);
  const filePath = `avatars/${userId}.jpg`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, buffer, { contentType: "image/jpeg", upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

  await api.patch("/auth/avatar", { avatarUrl: data.publicUrl });

  useAuthStore.getState().setAvatar(data.publicUrl);

  const updatedUser = { ...useAuthStore.getState().user, avatarUrl: data.publicUrl };
  await SecureStore.setItemAsync("user", JSON.stringify(updatedUser));

  return data.publicUrl;
}
