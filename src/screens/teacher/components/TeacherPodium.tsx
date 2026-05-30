import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useTeacherColors } from "../../../theme/useTeacherColors";
import { styles } from "../teacherStyles";
import { IconCrown, IconMedal, IconFlame } from "../../../components/icons";
import { getStreakColors } from "../../../theme/streakColors";
import type { PodiumSlot } from "../teacher.types";

interface TeacherPodiumProps {
  slots: PodiumSlot[];
  showTurma: boolean;
  onPressItem?: (userId: string) => void;
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

export function TeacherPodium({ slots, showTurma, onPressItem }: TeacherPodiumProps) {
  const colors = useTeacherColors();

  return (
    <View style={styles.podium}>
      {slots.map((slot) => {
        const { entry, position, height } = slot;
        const fc = entry ? getStreakColors(entry.streak) : null;
        const bg =
          position === 1
            ? colors.gold
            : position === 2
            ? colors.silver
            : colors.bronze;

        return (
          <View key={position} style={styles.podiumItem}>
            {position === 1 && (
              <View style={{ opacity: entry ? 1 : 0.4, marginBottom: -2 }}>
                <IconCrown size={30} />
              </View>
            )}

            {entry ? (
              <TouchableOpacity
                onPress={() => onPressItem?.(entry.userId)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.podiumAvatar,
                    {
                      width: 62,
                      height: 62,
                      borderRadius: 31,
                      borderWidth: 3,
                      borderColor: entry.isMe ? colors.meBorder : "transparent",
                    },
                  ]}
                >
                  <Avatar
                    name={entry.name}
                    avatarUrl={entry.avatarUrl}
                    size={50}
                    bg={bg}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  styles.podiumAvatar,
                  {
                    backgroundColor: colors.iconBg,
                    borderWidth: 2,
                    borderColor: colors.dividerColor,
                    borderStyle: "dashed",
                  },
                ]}
              />
            )}

            {entry ? (
              <>
                <Text
                  style={[styles.podiumName, { color: colors.textColor }]}
                  numberOfLines={1}
                >
                  {entry.name.split(" ")[0]}
                  {showTurma && entry.turma ? ` · T${entry.turma}` : ""}
                </Text>
                <Text style={[styles.podiumPoints, { color: colors.subTextColor }]}>
                  {entry.points} pts
                </Text>
                <View style={styles.podiumStreakRow}>
                  <IconFlame
                    outer={fc!.outer}
                    innerStart={fc!.innerStart}
                    innerEnd={fc!.innerEnd}
                    size={12}
                  />
                  <Text style={[styles.podiumStreakText, { color: colors.subTextColor }]}>
                    {entry.streak}d
                  </Text>
                </View>
              </>
            ) : (
              <View style={{ height: 48 }} />
            )}

            <View
              style={[
                styles.podiumBase,
                { height, backgroundColor: bg + (entry ? "cc" : "44") },
              ]}
            >
              <View style={{ opacity: entry ? 1 : 0.5 }}>
                <IconMedal
                  type={
                    position === 1
                      ? "gold"
                      : position === 2
                      ? "silver"
                      : "bronze"
                  }
                  size={32}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
