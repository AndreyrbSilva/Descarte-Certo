import React from "react";
import { View, Animated } from "react-native";
import { useAnimatedTeacherColors } from "../../../theme/useTeacherColors";
import { styles } from "../teacherStyles";
import type { MotivationData } from "../teacher.types";

interface MotivationCardProps {
  data: MotivationData;
  isDark?: boolean;
}

export function MotivationCard({ data, isDark }: MotivationCardProps) {
  const aColors = useAnimatedTeacherColors(isDark);

  return (
    <View style={styles.motivationContainer}>
      <Animated.View
        style={[
          styles.motivationCard,
          {
            backgroundColor: aColors.motivationBg,
            borderColor: aColors.motivationBorder,
            borderStyle: "dashed",
            borderWidth: 1.5,
          },
        ]}
      >
        <View style={[styles.motivationEmojiWrap, { backgroundColor: "rgba(34, 197, 94, 0.15)" }]}>
          <Animated.Text style={styles.motivationEmoji}>{data.emoji}</Animated.Text>
        </View>
        <View style={styles.motivationContent}>
          <Animated.Text style={[styles.motivationTitle, { color: aColors.textColor }]}>
            {data.title}
          </Animated.Text>
          <Animated.Text style={[styles.motivationText, { color: aColors.subTextColor }]}>
            {data.message}
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
}
