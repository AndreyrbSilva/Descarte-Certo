import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useTheme } from "../context/ThemeContext";

export function useAdminColors() {
  const { isDark: dark } = useTheme();
  return {
    bg:           dark ? "#0f172a" : "#f1f5f9",
    cardBg:       dark ? "#1e293b" : "#ffffff",
    headerBg:     dark ? "#1e293b" : "#ffffff",
    textColor:    dark ? "#f1f5f9" : "#1e293b",
    subTextColor: dark ? "#94a3b8" : "#64748b",
    labelColor:   dark ? "#cbd5e1" : "#475569",
    dividerColor: dark ? "#334155" : "#e2e8f0",
    inputBg:      dark ? "#0f172a" : "#f8fafc",
    inputBorder:  dark ? "#334155" : "#e2e8f0",
    chipBg:       dark ? "#0f172a" : "#f1f5f9",
    rowHover:     dark ? "#243047" : "#f8fafc",
    statusBar:    dark ? ("light-content" as const) : ("dark-content" as const),

    // stat card accents
    statGreen:  "#22c55e",
    statOrange: "#f97316",
    statBlue:   "#3b82f6",
    statRed:    "#ef4444",

    // badge roles
    badgeStudent: { bg: "#dbeafe", text: "#1d4ed8" },
    badgeTeacher: { bg: "#fef9c3", text: "#a16207" },
    badgeAdmin:   { bg: "#fee2e2", text: "#b91c1c" },
  };
}

export function useAnimatedAdminColors(overrideIsDark?: boolean) {
  const { isDark: contextIsDark } = useTheme();
  const isDark = overrideIsDark !== undefined ? overrideIsDark : contextIsDark;
  const anim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isDark ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isDark]);

  function interpolate(lightColor: string, darkColor: string) {
    return anim.interpolate({
      inputRange: [0, 1],
      outputRange: [lightColor, darkColor],
    });
  }

  const l = {
    bg:           "#f1f5f9",
    cardBg:       "#ffffff",
    headerBg:     "#ffffff",
    textColor:    "#1e293b",
    subTextColor: "#64748b",
    labelColor:   "#475569",
    dividerColor: "#e2e8f0",
    inputBg:      "#f8fafc",
    inputBorder:  "#e2e8f0",
    chipBg:       "#f1f5f9",
    rowHover:     "#f8fafc",
  };

  const d = {
    bg:           "#0f172a",
    cardBg:       "#1e293b",
    headerBg:     "#1e293b",
    textColor:    "#f1f5f9",
    subTextColor: "#94a3b8",
    labelColor:   "#cbd5e1",
    dividerColor: "#334155",
    inputBg:      "#0f172a",
    inputBorder:  "#334155",
    chipBg:       "#0f172a",
    rowHover:     "#243047",
  };

  return {
    bg:           interpolate(l.bg, d.bg),
    cardBg:       interpolate(l.cardBg, d.cardBg),
    headerBg:     interpolate(l.headerBg, d.headerBg),
    textColor:    interpolate(l.textColor, d.textColor),
    subTextColor: interpolate(l.subTextColor, d.subTextColor),
    labelColor:   interpolate(l.labelColor, d.labelColor),
    dividerColor: interpolate(l.dividerColor, d.dividerColor),
    inputBg:      interpolate(l.inputBg, d.inputBg),
    inputBorder:  interpolate(l.inputBorder, d.inputBorder),
    chipBg:       interpolate(l.chipBg, d.chipBg),
    rowHover:     interpolate(l.rowHover, d.rowHover),

    statusBar:    isDark ? ("light-content" as const) : ("dark-content" as const),

    statGreen:  "#22c55e",
    statOrange: "#f97316",
    statBlue:   "#3b82f6",
    statRed:    "#ef4444",

    badgeStudent: { bg: "#dbeafe", text: "#1d4ed8" },
    badgeTeacher: { bg: "#fef9c3", text: "#a16207" },
    badgeAdmin:   { bg: "#fee2e2", text: "#b91c1c" },
    animValue:    anim,
  };
}
