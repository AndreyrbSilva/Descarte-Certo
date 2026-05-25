import {
  View, Text, Animated,
  StatusBar, TouchableOpacity, Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { RankingEntry } from "../../../services/rankingService";
import { getStreakColors }  from "../../../theme/streakColors";
import { IconFlame, IconCrown, IconMedal } from "../../../components/icons";
import { styles }           from "./rankingStyles";

import { useRankingData, Tab } from "./hooks/useRankingData";

const GREEN = "#22c55e";

function Avatar({ name, avatarUrl, size, bg }: {
  name: string; avatarUrl: string | null; size: number; bg: string;
}) {
  if (avatarUrl) {
    return <Image source={{ uri: avatarUrl }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: size * 0.38, fontWeight: "900", color: "#fff" }}>
        {name[0].toUpperCase()}
      </Text>
    </View>
  );
}

function PodiumItem({ entry, position, height, colors, showTurma, onPress }: {
  entry: RankingEntry | null; position: 1 | 2 | 3; height: number; colors: any; showTurma?: boolean; onPress?: () => void;
}) {
  const fc = entry ? getStreakColors(entry.streak) : null;
  const bg = position === 1 ? colors.gold : position === 2 ? colors.silver : colors.bronze;

  return (
    <View style={styles.podiumItem}>
      {position === 1 && (
        <View style={{ opacity: entry ? 1 : 0.4 }}>
          <IconCrown size={30} />
        </View>
      )}
      
      {entry ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          <View style={[
            styles.podiumAvatar, 
            { 
              width: 62, height: 62, borderRadius: 31,
              borderWidth: 3, borderColor: entry.isMe ? GREEN : "transparent" 
            }
          ]}>
            <Avatar name={entry.name} avatarUrl={entry.avatarUrl} size={50} bg={bg} />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={[styles.podiumAvatar, { 
          backgroundColor: colors.iconBg, 
          borderWidth: 2, 
          borderColor: colors.dividerColor, 
          borderStyle: "dashed" 
        }]} />
      )}

      {entry ? (
        <>
          <Text style={[styles.podiumName, { color: colors.textColor }]} numberOfLines={1}>
            {entry.name.split(" ")[0]}{showTurma && entry.turma ? ` · T${entry.turma}` : ""}
          </Text>
          <Text style={[styles.podiumPoints, { color: colors.subTextColor }]}>
            {entry.points} pts
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <IconFlame outer={fc!.outer} innerStart={fc!.innerStart} innerEnd={fc!.innerEnd} size={12} />
            <Text style={[styles.streakText, { color: colors.subTextColor }]}>{entry.streak}d</Text>
          </View>
        </>
      ) : (
        <View style={{ height: 48 }} />
      )}

      <View style={[styles.podiumBase, { height, backgroundColor: bg + (entry ? "cc" : "44") }]}>
        <View style={{ opacity: entry ? 1 : 0.5 }}>
          <IconMedal
            type={position === 1 ? "gold" : position === 2 ? "silver" : "bronze"}
            size={32}
          />
        </View>
      </View>
    </View>
  );
}

export function RankingScreen() {
  const d = useRankingData();

  return (
    <View style={[styles.root, { backgroundColor: d.colors.bg }]}>
      <StatusBar barStyle={d.colors.statusBar} backgroundColor={d.colors.bg} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: d.colors.textColor }]}>Ranking</Text>
          <Text style={[styles.headerSub, { color: d.colors.subTextColor }]}>
            {d.tab === "turma" ? `Turma ${d.turmaLabel}` : "Escola inteira"}
          </Text>
        </View>

        {/* TAB SWITCHER */}
        <View style={[styles.tabRow, { backgroundColor: d.colors.tabBg }]}>
          <Animated.View style={{
            position:        "absolute",
            left:            d.tabIndicatorLeft,
            width:           "50%",
            top: 4, bottom:  4,
            borderRadius:    11,
            backgroundColor: GREEN,
          }} />
          {(["turma", "escola"] as Tab[]).map((t) => (
            <TouchableOpacity key={t} style={styles.tabBtn} onPress={() => d.switchTab(t)} activeOpacity={0.7}>
              <Text style={[styles.tabText, { color: d.tab === t ? "#fff" : d.colors.tabInactive }]}>
                {t === "turma" ? "Minha turma" : "Escola"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {d.loading ? (
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyText, { color: d.colors.subTextColor }]}>Carregando...</Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: d.listOpacity }}>

            {d.data.length === 0 && (
              <View style={{ alignItems: "center", paddingHorizontal: 20, marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: d.colors.textColor, marginBottom: 4 }}>
                  Pódio vazio! 🏃‍♂️
                </Text>
                <Text style={{ fontSize: 13, color: d.colors.subTextColor, textAlign: "center" }}>
                  Dê a largada e conquiste o 1º lugar fazendo o seu primeiro escaneamento.
                </Text>
              </View>
            )}

            {/* PÓDIO */}
            <View style={styles.podium}>
              {d.podiumOrder.map((item) => (
                <PodiumItem
                  key={item.position}
                  entry={item.entry}
                  position={item.position}
                  colors={d.colors}
                  height={item.height}
                  showTurma={d.tab === "escola"}
                  onPress={item.entry ? () => d.navigation.navigate("PublicProfile", { userId: item.entry!.userId }) : undefined}
                />
              ))}
            </View>

            {/* LISTA */}
            <View style={styles.listWrap}>
              {d.rest.map((entry, i) => {
                const anim = d.cardAnims[i + 3] ?? d.cardAnims[0];
                const fc   = getStreakColors(entry.streak);
                return (
                  <Animated.View
                    key={entry.userId}
                    style={{ opacity: anim.opacity, transform: [{ translateY: anim.y }] }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => d.navigation.navigate("PublicProfile", { userId: entry.userId })}
                    >
                      <View style={[
                        styles.card,
                        {
                          backgroundColor: entry.isMe ? (d.dark ? "#162418" : "#dcfce7") : d.colors.cardBg,
                          borderWidth:     entry.isMe ? 1.5 : 0,
                          borderColor:     entry.isMe ? GREEN : "transparent",
                        },
                      ]}>
                        <Text style={[styles.position, { color: d.colors.subTextColor }]}>
                          {entry.position}
                        </Text>
                        <Avatar name={entry.name} avatarUrl={entry.avatarUrl} size={44} bg={GREEN} />
                        <View style={styles.info}>
                          <Text style={[styles.name, { color: d.colors.textColor }]} numberOfLines={1}>
                            {entry.name.split(" ").slice(0, 2).join(" ")}
                          </Text>
                          <View style={styles.streakRow}>
                            <IconFlame outer={fc.outer} innerStart={fc.innerStart} innerEnd={fc.innerEnd} size={12} />
                            <Text style={[styles.streakText, { color: d.colors.subTextColor }]}>
                              {entry.streak} {entry.streak === 1 ? "dia" : "dias"}
                            </Text>
                            {d.tab === "escola" && entry.turma && (
                              <>
                                <Text style={[styles.streakText, { color: d.colors.dividerColor }]}>·</Text>
                                <Text style={[styles.streakText, { color: d.colors.subTextColor }]}>
                                  Turma {entry.turma}
                                </Text>
                              </>
                            )}
                          </View>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <Text style={[styles.points, { color: entry.isMe ? GREEN : d.colors.textColor }]}>
                            {entry.points}
                          </Text>
                          <Text style={[styles.pointsLabel, { color: d.colors.subTextColor }]}>pts</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
