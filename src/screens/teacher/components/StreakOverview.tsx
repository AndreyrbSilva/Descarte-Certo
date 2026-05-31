import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useTeacherColors } from "../../../theme/useTeacherColors";
import { styles } from "../teacherStyles";
import { IconFlame } from "../../../components/icons";
import { getStreakColors } from "../../../theme/streakColors";
import type { StreakChip } from "../teacher.types";

interface StreakOverviewProps {
  chips: StreakChip[];
}

export function StreakOverview({ chips }: StreakOverviewProps) {
  const colors = useTeacherColors();

  if (chips.length === 0) return null;

  return (
    <View style={styles.streakContainer}>
      <View style={styles.streakHeader}>
        <Text style={[styles.streakSectionTitle, { color: colors.textColor }]}>
          Alunos Ativos (Streak)
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.streakScroll}
      >
        {chips.map((chip) => {
          const fc = getStreakColors(chip.streak);
          return (
            <View
              key={chip.userId}
              style={[
                styles.streakChip,
                {
                  backgroundColor: colors.chipBg,
                  borderColor: colors.chipBorder,
                },
              ]}
            >
              <View style={[styles.streakChipAvatar, { backgroundColor: fc.outer }]}>
                <Text style={styles.streakChipAvatarText}>
                  {chip.name[0].toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.streakChipName, { color: colors.chipText }]}>
                {chip.name.split(" ")[0]}
              </Text>
              <IconFlame
                outer={fc.outer}
                innerStart={fc.innerStart}
                innerEnd={fc.innerEnd}
                size={14}
              />
              <Text style={[styles.streakChipDays, { color: colors.chipText }]}>
                {chip.streak}d
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
