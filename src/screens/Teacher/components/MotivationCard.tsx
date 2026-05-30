import React from "react";
import { View, Text } from "react-native";
import { useTeacherColors } from "../../../theme/useTeacherColors";
import { styles } from "../teacherStyles";
import type { MotivationData } from "../teacher.types";

interface MotivationCardProps {
  data: MotivationData;
}

export function MotivationCard({ data }: MotivationCardProps) {
  const colors = useTeacherColors();

  return (
    <View style={styles.motivationContainer}>
      <View
        style={[
          styles.motivationCard,
          {
            backgroundColor: colors.motivationBg,
            borderColor: colors.motivationBorder,
          },
        ]}
      >
        <View style={styles.motivationEmojiWrap}>
          <Text style={styles.motivationEmoji}>{data.emoji}</Text>
        </View>
        <View style={styles.motivationContent}>
          <Text style={[styles.motivationTitle, { color: colors.textColor }]}>
            {data.title}
          </Text>
          <Text style={[styles.motivationText, { color: colors.subTextColor }]}>
            {data.message}
          </Text>
        </View>
      </View>
    </View>
  );
}
