import { api } from "./api";

export async function fetchHomeData() {
  const [pointsRes, historyRes, rankingRes] = await Promise.all([
    api.get("/scan/points"),
    api.get("/scan/history"),
    api.get("/ranking/me"),
  ]);

  return {
    totalPoints: pointsRes.data.total,
    lastScan:    historyRes.data.scans[0] ?? null,
    schoolRank:  rankingRes.data.schoolRank,
    turmaRank:   rankingRes.data.turmaRank,
  };
}
