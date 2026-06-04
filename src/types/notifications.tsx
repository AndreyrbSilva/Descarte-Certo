// ── Notification type definitions ─────────────────────────

/** All notification categories the user can toggle on/off */
export type NotificationCategory =
  | "streak"
  | "missions"
  | "ranking"
  | "achievements"
  | "weekly"
  | "reengagement"
  | "milestones";

/** Granular notification identifiers for scheduling / handling */
export type NotificationType =
  | "streak-reminder"       // 🔥 Daily 18h — haven't scanned today
  | "streak-lost"           // 😢 Streak was reset to 0
  | "mission-daily"         // 🎯 Daily 08h — new mission available
  | "mission-almost"        // 🏆 Mission progress >= 80%
  | "achievement-unlocked"  // 🏅 New achievement unlocked
  | "ranking-up"            // 📊 Climbed in ranking
  | "ranking-down"          // 📊 Someone passed you
  | "weekly-summary"        // 📈 Monday weekly recap
  | "reengagement"          // 👋 3+ days inactive
  | "milestone";            // 🎉 Points milestone reached

/** Maps each notification type to its parent category */
export const NOTIFICATION_CATEGORY_MAP: Record<NotificationType, NotificationCategory> = {
  "streak-reminder":      "streak",
  "streak-lost":          "streak",
  "mission-daily":        "missions",
  "mission-almost":       "missions",
  "achievement-unlocked": "achievements",
  "ranking-up":           "ranking",
  "ranking-down":         "ranking",
  "weekly-summary":       "weekly",
  "reengagement":         "reengagement",
  "milestone":            "milestones",
};

/** Notification preference defaults (all enabled) */
export const DEFAULT_NOTIFICATION_PREFERENCES: Record<NotificationCategory, boolean> = {
  streak:        true,
  missions:      true,
  ranking:       true,
  achievements:  true,
  weekly:        true,
  reengagement:  true,
  milestones:    true,
};

/** UI metadata for each notification category */
export interface NotificationCategoryMeta {
  key:         NotificationCategory;
  label:       string;
  description: string;
  icon:        React.ReactNode;
}

import React from "react";
import { IconFlame, IconTarget, IconRanking, IconMedal, IconTrend, IconMailCheck, IconCelebrate } from "../components/icons";

export const NOTIFICATION_CATEGORIES_META: NotificationCategoryMeta[] = [
  { key: "streak",        label: "Streak",         description: "Lembretes para manter seu streak diário",      icon: <IconFlame outer="#22c55e" innerStart="#16a34a" innerEnd="#15803d" size={20} /> },
  { key: "missions",      label: "Missões",        description: "Missão diária e progresso de missões",         icon: <IconTarget color="#22c55e" size={20} /> },
  { key: "ranking",       label: "Ranking",        description: "Mudanças na sua posição no ranking",           icon: <IconRanking color="#22c55e" size={20} /> },
  { key: "achievements",  label: "Conquistas",     description: "Novas conquistas desbloqueadas",               icon: <IconMedal type="gold" size={20} /> },
  { key: "weekly",        label: "Resumo semanal", description: "Resumo da sua semana toda segunda-feira",      icon: <IconTrend color="#22c55e" size={20} /> },
  { key: "reengagement",  label: "Lembretes",      description: "Avisos quando faz tempo que você não aparece", icon: <IconMailCheck color="#22c55e" size={20} /> },
  { key: "milestones",    label: "Marcos",         description: "Marcos de pontuação alcançados",               icon: <IconCelebrate color="#22c55e" size={20} /> },
];

/** Content template for a notification */
export interface NotificationContent {
  title: string;
  body:  string;
  data?: Record<string, unknown>;
}
