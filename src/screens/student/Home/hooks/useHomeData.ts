import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { useAuthStore }    from "../../../../store/useAuthStore";
import { fetchHomeData }   from "../../../../services/homeService";
import { fetchDailyMission, DailyMissionData } from "../../../../services/missionService";
import { useNotificationScheduler } from "../../../../hooks/useNotificationScheduler";

export type LastScan = { category: string; createdAt: string; points: number } | null;

const FACTS = [
  "O Brasil recicla 97% das latas de alumínio, um dos maiores índices do mundo!",
  "Uma folha de papel pode ser reciclada até 7 vezes!",
  "Reciclar 1kg de plástico economiza até 2kg de petróleo!",
  "O lixo orgânico pode virar adubo em apenas 3 meses!",
  "Cada brasileiro gera em média 1kg de lixo por dia!",
];

export function useHomeData() {
  const user         = useAuthStore((s) => s.user);
  const streak       = useAuthStore((s) => s.streak);
  const setStreak    = useAuthStore((s) => s.setStreak);
  const leveledUp    = useAuthStore((s) => s.leveledUp);
  const setLeveledUp = useAuthStore((s) => s.setLeveledUp);
  const avatarUrl    = useAuthStore((s) => s.user?.avatarUrl ?? null);

  const { onAppOpen } = useNotificationScheduler();

  const [totalPoints,   setTotalPoints]   = useState(0);
  const [displayPoints, setDisplayPoints] = useState(0);
  const [schoolRank,    setSchoolRank]    = useState<number | null>(null);
  const [turmaRank,     setTurmaRank]     = useState<number | null>(null);
  const [lastScan,      setLastScan]      = useState<LastScan>(null);
  const [fact,          setFact]          = useState("");
  const [showOverlay,   setShowOverlay]   = useState(false);
  const [streakSheetVisible, setStreakSheetVisible] = useState(false);
  const [mission,       setMission]       = useState<DailyMissionData | null>(null);

  function loadData(onStreakLoaded?: (streak: number) => void, onPointsLoaded?: (points: number) => void) {
    setFact(FACTS[Math.floor(Math.random() * FACTS.length)]);

    fetchHomeData().then((data) => {
      setTotalPoints(data.totalPoints);
      setSchoolRank(data.schoolRank);
      setTurmaRank(data.turmaRank);
      setLastScan(data.lastScan);
      setStreak(data.streak);
      onStreakLoaded?.(data.streak);
      onPointsLoaded?.(data.totalPoints);

      // Trigger notification checks (streak lost, ranking drop, reschedule)
      onAppOpen({
        currentStreak:       data.streak,
        currentRankPosition: data.turmaRank ?? undefined,
      });

      // animate display points counter
      let val = 0;
      const step = Math.ceil(data.totalPoints / 40);
      const timer = setInterval(() => {
        val += step;
        if (val >= data.totalPoints) {
          setDisplayPoints(data.totalPoints);
          clearInterval(timer);
        } else {
          setDisplayPoints(val);
        }
      }, 30);
    });

    fetchDailyMission()
      .then(setMission)
      .catch(() => setMission(null));
  }

  const firstName = user?.name?.split(" ")[0] ?? "Aluno";
  const initial   = firstName[0].toUpperCase();

  return {
    user,
    firstName,
    initial,
    avatarUrl,
    streak,
    leveledUp,
    setLeveledUp,
    totalPoints,
    displayPoints,
    schoolRank,
    turmaRank,
    lastScan,
    fact,
    showOverlay,
    setShowOverlay,
    streakSheetVisible,
    setStreakSheetVisible,
    mission,
    loadData,
  };
}
