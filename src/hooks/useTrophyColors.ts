import { useTheme } from "../context/ThemeContext";

const TYPE_COLORS: Record<string, string> = {
  total_scans:         "#22c55e",
  total_points:        "#f59e0b",
  streak:              "#ef4444",
  ranking_turma:       "#f97316",
  ranking_escola:      "#3b82f6",
  ranking_consistency: "#8b5cf6",
  category_diversity:  "#06b6d4",
  missions_completed:  "#ec4899",
};

const TYPE_LABELS: Record<string, string> = {
  total_scans:         "Escaneamento",
  total_points:        "Pontuação",
  streak:              "Sequência",
  ranking_turma:       "Ranking Turma",
  ranking_escola:      "Ranking Escola",
  ranking_consistency: "Consistência",
  category_diversity:  "Diversidade",
  missions_completed:  "Missões",
};

const TYPE_EMOJI: Record<string, string> = {
  total_scans:         "🌱",
  total_points:        "⭐",
  streak:              "🔥",
  ranking_turma:       "🏆",
  ranking_escola:      "🏫",
  ranking_consistency: "📅",
  category_diversity:  "🌈",
  missions_completed:  "🎯",
};

export function getTypeColor(type: string): string {
  return TYPE_COLORS[type] ?? "#22c55e";
}

export function getTypeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type;
}

export function getTypeEmoji(type: string): string {
  return TYPE_EMOJI[type] ?? "🏆";
}

export function useTrophyColors() {
  const { isDark: dark } = useTheme();
  return {
    bg:            dark ? "#0f172a" : "#f8fafc",
    cardBg:        dark ? "#1e293b" : "#ffffff",
    textColor:     dark ? "#f1f5f9" : "#1e293b",
    subTextColor:  dark ? "#94a3b8" : "#64748b",
    dividerColor:  dark ? "#334155" : "#e2e8f0",
    iconBg:        dark ? "#1e293b" : "#f1f5f9",
    progressTrack: dark ? "#334155" : "#e2e8f0",
    lockedBg:      dark ? "#1e293b" : "#e2e8f0",
    lockedIcon:    dark ? "#475569" : "#94a3b8",
    statusBar:     dark ? "light-content" : "dark-content" as any,
  };
}
