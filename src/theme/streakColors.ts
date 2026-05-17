type StreakColors = {
  outer:      string;
  innerStart: string;
  innerEnd:   string;
};

// chaves = streak mínimo para atingir o nível
const STREAK_LEVELS: Record<number, StreakColors> = {
  0: { outer: "#94a3b8", innerStart: "#e2e8f0", innerEnd: "#f8fafc" },
  1: { outer: "#fb923c", innerStart: "#fed7aa", innerEnd: "#fff7ed" },
  3: { outer: "#f97316", innerStart: "#fdba74", innerEnd: "#fff7ed" },
  7: { outer: "#ef4444", innerStart: "#fca5a5", innerEnd: "#fff1f2" },
  14: { outer: "#dc2626", innerStart: "#f87171", innerEnd: "#fee2e2" },
  21: { outer: "#eab308", innerStart: "#fde047", innerEnd: "#fefce8" },
  30: { outer: "#22c55e", innerStart: "#86efac", innerEnd: "#f0fdf4" },
  45: { outer: "#06b6d4", innerStart: "#67e8f9", innerEnd: "#ecfeff" },
  60: { outer: "#3b82f6", innerStart: "#93c5fd", innerEnd: "#eff6ff" },
  90: { outer: "#8b5cf6", innerStart: "#c4b5fd", innerEnd: "#f5f3ff" },
  120: { outer: "#ec4899", innerStart: "#f9a8d4", innerEnd: "#fdf2f8" },
};

// pega o nível mais alto que o streak atual alcança
export function getStreakColors(streak: number): StreakColors {
  const thresholds = Object.keys(STREAK_LEVELS)
    .map(Number)
    .sort((a, b) => b - a);

  const level = thresholds.find((t) => streak >= t) ?? 0;
  return STREAK_LEVELS[level];
}
