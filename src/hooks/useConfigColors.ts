import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useTheme } from "../context/ThemeContext";

// Cores estáticas (sem animação) — usa em componentes não-Animated
const COLORS = {
  light: {
    bg:           "#f8fafc",
    cardBg:       "#ffffff",
    textColor:    "#1e293b",
    subTextColor: "#64748b",
    dividerColor: "#e2e8f0",
    sectionLabel: "#94a3b8",
  },
  dark: {
    bg:           "#0f172a",
    cardBg:       "#1e293b",
    textColor:    "#f1f5f9",
    subTextColor: "#94a3b8",
    dividerColor: "#334155",
    sectionLabel: "#475569",
  },
};

/**
 * Hook original — retorna cores estáticas (string).
 * Mantido para compatibilidade com componentes que não precisam de animação.
 */
export function useConfigColors() {
  const { isDark: dark } = useTheme();
  return {
    bg:           dark ? COLORS.dark.bg           : COLORS.light.bg,
    cardBg:       dark ? COLORS.dark.cardBg       : COLORS.light.cardBg,
    textColor:    dark ? COLORS.dark.textColor    : COLORS.light.textColor,
    subTextColor: dark ? COLORS.dark.subTextColor : COLORS.light.subTextColor,
    dividerColor: dark ? COLORS.dark.dividerColor : COLORS.light.dividerColor,
    sectionLabel: dark ? COLORS.dark.sectionLabel : COLORS.light.sectionLabel,
    dangerColor:  "#ef4444",
    statusBar:    dark ? "light-content" : "dark-content" as any,
  };
}

/**
 * Hook animado — retorna cores interpoladas com transição suave.
 * Usa Animated.Value (0 = light, 1 = dark) + interpolateColor.
 * Use com Animated.View / Animated.Text.
 */
export function useAnimatedConfigColors() {
  const { isDark } = useTheme();
  const anim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isDark ? 1 : 0,
      duration: 350,
      useNativeDriver: false, // cor não suporta native driver
    }).start();
  }, [isDark]);

  function interpolate(lightColor: string, darkColor: string) {
    return anim.interpolate({
      inputRange: [0, 1],
      outputRange: [lightColor, darkColor],
    });
  }

  return {
    bg:           interpolate(COLORS.light.bg,           COLORS.dark.bg),
    cardBg:       interpolate(COLORS.light.cardBg,       COLORS.dark.cardBg),
    textColor:    interpolate(COLORS.light.textColor,    COLORS.dark.textColor),
    subTextColor: interpolate(COLORS.light.subTextColor, COLORS.dark.subTextColor),
    dividerColor: interpolate(COLORS.light.dividerColor, COLORS.dark.dividerColor),
    sectionLabel: interpolate(COLORS.light.sectionLabel, COLORS.dark.sectionLabel),
    dangerColor:  "#ef4444",
    statusBar:    isDark ? "light-content" : "dark-content" as any,
  };
}
