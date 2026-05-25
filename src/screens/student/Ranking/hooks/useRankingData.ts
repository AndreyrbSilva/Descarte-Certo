import { useState, useRef, useCallback } from "react";
import { Animated } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../../context/ThemeContext";

import { useRankingColors }                              from "../../../../theme/useRankingColors";
import { fetchTurmaRanking, fetchEscolaRanking, RankingEntry } from "../../../../services/rankingService";

export type Tab = "turma" | "escola";

export function useRankingData() {
  const navigation = useNavigation<any>();
  const colors     = useRankingColors();
  const { isDark: dark } = useTheme();

  const [tab,        setTab]        = useState<Tab>("turma");
  const [turmaData,  setTurmaData]  = useState<RankingEntry[]>([]);
  const [escolaData, setEscolaData] = useState<RankingEntry[]>([]);
  const [turmaLabel, setTurmaLabel] = useState("");
  const [loading,    setLoading]    = useState(true);

  const tabAnim     = useRef(new Animated.Value(0)).current;
  const listOpacity = useRef(new Animated.Value(1)).current;

  const cardAnims = useRef(
    Array.from({ length: 15 }, () => ({
      opacity: new Animated.Value(0),
      y:       new Animated.Value(20),
    }))
  ).current;

  useFocusEffect(
    useCallback(() => {
      NavigationBar.setBackgroundColorAsync(colors.bg);
      NavigationBar.setButtonStyleAsync("dark");
      setLoading(true);

      Promise.all([fetchTurmaRanking(), fetchEscolaRanking()]).then(([t, e]) => {
        setTurmaData(t.ranking);
        setTurmaLabel(t.turma ?? "");
        setEscolaData(e.ranking);
        setLoading(false);
        animateCards(t.ranking.length);
      });
    }, [])
  );

  function animateCards(count: number) {
    cardAnims.slice(0, count).forEach((a, i) => {
      Animated.parallel([
        Animated.timing(a.opacity, { toValue: 1, duration: 300, delay: i * 50, useNativeDriver: true }),
        Animated.timing(a.y,       { toValue: 0, duration: 300, delay: i * 50, useNativeDriver: true }),
      ]).start();
    });
  }

  function switchTab(next: Tab) {
    if (next === tab) return;

    Animated.timing(listOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      cardAnims.forEach((a) => { a.opacity.setValue(0); a.y.setValue(20); });
      setTab(next);
      const count = next === "turma" ? turmaData.length : escolaData.length;
      Animated.timing(listOpacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      animateCards(count);
    });

    Animated.spring(tabAnim, {
      toValue: next === "turma" ? 0 : 1,
      useNativeDriver: false,
      tension: 80, friction: 10,
    }).start();
  }

  const data         = tab === "turma" ? turmaData : escolaData;
  const top3         = data.slice(0, 3);
  const rest         = data.slice(3);
  const podiumOrder  = [
    { position: 2 as const, entry: top3[1] ?? null, height: 60 },
    { position: 1 as const, entry: top3[0] ?? null, height: 80 },
    { position: 3 as const, entry: top3[2] ?? null, height: 48 },
  ];

  const tabIndicatorLeft = tabAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ["0%", "50%"],
  });

  return {
    navigation,
    colors,
    dark,
    tab,
    turmaLabel,
    loading,
    listOpacity,
    cardAnims,
    data,
    rest,
    podiumOrder,
    tabIndicatorLeft,
    switchTab,
  };
}
