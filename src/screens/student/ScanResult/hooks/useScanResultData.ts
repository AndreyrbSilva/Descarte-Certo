import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useAuthStore } from "../../../../store/useAuthStore";

const GREEN = "#22c55e";

const STREAK_THRESHOLDS = [0, 1, 3, 7, 14, 21, 30, 45, 60, 90, 120];

function streakLevel(streak: number): number {
  let level = 0;
  for (const t of STREAK_THRESHOLDS) {
    if (streak >= t) level = t;
    else break;
  }
  return level;
}

export const CATEGORY_LABEL: Record<string, string> = {
  plastico: "Plástico ♻️",
  papel:    "Papel 📄",
  metal:    "Metal 🥫",
  organico: "Orgânico 🍃",
  vidro:    "Vidro 🫙",
};

export const CATEGORY_TIP: Record<string, string> = {
  plastico: "Plásticos levam até 400 anos para se decompor. Reciclar faz toda a diferença!",
  papel:    "Uma tonelada de papel reciclado salva 20 árvores!",
  metal:    "O alumínio pode ser reciclado infinitas vezes sem perder qualidade!",
  organico: "Lixo orgânico pode virar adubo e ajudar a natureza a crescer!",
  vidro:    "O vidro pode ser reciclado infinitas vezes sem perder qualidade!",
};

export const CATEGORY_BIN: Record<string, { color: string; label: string }> = {
  plastico: { color: "#ef4444", label: "Lixeira Vermelha" },
  papel:    { color: "#3b82f6", label: "Lixeira Azul" },
  metal:    { color: "#eab308", label: "Lixeira Amarela" },
  organico: { color: "#92400e", label: "Lixeira Marrom" },
  vidro:    { color: "#22c55e", label: "Lixeira Verde" },
};

export function useScanResultData() {
  const navigation   = useNavigation<any>();
  const route        = useRoute<any>();
  const setStreak    = useAuthStore((s) => s.setStreak);
  const setLeveledUp = useAuthStore((s) => s.setLeveledUp);
  const prevStreak   = useAuthStore((s) => s.streak);

  const { result, photoUri, error } = route.params ?? {};

  const headerAnim     = useRef(new Animated.Value(0)).current;
  const cardAnim       = useRef(new Animated.Value(60)).current;
  const cardOpacity    = useRef(new Animated.Value(0)).current;
  const pointsScale    = useRef(new Animated.Value(0.5)).current;
  const pointsOpacity  = useRef(new Animated.Value(0)).current;
  const confidenceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(GREEN);
    NavigationBar.setButtonStyleAsync("light");

    Animated.sequence([
      Animated.timing(headerAnim,    { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(pointsScale,   { toValue: 1, tension: 120, friction: 6, useNativeDriver: true }),
        Animated.timing(pointsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(cardAnim,    { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();

    if (result?.confidence) {
      Animated.timing(confidenceAnim, {
        toValue: result.confidence,
        duration: 800,
        delay: 400,
        useNativeDriver: false,
      }).start();
    }
  }, []);

  const newStreak = result?.streak ?? 0;
  const leveledUp = streakLevel(newStreak) > streakLevel(prevStreak);

  function goHome() {
    setStreak(newStreak);
    if (leveledUp) setLeveledUp(true);
    navigation.navigate("Tabs", { screen: "Home" });
  }

  const confValue = result?.confidence ?? 0;
  let barColor = "#ef4444";
  if (confValue >= 0.8) barColor = "#22c55e";
  else if (confValue >= 0.6) barColor = "#eab308";

  return {
    navigation,
    result,
    photoUri,
    error,
    headerAnim,
    cardAnim,
    cardOpacity,
    pointsScale,
    pointsOpacity,
    confidenceAnim,
    confValue,
    barColor,
    goHome,
  };
}
