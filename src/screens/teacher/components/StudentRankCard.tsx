import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useTeacherColors } from "../../../theme/useTeacherColors";
import { styles } from "../teacherStyles";
import { IconFlame } from "../../../components/icons";
import { getStreakColors } from "../../../theme/streakColors";
import type { RankingEntry } from "../../../services/rankingService";

interface StudentRankCardProps {
  entry: RankingEntry;
  showTurma: boolean;
  onPress?: () => void;
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

export function StudentRankCard({ entry, showTurma, onPress }: StudentRankCardProps) {
  const colors = useTeacherColors();
  const fc = getStreakColors(entry.streak);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: entry.isMe ? colors.meBg : colors.cardBg,
            borderWidth: entry.isMe ? 1.5 : 0,
            borderColor: entry.isMe ? colors.meBorder : "transparent",
          },
        ]}
      >
        <Text style={[styles.position, { color: colors.subTextColor }]}>
          {entry.position}
        </Text>
        <Avatar name={entry.name} avatarUrl={entry.avatarUrl} size={44} bg={fc.outer} />
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.textColor }]} numberOfLines={1}>
            {entry.name.split(" ").slice(0, 2).join(" ")}
          </Text>
          <View style={styles.streakRow}>
            <IconFlame
              outer={fc.outer}
              innerStart={fc.innerStart}
              innerEnd={fc.innerEnd}
              size={12}
            />
            <Text style={[styles.streakText, { color: colors.subTextColor }]}>
              {entry.streak} {entry.streak === 1 ? "dia" : "dias"}
            </Text>
            {showTurma && entry.turma && (
              <>
                <Text style={[styles.streakText, { color: colors.dividerColor }]}>·</Text>
                <Text style={[styles.streakText, { color: colors.subTextColor }]}>
                  Turma {entry.turma}
                </Text>
              </>
            )}
          </View>
        </View>
        <View style={styles.pointsCol}>
          <Text style={[styles.points, { color: colors.textColor }]}>
            {entry.points}
          </Text>
          <Text style={[styles.pointsLabel, { color: colors.subTextColor }]}>
            pts
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
