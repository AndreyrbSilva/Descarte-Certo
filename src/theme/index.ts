// ── Design tokens ────────────────────────────────────────
export {
  GREEN, GREEN_LIGHT, GREEN_BG, GREEN_DARK,
  ORANGE, BLUE, RED, YELLOW, PURPLE, CYAN, PINK,
  GOLD, SILVER, BRONZE,
  CATEGORY_COLOR,
  palette,
} from "./colors";

// ── Storage ──────────────────────────────────────────────
export type { ThemePreference } from "./storage";
export { saveThemePreference, loadThemePreference } from "./storage";

// ── Streak colors ────────────────────────────────────────
export { getStreakColors } from "./streakColors";

// ── Screen-specific color hooks ──────────────────────────
export { useThemeColors }    from "./useThemeColors";
export { useHomeColors }     from "./useHomeColors";
export { useProfileColors }  from "./useProfileColors";
export { useRankingColors }  from "./useRankingColors";
export { useRegisterColors } from "./useRegisterColors";
export { useScannerColors }  from "./useScannerColors";
export { useScanResultColors } from "./useScanResultColors";
export { useSplashColors }   from "./useSplashColors";
export { useTrophyColors, getTypeColor, getTypeLabel, getTypeEmoji } from "./useTrophyColors";
export { useConfigColors, useAnimatedConfigColors }   from "./useConfigColors";
export { useTabColors, useAnimatedTabColors }         from "./useTabColors";
