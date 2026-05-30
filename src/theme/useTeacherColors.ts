import { useTheme } from "../context/ThemeContext";

/**
 * Paleta verde-esmeralda / teal para a tela do Professor.
 * Suporta light e dark mode, seguindo o padrão de useAdminColors.
 */
export function useTeacherColors() {
  const { isDark: dark } = useTheme();

  return {
    // ── Base ────────────────────────────────────────────────────────────────
    bg:           dark ? "#0b1a1a" : "#f0fdfa",
    cardBg:       dark ? "#132626" : "#ffffff",
    headerBg:     dark ? "#0f2222" : "#f0fdfa",
    textColor:    dark ? "#f0fdfa" : "#134e4a",
    subTextColor: dark ? "#7dc4b8" : "#5f8f87",
    labelColor:   dark ? "#a7d8cf" : "#3b7a70",
    dividerColor: dark ? "#1e3e3e" : "#ccfbf1",
    inputBg:      dark ? "#0b1a1a" : "#f0fdfa",
    inputBorder:  dark ? "#1e3e3e" : "#99f6e4",

    // ── Tab switcher ────────────────────────────────────────────────────────
    tabBg:        dark ? "#132626" : "#ffffff",
    tabActive:    "#0d9488",
    tabInactive:  dark ? "#4d7c75" : "#94a3b8",

    // ── Stat card accents ───────────────────────────────────────────────────
    statTeal:     "#14b8a6",
    statEmerald:  "#10b981",
    statCyan:     "#06b6d4",
    statAmber:    "#f59e0b",

    // ── Stat card backgrounds (glassmorphism-inspired) ──────────────────────
    statTealBg:    dark ? "#0d3d3d" : "#ccfbf1",
    statEmeraldBg: dark ? "#064e3b" : "#d1fae5",
    statCyanBg:    dark ? "#083344" : "#cffafe",
    statAmberBg:   dark ? "#451a03" : "#fef3c7",

    // ── Motivation card ─────────────────────────────────────────────────────
    motivationBg:      dark ? "#0d3d3d" : "#ccfbf1",
    motivationBorder:  dark ? "#14b8a6" : "#5eead4",

    // ── Streak chip ─────────────────────────────────────────────────────────
    chipBg:            dark ? "#1e3e3e" : "#e0f7f3",
    chipBorder:        dark ? "#2dd4bf" : "#5eead4",
    chipText:          dark ? "#5eead4" : "#0f766e",

    // ── Podium ──────────────────────────────────────────────────────────────
    gold:    "#f59e0b",
    silver:  "#94a3b8",
    bronze:  "#b45309",
    iconBg:  dark ? "#0f2e2e" : "#ccfbf1",

    // ── Student card (isMe highlight) ───────────────────────────────────────
    meBg:       dark ? "#0d3d3d" : "#ccfbf1",
    meBorder:   "#14b8a6",

    // ── Status bar ──────────────────────────────────────────────────────────
    statusBar: dark ? ("light-content" as const) : ("dark-content" as const),
  };
}
