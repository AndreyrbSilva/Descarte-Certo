import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useTheme } from "../context/ThemeContext";

const COLORS = {
  light: {
    tabBg:    "#f1f5f9",
    border:   "#cbd5e1",
    inactive: "#94a3b8",
  },
  dark: {
    tabBg:    "#1e293b",
    border:   "#334155",
    inactive: "#64748b",
  },
};

/** Cores estáticas (string) — para props que não aceitam Animated */
export function useTabColors() {
  const { isDark: dark } = useTheme();
  return {
    tabBg:    dark ? COLORS.dark.tabBg    : COLORS.light.tabBg,
    border:   dark ? COLORS.dark.border   : COLORS.light.border,
    active:   "#22c55e",
    inactive: dark ? COLORS.dark.inactive : COLORS.light.inactive,
  };
}

/** Cores animadas — transição suave de 350ms */
export function useAnimatedTabColors() {
  const { isDark } = useTheme();
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

  return {
    tabBg:    interpolate(COLORS.light.tabBg,    COLORS.dark.tabBg),
    border:   interpolate(COLORS.light.border,   COLORS.dark.border),
    active:   "#22c55e",
    inactive: interpolate(COLORS.light.inactive, COLORS.dark.inactive),
  };
}
