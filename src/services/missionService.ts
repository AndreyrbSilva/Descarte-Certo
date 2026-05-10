import { api } from "./api";

export interface DailyMissionData {
  mission: {
    title: string;
    description: string;
    type: string;
    target: number;
    category: string | null;
    reward: number;
  };
  progress: number;
  completed: boolean;
  rewardClaimed: boolean;
}

export async function fetchDailyMission(): Promise<DailyMissionData> {
  const res = await api.get("/missions/daily");
  return res.data;
}
