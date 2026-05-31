import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useTheme } from "../context/ThemeContext";

const COLORS = {
  light: {
    bg:           "#f8fafc",
    cardBg:       "#ffffff",
    headerBg:     "#f8fafc",
    textColor:    "#1e293b",
    subTextColor: "#64748b",
    labelColor:   "#475569",
    dividerColor: "#e2e8f0",
    inputBg:      "#f8fafc",
    inputBorder:  "#e2e8f0",

    // Tab
    tabBg:        "#ffffff",
    tabActive:    "#22c55e",
    tabInactive:  "#94a3b8",

    // Podium bases
    gold:         "#d97706",
    silver:       "#475569",
    bronze:       "#b45309",
    iconBg:       "#f1f5f9",

    // Motivation
    motivationBg:     "#f0fdf4",
    motivationBorder: "#bbf7d0",

    // Streak chip
    chipBg:       "#f1f5f9",
    chipBorder:   "#e2e8f0",
    chipText:     "#1e293b",

    // Student card highlight
    meBg:         "#f0fdf4",
    meBorder:     "#22c55e",
  },
  dark: {
    bg:           "#0f172a",
    cardBg:       "#1e293b",
    headerBg:     "#0f172a",
    textColor:    "#f1f5f9",
    subTextColor: "#94a3b8",
    labelColor:   "#cbd5e1",
    dividerColor: "#334155",
    inputBg:      "#2d2d2d",
    inputBorder:  "#3d3d3d",

    // Tab
    tabBg:        "#1e293b",
    tabActive:    "#22c55e",
    tabInactive:  "#64748b",

    // Podium bases
    gold:         "#d97706",
    silver:       "#475569",
    bronze:       "#b45309",
    iconBg:       "#1e293b",

    // Motivation
    motivationBg:     "rgba(34, 197, 94, 0.05)",
    motivationBorder: "#15803d",

    // Streak chip
    chipBg:       "#1e293b",
    chipBorder:   "#334155",
    chipText:     "#f1f5f9",

    // Student card highlight
    meBg:         "rgba(34, 197, 94, 0.1)",
    meBorder:     "#22c55e",
  },
};

export function useTeacherColors(overrideIsDark?: boolean) {
  const { isDark: contextIsDark } = useTheme();
  const dark = overrideIsDark !== undefined ? overrideIsDark : contextIsDark;
  const current = dark ? COLORS.dark : COLORS.light;

  return {
    ...current,
    statusBar: dark ? ("light-content" as const) : ("dark-content" as const),
  };
}

export function useAnimatedTeacherColors(overrideIsDark?: boolean) {
  const { isDark: contextIsDark } = useTheme();
  const isDark = overrideIsDark !== undefined ? overrideIsDark : contextIsDark;
  const anim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isDark ? 1 : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [isDark]);

  function interpolate(lightColor: string, darkColor: string) {
    return anim.interpolate({
      inputRange: [0, 1],
      outputRange: [lightColor, darkColor],
    });
  }

  const l = COLORS.light;
  const d = COLORS.dark;

  return {
    bg:               interpolate(l.bg, d.bg),
    cardBg:           interpolate(l.cardBg, d.cardBg),
    headerBg:         interpolate(l.headerBg, d.headerBg),
    textColor:        interpolate(l.textColor, d.textColor),
    subTextColor:     interpolate(l.subTextColor, d.subTextColor),
    labelColor:       interpolate(l.labelColor, d.labelColor),
    dividerColor:     interpolate(l.dividerColor, d.dividerColor),
    inputBg:          interpolate(l.inputBg, d.inputBg),
    inputBorder:      interpolate(l.inputBorder, d.inputBorder),

    tabBg:            interpolate(l.tabBg, d.tabBg),
    tabActive:        "#22c55e",
    tabInactive:      interpolate(l.tabInactive, d.tabInactive),

    gold:             "#d97706",
    silver:           "#475569",
    bronze:           "#b45309",
    iconBg:           interpolate(l.iconBg, d.iconBg),

    motivationBg:     interpolate(l.motivationBg, d.motivationBg),
    motivationBorder: interpolate(l.motivationBorder, d.motivationBorder),

    chipBg:           interpolate(l.chipBg, d.chipBg),
    chipBorder:       interpolate(l.chipBorder, d.chipBorder),
    chipText:         interpolate(l.chipText, d.chipText),

    meBg:             interpolate(l.meBg, d.meBg),
    meBorder:         "#22c55e",

    statusBar:        isDark ? ("light-content" as const) : ("dark-content" as const),
  };
}
