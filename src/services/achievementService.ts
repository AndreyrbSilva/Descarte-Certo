import { api } from "./api";

export interface AchievementData {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  type: string;
  threshold: number;
  reward: number;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: number;
}

export interface NewAchievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  type: string;
  reward: number;
}

export interface AchievementsResponse {
  achievements: AchievementData[];
  totalCount: number;
  unlockedCount: number;
}

export async function fetchAchievements(): Promise<AchievementsResponse> {
  const res = await api.get("/achievements");
  return res.data;
}
