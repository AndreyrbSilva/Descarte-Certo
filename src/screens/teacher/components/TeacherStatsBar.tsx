import React from "react";
import { View, Animated } from "react-native";
import { useAnimatedTeacherColors } from "../../../theme/useTeacherColors";
import { styles } from "../teacherStyles";
import {
  IconUser,
  IconStar,
  IconFlame,
  IconTrend,
} from "../../../components/icons";
import type { TeacherStats } from "../teacher.types";

interface TeacherStatsBarProps {
  stats: TeacherStats;
  isDark?: boolean;
}

export function TeacherStatsBar({ stats, isDark }: TeacherStatsBarProps) {
  const aColors = useAnimatedTeacherColors(isDark);

  const cards = [
    {
      label: "Alunos",
      value: stats.totalStudents,
      icon: <IconUser color="#22c55e" size={20} />,
      iconBg: "rgba(34, 197, 94, 0.15)",
    },
    {
      label: "Média pts",
      value: stats.averagePoints.toLocaleString("pt-BR"),
      icon: <IconStar color="#3b82f6" size={20} />,
      iconBg: "rgba(59, 130, 246, 0.15)",
    },
    {
      label: "Streaks",
      value: stats.activeStreaks,
      icon: <IconFlame outer="#f97316" innerStart="#fdba74" innerEnd="#ea580c" size={20} />,
      iconBg: "rgba(249, 115, 22, 0.15)",
    },
    {
      label: "Total pts",
      value: stats.totalPoints.toLocaleString("pt-BR"),
      icon: <IconTrend color="#8b5cf6" size={20} />,
      iconBg: "rgba(139, 92, 246, 0.15)",
    },
  ];

  return (
    <View style={styles.statsBarContainer}>
      <View style={styles.statsGrid}>
        {cards.map((card, index) => (
          <Animated.View
            key={index}
            style={[
              styles.statCard,
              {
                backgroundColor: aColors.cardBg,
                borderColor: aColors.dividerColor,
              },
            ]}
          >
            <View style={[styles.statIconWrap, { backgroundColor: card.iconBg, borderRadius: 999 }]}>
              {card.icon}
            </View>
            <View style={styles.statInfo}>
              <Animated.Text style={[styles.statValue, { color: aColors.textColor }]} numberOfLines={1}>
                {card.value}
              </Animated.Text>
              <Animated.Text style={[styles.statLabel, { color: aColors.subTextColor }]} numberOfLines={1}>
                {card.label}
              </Animated.Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
