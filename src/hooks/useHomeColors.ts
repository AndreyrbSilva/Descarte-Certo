import { useColorScheme } from "react-native";

export function useHomeColors() {
  const scheme = useColorScheme();
  const dark   = scheme === "dark";

  return {
    cardBg:        dark ? "#1e293b" : "#ffffff",
    cardBg2:       dark ? "#0f172a" : "#f8fafc",
    textColor:     dark ? "#f1f5f9" : "#1e293b",
    subTextColor:  dark ? "#94a3b8" : "#64748b",
    labelColor:    dark ? "#cbd5e1" : "#475569",
    iconColor:     dark ? "#64748b" : "#94a3b8",
    dividerColor:  dark ? "#1e293b" : "#e2e8f0",
    progressTrack: dark ? "#1e293b" : "#f1f5f9",
    avatarBg:      dark ? "#ffffff20" : "#ffffff30",
    logoutBg:      dark ? "#ffffff15" : "#ffffff20",
    missionIconBg: dark ? "#2d2a00" : "#fef9c3",
    lastIconBg:    dark ? "#052e16" : "#dcfce7",
  };
}
