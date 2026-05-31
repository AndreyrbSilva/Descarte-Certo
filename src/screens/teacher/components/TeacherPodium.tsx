import React from "react";
import { View, Animated, TouchableOpacity, Image } from "react-native";
import { useAnimatedTeacherColors } from "../../../theme/useTeacherColors";
import { styles } from "../teacherStyles";
import { IconCrown, IconMedal, IconFlame } from "../../../components/icons";
import { getStreakColors } from "../../../theme/streakColors";
import type { PodiumSlot } from "../teacher.types";

interface TeacherPodiumProps {
  slots: PodiumSlot[];
  showTurma: boolean;
  onPressItem?: (userId: string) => void;
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
      <Animated.Text style={{ fontSize: size * 0.38, fontWeight: "900", color: "#fff" }}>
        {name[0].toUpperCase()}
      </Animated.Text>
    </View>
  );
}

export function TeacherPodium({ slots, showTurma, onPressItem, isDark }: TeacherPodiumProps) {
  const aColors = useAnimatedTeacherColors(isDark);

  return (
    <View style={styles.podium}>
      {slots.map((slot) => {
        const { entry, position, height } = slot;
        const fc = entry ? getStreakColors(entry.streak) : null;
        const bg =
          position === 1
            ? aColors.gold
            : position === 2
            ? aColors.silver
            : aColors.bronze;

        return (
          <View key={position} style={styles.podiumItem}>
            {/* Crown only for 1st place */}
            {position === 1 && (
              <View style={{ opacity: entry ? 1 : 0.4, marginBottom: 2 }}>
                <IconCrown size={30} />
              </View>
            )}

            {entry ? (
              <TouchableOpacity
                onPress={() => onPressItem?.(entry.userId)}
                activeOpacity={0.8}
                style={{ alignItems: "center" }}
              >
                <View
                  style={[
                    styles.podiumAvatar,
                    {
                      width: 62,
                      height: 62,
                      borderRadius: 31,
                      borderWidth: 3,
                      borderColor: entry.isMe ? aColors.meBorder : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 4,
                    },
                  ]}
                >
                  <Avatar
                    name={entry.name}
                    avatarUrl={entry.avatarUrl}
                    size={52}
                    bg={bg}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  styles.podiumAvatar,
                  {
                    backgroundColor: aColors.iconBg,
                    borderWidth: 2,
                    borderColor: aColors.dividerColor,
                    borderStyle: "dashed",
                    marginBottom: 4,
                  },
                ]}
              />
            )}

            {entry ? (
              <View style={{ alignItems: "center", marginBottom: 8, gap: 2 }}>
                <Animated.Text
                  style={[styles.podiumName, { color: aColors.textColor }]}
                  numberOfLines={1}
                >
                  {entry.name.split(" ")[0]}
                  {showTurma && entry.turma ? ` · T${entry.turma}` : ""}
                </Animated.Text>
                <Animated.Text style={[styles.podiumPoints, { color: aColors.subTextColor }]}>
                  {entry.points} pts
                </Animated.Text>
                <View style={styles.podiumStreakRow}>
                  <IconFlame
                    outer={fc!.outer}
                    innerStart={fc!.innerStart}
                    innerEnd={fc!.innerEnd}
                    size={12}
                  />
                  <Animated.Text style={[styles.podiumStreakText, { color: aColors.subTextColor }]}>
                    {entry.streak}d
                  </Animated.Text>
                </View>
              </View>
            ) : (
              <View style={{ height: 48 }} />
            )}

            {/* Solid Podium Column Block */}
            <View
              style={[
                styles.podiumBase,
                {
                  height: height + 20,
                  backgroundColor: bg,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                },
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
