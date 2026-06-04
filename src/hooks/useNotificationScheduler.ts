import { useCallback } from "react";

import {
  scheduleNotification,
  cancelAllNotifications,
  getScheduledNotifications,
  dailyTrigger,
  secondsTrigger,
} from "../services/notificationService";
import { useNotificationStore } from "../store/useNotificationStore";

import type { NewAchievement } from "../services/achievementService";

// ── Points milestones ────────────────────────────────────
const MILESTONES = [50, 100, 250, 500, 1000, 2500, 5000, 10000];

/**
 * Hook that provides all notification scheduling logic.
 * Call its methods after relevant user actions (scan, app open, etc).
 */
export function useNotificationScheduler() {
  const store = useNotificationStore();

  // ── Schedule the recurring local notifications ─────────
  const scheduleRecurring = useCallback(async () => {
    // Cancel all existing scheduled notifications first
    await cancelAllNotifications();

    // 🔥 Streak reminder — daily at 18:00
    if (store.isEnabled("streak")) {
      await scheduleNotification({
        type: "streak-reminder",
        content: {
          title: "🔥 Não perca seu streak!",
          body:  "Você ainda não escaneou hoje. Abra o app e mantenha seu streak!",
          data:  { screen: "Scanner" },
        },
        trigger: dailyTrigger(18, 0),
      });
    }

    // 🎯 Daily mission — daily at 08:00
    if (store.isEnabled("missions")) {
      await scheduleNotification({
        type: "mission-daily",
        content: {
          title: "🎯 Missão do dia disponível!",
          body:  "Sua nova missão diária está esperando. Abra o app e confira!",
          data:  { screen: "Home" },
        },
        trigger: dailyTrigger(8, 0),
      });
    }

    // 👋 Reengagement — fires 3 days from now, reset on each app open
    if (store.isEnabled("reengagement")) {
      await scheduleNotification({
        type: "reengagement",
        content: {
          title: "👋 Sentimos sua falta!",
          body:  "Faz tempo que não te vemos. Sua missão do dia está esperando! 🎯",
          data:  { screen: "Home" },
        },
        trigger: secondsTrigger(3 * 24 * 60 * 60), // 3 days in seconds
      });
    }

    // 📈 Weekly summary — every Monday at 09:00
    if (store.isEnabled("weekly")) {
      await scheduleNotification({
        type: "weekly-summary",
        content: {
          title: "📈 Resumo da semana",
          body:  "Confira como foi sua semana de reciclagem! Abra o app para ver seus resultados. 🌱",
          data:  { screen: "Home" },
        },
        trigger: {
          type: 3, // WEEKLY
          weekday: 2, // Monday (1=Sunday, 2=Monday, ...)
          hour: 9,
          minute: 0,
        } as any,
      });
    }
  }, [store]);

  // ── After a scan: check achievements, milestones, mission progress, ranking ──
  const onScanCompleted = useCallback(async (params: {
    streak:           number;
    totalPoints:      number;
    newAchievements:  NewAchievement[];
    missionProgress?: number;
    missionTarget?:   number;
    newRankPosition?: number;
  }) => {
    const {
      streak, totalPoints, newAchievements,
      missionProgress, missionTarget, newRankPosition,
    } = params;

    // Update last scan date
    store.setLastScanDate(new Date().toISOString());

    // 🏅 Achievement unlocked notifications
    if (store.isEnabled("achievements") && newAchievements.length > 0) {
      for (const ach of newAchievements) {
        await scheduleNotification({
          type: "achievement-unlocked",
          content: {
            title: "🏅 Conquista desbloqueada!",
            body:  `Você desbloqueou: "${ach.title}"! +${ach.reward} pontos 🎉`,
            data:  { screen: "Trophies", achievementId: ach.id },
          },
          trigger: secondsTrigger(1), // fire almost immediately
        });
      }
    }

    // 🎉 Milestone reached
    if (store.isEnabled("milestones")) {
      const lastPoints = store.lastTotalPoints;
      for (const milestone of MILESTONES) {
        if (lastPoints < milestone && totalPoints >= milestone) {
          await scheduleNotification({
            type: "milestone",
            content: {
              title: "🎉 Marco atingido!",
              body:  `Você atingiu ${milestone} pontos! Continue assim! 🌟`,
              data:  { screen: "Home" },
            },
            trigger: secondsTrigger(2),
          });
          break; // only notify for the highest milestone crossed
        }
      }
      store.setLastTotalPoints(totalPoints);
    }

    // 🏆 Mission almost complete (>= 80% progress)
    if (
      store.isEnabled("missions") &&
      missionProgress !== undefined &&
      missionTarget !== undefined &&
      missionTarget > 0
    ) {
      const percent = missionProgress / missionTarget;
      if (percent >= 0.8 && percent < 1) {
        const remaining = missionTarget - missionProgress;
        await scheduleNotification({
          type: "mission-almost",
          content: {
            title: "🏆 Quase lá!",
            body:  `Falta ${remaining === 1 ? "só 1 scan" : `apenas ${remaining} scans`} pra completar sua missão!`,
            data:  { screen: "Home" },
          },
          trigger: secondsTrigger(1),
        });
      }
    }

    // 📊 Ranking position changed (after your own scan)
    if (store.isEnabled("ranking") && newRankPosition !== undefined) {
      const lastPos = store.lastRankingPosition;
      if (lastPos !== null && newRankPosition !== lastPos) {
        if (newRankPosition < lastPos) {
          // Went up!
          await scheduleNotification({
            type: "ranking-up",
            content: {
              title: "📊 Você subiu no ranking!",
              body:  `Agora você está em ${newRankPosition}º lugar! Continue assim! 🚀`,
              data:  { screen: "Ranking" },
            },
            trigger: secondsTrigger(3),
          });
        }
        // "ranking-down" from other users is handled in onAppOpen
      }
      store.setLastRankingPosition(newRankPosition);
    }

    // Reschedule recurring notifications (resets reengagement timer + streak reminder)
    await scheduleRecurring();
  }, [store, scheduleRecurring]);

  // ── On app open: detect streak lost & ranking drops ────
  const onAppOpen = useCallback(async (params: {
    currentStreak:     number;
    currentRankPosition?: number;
  }) => {
    const { currentStreak, currentRankPosition } = params;

    // 🔥 Streak lost detection
    if (store.isEnabled("streak")) {
      const lastScan = store.lastScanDate;
      if (lastScan) {
        const lastDate = new Date(lastScan);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        // If more than 1 day since last scan and streak is now 0
        if (diffDays > 1 && currentStreak === 0) {
          await scheduleNotification({
            type: "streak-lost",
            content: {
              title: "😢 Streak perdido!",
              body:  `Seu streak acabou. Comece um novo agora! 💪`,
              data:  { screen: "Scanner" },
            },
            trigger: secondsTrigger(1),
          });
        }
      }
    }

    // 📊 Ranking — someone passed you (detected on app open)
    if (store.isEnabled("ranking") && currentRankPosition !== undefined) {
      const lastPos = store.lastRankingPosition;
      if (lastPos !== null && currentRankPosition > lastPos) {
        await scheduleNotification({
          type: "ranking-down",
          content: {
            title: "📊 Alguém te ultrapassou!",
            body:  `Você caiu para ${currentRankPosition}º lugar. Escaneie para recuperar! ♻️`,
            data:  { screen: "Ranking" },
          },
          trigger: secondsTrigger(2),
        });
      }
      store.setLastRankingPosition(currentRankPosition);
    }

    // Reschedule recurring (resets reengagement timer)
    await scheduleRecurring();
  }, [store, scheduleRecurring]);

  return {
    scheduleRecurring,
    onScanCompleted,
    onAppOpen,
  };
}
