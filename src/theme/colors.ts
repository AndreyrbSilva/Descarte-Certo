/**
 * Design system centralizado — tokens semânticos de cor.
 *
 * Paleta base usada por todos os hooks de cor (useHomeColors, useProfileColors, etc.).
 * Telas que precisam de tokens exclusivos estendem esses valores localmente.
 *
 * Para adicionar uma nova cor: defina aqui primeiro. Se for específica de UMA tela,
 * defina diretamente no hook daquela tela.
 */

// ── Brand ────────────────────────────────────────────────────────────────────
export const GREEN       = "#22c55e";
export const GREEN_LIGHT = "#86efac";
export const GREEN_BG    = "#f0fdf4";
export const GREEN_DARK  = "#052e16";

// ── Accent ───────────────────────────────────────────────────────────────────
export const ORANGE = "#f97316";
export const BLUE   = "#3b82f6";
export const RED    = "#ef4444";
export const YELLOW = "#f59e0b";
export const PURPLE = "#8b5cf6";
export const CYAN   = "#06b6d4";
export const PINK   = "#ec4899";

// ── Medal ────────────────────────────────────────────────────────────────────
export const GOLD   = "#f59e0b";
export const SILVER = "#94a3b8";
export const BRONZE = "#b45309";

// ── Category colors ──────────────────────────────────────────────────────────
export const CATEGORY_COLOR: Record<string, string> = {
  plastico: RED,
  papel:    BLUE,
  metal:    YELLOW,
  organico: "#92400e",
  vidro:    GREEN,
};

// ── Semantic palette (light / dark) ──────────────────────────────────────────

export const palette = {
  light: {
    bg:            "#f8fafc",
    cardBg:        "#ffffff",
    textColor:     "#1e293b",
    subTextColor:  "#64748b",
    labelColor:    "#475569",
    dividerColor:  "#e2e8f0",
    iconBg:        "#dcfce7",
    inputBg:       "#f8fafc",
    inputBorder:   "#e2e8f0",
    sectionLabel:  "#94a3b8",
    chipBg:        "#f1f5f9",
    progressTrack: "#e2e8f0",
    statusBar:     "dark-content" as const,
  },
  dark: {
    bg:            "#0f172a",
    cardBg:        "#1e293b",
    textColor:     "#f1f5f9",
    subTextColor:  "#94a3b8",
    labelColor:    "#cbd5e1",
    dividerColor:  "#334155",
    iconBg:        "#162418",
    inputBg:       "#2d2d2d",
    inputBorder:   "#3d3d3d",
    sectionLabel:  "#475569",
    chipBg:        "#1e293b",
    progressTrack: "#334155",
    statusBar:     "light-content" as const,
  },
} as const;
