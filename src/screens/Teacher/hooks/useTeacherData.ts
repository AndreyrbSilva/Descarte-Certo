import { useState, useRef, useCallback } from "react";
import { Animated } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/ThemeContext";

import { useTeacherColors } from "../../../theme/useTeacherColors";
import {
  fetchTurmaRanking,
  fetchEscolaRanking,
  RankingEntry,
} from "../../../services/rankingService";

import type {
  TeacherTab,
  TeacherStats,
  MotivationData,
  StreakChip,
  PodiumSlot,
} from "../teacher.types";

// ── Stats calculator ─────────────────────────────────────────────────────────

function computeStats(data: RankingEntry[]): TeacherStats {
  const totalStudents = data.length;
  const totalPoints   = data.reduce((sum, e) => sum + e.points, 0);
  const averagePoints = totalStudents > 0 ? Math.round(totalPoints / totalStudents) : 0;
  const activeStreaks  = data.filter((e) => e.streak > 0).length;

  return { totalStudents, averagePoints, activeStreaks, totalPoints };
}

// ── Motivation generator ─────────────────────────────────────────────────────

function computeMotivation(stats: TeacherStats): MotivationData {
  if (stats.totalStudents === 0) {
    return {
      emoji:   "📚",
      title:   "Nenhum aluno ainda",
      message: "Aguardando dados da turma para exibir as estatísticas.",
    };
  }

  const streakPercent = (stats.activeStreaks / stats.totalStudents) * 100;

  if (streakPercent === 100) {
    return {
      emoji:   "🔥",
      title:   "Turma em chamas!",
      message: "100% dos alunos com streak ativo. Continue incentivando!",
    };
  }
  if (streakPercent >= 75) {
    return {
      emoji:   "🚀",
      title:   "Engajamento incrível!",
      message: `${stats.activeStreaks} de ${stats.totalStudents} alunos estão com streak ativo. Quase lá!`,
    };
  }
  if (streakPercent >= 50) {
    return {
      emoji:   "💪",
      title:   "Bom progresso!",
      message: `Metade da turma está engajada. Vamos motivar os demais?`,
    };
  }
  if (streakPercent >= 25) {
    return {
      emoji:   "🌱",
      title:   "Crescendo aos poucos",
      message: `${stats.activeStreaks} alunos com streak ativo. Hora de motivar a turma!`,
    };
  }
  return {
    emoji:   "⚡",
    title:   "Hora de agir!",
    message: "Poucos alunos estão ativos. Que tal um desafio para reengajar a turma?",
  };
}

// ── Streak chips builder ─────────────────────────────────────────────────────

function buildStreakChips(data: RankingEntry[]): StreakChip[] {
  return data
    .filter((e) => e.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .map((e) => ({ userId: e.userId, name: e.name, streak: e.streak }));
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useTeacherData() {
  const navigation = useNavigation<any>();
  const colors     = useTeacherColors();
  const { isDark: dark } = useTheme();

  const [tab,        setTab]        = useState<TeacherTab>("turma");
  const [turmaData,  setTurmaData]  = useState<RankingEntry[]>([]);
  const [escolaData, setEscolaData] = useState<RankingEntry[]>([]);
  const [turmaLabel, setTurmaLabel] = useState("");
  const [loading,    setLoading]    = useState(true);

  // ── Animations refs (for tab indicator & list cross-fade) ────────────────
  const tabAnim     = useRef(new Animated.Value(0)).current;
  const listOpacity = useRef(new Animated.Value(1)).current;

  const cardAnims = useRef(
    Array.from({ length: 15 }, () => ({
      opacity: new Animated.Value(0),
      y:       new Animated.Value(20),
    }))
  ).current;

  // ── Fetch data on focus ──────────────────────────────────────────────────

  useFocusEffect(
    useCallback(() => {
      NavigationBar.setBackgroundColorAsync(colors.bg);
      NavigationBar.setButtonStyleAsync(dark ? "light" : "dark");
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

  // ── Card stagger animation ──────────────────────────────────────────────

  function animateCards(count: number) {
    cardAnims.slice(0, count).forEach((a, i) => {
      Animated.parallel([
        Animated.timing(a.opacity, {
          toValue: 1, duration: 300, delay: i * 50, useNativeDriver: true,
        }),
        Animated.timing(a.y, {
          toValue: 0, duration: 300, delay: i * 50, useNativeDriver: true,
        }),
      ]).start();
    });
  }

  // ── Tab switch with smooth animations ───────────────────────────────────

  function switchTab(next: TeacherTab) {
    if (next === tab) return;

    // cross-fade the list content
    Animated.timing(listOpacity, {
      toValue: 0, duration: 120, useNativeDriver: true,
    }).start(() => {
      cardAnims.forEach((a) => {
        a.opacity.setValue(0);
        a.y.setValue(20);
      });
      setTab(next);
      const count = next === "turma" ? turmaData.length : escolaData.length;
      Animated.timing(listOpacity, {
        toValue: 1, duration: 150, useNativeDriver: true,
      }).start();
      animateCards(count);
    });

    // spring the tab indicator
    Animated.spring(tabAnim, {
      toValue: next === "turma" ? 0 : 1,
      useNativeDriver: false,
      tension: 80,
      friction: 10,
    }).start();
  }

  // ── Computed values ─────────────────────────────────────────────────────

  const data        = tab === "turma" ? turmaData : escolaData;
  const stats       = computeStats(turmaData);
  const motivation  = computeMotivation(stats);
  const streakChips = buildStreakChips(turmaData);

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  const podiumOrder: PodiumSlot[] = [
    { position: 2, entry: top3[1] ?? null, height: 60 },
    { position: 1, entry: top3[0] ?? null, height: 80 },
    { position: 3, entry: top3[2] ?? null, height: 48 },
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
    stats,
    motivation,
    streakChips,
  };
}
