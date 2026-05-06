import { api } from "./api";

export type RankingEntry = {
  position:  number;
  userId:    string;
  name:      string;
  avatarUrl: string | null;
  points:    number;
  streak:    number;
  isMe:      boolean;
  turma?:    string;
};

export async function fetchTurmaRanking(): Promise<{ ranking: RankingEntry[]; turma: string }> {
  const res = await api.get("/ranking/turma");
  return res.data;
}

export async function fetchEscolaRanking(): Promise<{ ranking: RankingEntry[] }> {
  const res = await api.get("/ranking/escola");
  return res.data;
}
