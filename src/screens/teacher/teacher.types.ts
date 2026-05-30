// ── Teacher module types ─────────────────────────────────────────────────────

import { RankingEntry } from "../../services/rankingService";

// ── Tab type ─────────────────────────────────────────────────────────────────

export type TeacherTab = "turma" | "escola";

// ── Quick stats computed from turma ranking ──────────────────────────────────

export interface TeacherStats {
  totalStudents:    number;
  averagePoints:    number;
  activeStreaks:     number;
  totalPoints:      number;
}

// ── Motivation card data ─────────────────────────────────────────────────────

export interface MotivationData {
  emoji:   string;
  title:   string;
  message: string;
}

// ── Streak chip for the overview section ─────────────────────────────────────

export interface StreakChip {
  userId: string;
  name:   string;
  streak: number;
}

// ── Podium slot ──────────────────────────────────────────────────────────────

export interface PodiumSlot {
  position: 1 | 2 | 3;
  entry:    RankingEntry | null;
  height:   number;
}
