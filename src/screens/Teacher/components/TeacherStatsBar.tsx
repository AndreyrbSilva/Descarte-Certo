import React from "react";
import { View, Text } from "react-native";
import { useTeacherColors } from "../../../theme/useTeacherColors";
import { styles } from "../teacherStyles";
import {
  IconUser,
  IconLightning,
  IconFlame,
  IconTrophy,
} from "../../../components/icons";
import type { TeacherStats } from "../teacher.types";

interface TeacherStatsBarProps {
  stats: TeacherStats;
}

export function TeacherStatsBar({ stats }: TeacherStatsBarProps) {
  const colors = useTeacherColors();

  const cards = [
    {
      label: "Alunos",
      value: stats.totalStudents,
      icon: <IconUser color={colors.textColor} size={20} />,
      bg: colors.statTealBg,
      border: colors.dividerColor,
    },
    {
      label: "Média de Pts",
      value: stats.averagePoints,
      icon: <IconLightning color={colors.textColor} />,
      bg: colors.statCyanBg,
      border: colors.dividerColor,
    },
    {
      label: "Com Streak",
      value: stats.activeStreaks,
      icon: <IconFlame color={colors.textColor} size={20} />,
      bg: colors.statEmeraldBg,
      border: colors.dividerColor,
    },
    {
      label: "Total da Turma",
      value: stats.totalPoints,
      icon: <IconTrophy color={colors.textColor} size={20} />,
      bg: colors.statAmberBg,
      border: colors.dividerColor,
    },
  ];

  return (
    <View style={styles.statsBarContainer}>
      <View style={styles.statsGrid}>
        {cards.map((card, index) => (
          <View
            key={index}
            style={[
              styles.statCard,
              {
                backgroundColor: card.bg,
                borderColor: colors.dividerColor,
              },
            ]}
          >
            <View style={[styles.statIconWrap, { backgroundColor: "rgba(255, 255, 255, 0.25)" }]}>
              {card.icon}
            </View>
            <View style={styles.statInfo}>
              <Text style={[styles.statValue, { color: colors.textColor }]} numberOfLines={1}>
                {card.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subTextColor }]} numberOfLines={1}>
                {card.label}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
