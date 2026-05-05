import { api } from "./api";

export async function fetchHomeData() {
  const [pointsRes, historyRes, rankingRes, streakRes] = await Promise.all([
    api.get("/scan/points"),
    api.get("/scan/history"),
    api.get("/ranking/me"),
    api.get("/scan/streak"),
  ]);

  return {
    totalPoints: pointsRes.data.total,
    lastScan:    historyRes.data.scans[0] ?? null,
    schoolRank:  rankingRes.data.schoolRank,
    turmaRank:   rankingRes.data.turmaRank,
    streak:      streakRes.data.streak,
  };
}
