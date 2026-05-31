import React from "react";
import { View, Text, Animated, TouchableOpacity, Image } from "react-native";
import { useAnimatedTeacherColors } from "../../../theme/useTeacherColors";
import { styles } from "../teacherStyles";
import { IconFlame } from "../../../components/icons";
import { getStreakColors } from "../../../theme/streakColors";
import type { RankingEntry } from "../../../services/rankingService";

interface StudentRankCardProps {
  entry: RankingEntry;
  showTurma: boolean;
  onPress?: () => void;
  isDark?: boolean;
}

function Avatar({
  name,
  avatarUrl,
  size,
  bg,
}: {
  name: string;
  avatarUrl: string | null;
  size: number;
  bg: string;
}) {
  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: size * 0.38, fontWeight: "900", color: "#fff" }}>
        {name[0].toUpperCase()}
      </Text>
    </View>
  );
}

export function StudentRankCard({ entry, showTurma, onPress, isDark }: StudentRankCardProps) {
  const aColors = useAnimatedTeacherColors(isDark);
  const fc = getStreakColors(entry.streak);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: entry.isMe ? aColors.meBg : aColors.cardBg,
            borderWidth: entry.isMe ? 1.5 : 0,
            borderColor: entry.isMe ? aColors.meBorder : "transparent",
          },
        ]}
      >
        <Animated.Text style={[styles.position, { color: aColors.subTextColor }]}>
          {entry.position}
        </Animated.Text>
        <Avatar name={entry.name} avatarUrl={entry.avatarUrl} size={44} bg={fc.outer} />
        <View style={styles.info}>
          <Animated.Text style={[styles.name, { color: aColors.textColor }]} numberOfLines={1}>
            {entry.name.split(" ").slice(0, 2).join(" ")}
          </Animated.Text>
          <View style={styles.streakRow}>
            <IconFlame
              outer={fc.outer}
              innerStart={fc.innerStart}
              innerEnd={fc.innerEnd}
              size={12}
            />
            <Animated.Text style={[styles.streakText, { color: aColors.subTextColor }]}>
              {entry.streak} {entry.streak === 1 ? "dia" : "dias"}
            </Animated.Text>
            {showTurma && entry.turma && (
              <>
                <Animated.Text style={[styles.streakText, { color: aColors.dividerColor }]}>·</Animated.Text>
                <Animated.Text style={[styles.streakText, { color: aColors.subTextColor }]}>
                  Turma {entry.turma}
                </Animated.Text>
              </>
            )}
          </View>
        </View>
        <View style={styles.pointsCol}>
          <Animated.Text style={[styles.points, { color: aColors.textColor }]}>
            {entry.points}
          </Animated.Text>
          <Animated.Text style={[styles.pointsLabel, { color: aColors.subTextColor }]}>
            pts
          </Animated.Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
