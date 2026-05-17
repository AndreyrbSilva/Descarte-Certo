import { useEffect, useRef, useState, useCallback } from "react";
import {
  View, Text, Animated,
  StatusBar, TouchableOpacity, Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/ThemeContext";

import { useRankingColors }                              from "../../../theme/useRankingColors";
import { fetchTurmaRanking, fetchEscolaRanking, RankingEntry } from "../../../services/rankingService";
import { getStreakColors }                               from "../../../theme/streakColors";
import { IconFlame, IconCrown, IconMedal }               from "../../../components/icons";
import { styles }                                        from "./rankingStyles";

const GREEN = "#22c55e";

type Tab = "turma" | "escola";

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
        <View style={{ height: 48 }} /> // Altura aproximada do texto pra alinhar o pódio
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
  const navigation = useNavigation<any>();
  const colors     = useRankingColors();
  const { isDark: dark } = useTheme();

  const [tab,        setTab]        = useState<Tab>("turma");
  const [turmaData,  setTurmaData]  = useState<RankingEntry[]>([]);
  const [escolaData, setEscolaData] = useState<RankingEntry[]>([]);
  const [turmaLabel, setTurmaLabel] = useState("");
  const [loading,    setLoading]    = useState(true);

  const tabAnim     = useRef(new Animated.Value(0)).current;
  const listOpacity = useRef(new Animated.Value(1)).current;

  const cardAnims = useRef(
    Array.from({ length: 15 }, () => ({
      opacity: new Animated.Value(0),
      y:       new Animated.Value(20),
    }))
  ).current;

  useFocusEffect(
    useCallback(() => {
      NavigationBar.setBackgroundColorAsync(colors.bg);
      NavigationBar.setButtonStyleAsync("dark");
      setLoading(true);

      Promise.all([fetchTurmaRanking(), fetchEscolaRanking()]).then(([t, e]) => {
        setTurmaData(t.ranking);
        setTurmaLabel(t.turma ?? "");
        setEscolaData(e.ranking);
        setLoading(false);
        animateCards(t.ranking.length);
      });
    }, [])
  );

  function animateCards(count: number) {
    cardAnims.slice(0, count).forEach((a, i) => {
      Animated.parallel([
        Animated.timing(a.opacity, { toValue: 1, duration: 300, delay: i * 50, useNativeDriver: true }),
        Animated.timing(a.y,       { toValue: 0, duration: 300, delay: i * 50, useNativeDriver: true }),
      ]).start();
    });
  }

  function switchTab(next: Tab) {
    if (next === tab) return;

    Animated.timing(listOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      cardAnims.forEach((a) => { a.opacity.setValue(0); a.y.setValue(20); });
      setTab(next);
      const count = next === "turma" ? turmaData.length : escolaData.length;
      Animated.timing(listOpacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      animateCards(count);
    });

    Animated.spring(tabAnim, {
      toValue: next === "turma" ? 0 : 1,
      useNativeDriver: false,
      tension: 80, friction: 10,
    }).start();
  }

  const data         = tab === "turma" ? turmaData : escolaData;
  const top3         = data.slice(0, 3);
  const rest         = data.slice(3);
  const podiumOrder  = [
    { position: 2 as const, entry: top3[1] ?? null, height: 60 },
    { position: 1 as const, entry: top3[0] ?? null, height: 80 },
    { position: 3 as const, entry: top3[2] ?? null, height: 48 },
  ];

  const tabIndicatorLeft = tabAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ["0%", "50%"],
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textColor }]}>Ranking</Text>
          <Text style={[styles.headerSub, { color: colors.subTextColor }]}>
            {tab === "turma" ? `Turma ${turmaLabel}` : "Escola inteira"}
          </Text>
        </View>

        {/* TAB SWITCHER */}
        <View style={[styles.tabRow, { backgroundColor: colors.tabBg }]}>
          <Animated.View style={{
            position:        "absolute",
            left:            tabIndicatorLeft,
            width:           "50%",
            top: 4, bottom:  4,
            borderRadius:    11,
            backgroundColor: GREEN,
          }} />
          {(["turma", "escola"] as Tab[]).map((t) => (
            <TouchableOpacity key={t} style={styles.tabBtn} onPress={() => switchTab(t)} activeOpacity={0.7}>
              <Text style={[styles.tabText, { color: tab === t ? "#fff" : colors.tabInactive }]}>
                {t === "turma" ? "Minha turma" : "Escola"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyText, { color: colors.subTextColor }]}>Carregando...</Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: listOpacity }}>

            {data.length === 0 && (
              <View style={{ alignItems: "center", paddingHorizontal: 20, marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: colors.textColor, marginBottom: 4 }}>
                  Pódio vazio! 🏃‍♂️
                </Text>
                <Text style={{ fontSize: 13, color: colors.subTextColor, textAlign: "center" }}>
                  Dê a largada e conquiste o 1º lugar fazendo o seu primeiro escaneamento.
                </Text>
              </View>
            )}

            {/* PÓDIO SEMPRE VISÍVEL */}
            <View style={styles.podium}>
              {podiumOrder.map((item) => (
                <PodiumItem
                  key={item.position}
                  entry={item.entry}
                  position={item.position}
                  colors={colors}
                  height={item.height}
                  showTurma={tab === "escola"}
                  onPress={item.entry ? () => navigation.navigate("PublicProfile", { userId: item.entry!.userId }) : undefined}
                />
              ))}
            </View>

            {/* LISTA */}
            <View style={styles.listWrap}>
              {rest.map((entry, i) => {
                const anim = cardAnims[i + 3] ?? cardAnims[0];
                const fc   = getStreakColors(entry.streak);
                return (
                  <Animated.View
                    key={entry.userId}
                    style={{ opacity: anim.opacity, transform: [{ translateY: anim.y }] }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => navigation.navigate("PublicProfile", { userId: entry.userId })}
                    >
                      <View style={[
                        styles.card,
                        {
                          backgroundColor: entry.isMe ? (dark ? "#162418" : "#dcfce7") : colors.cardBg,
                          borderWidth:     entry.isMe ? 1.5 : 0,
                          borderColor:     entry.isMe ? GREEN : "transparent",
                        },
                      ]}>
                        <Text style={[styles.position, { color: colors.subTextColor }]}>
                          {entry.position}
                        </Text>
                        <Avatar name={entry.name} avatarUrl={entry.avatarUrl} size={44} bg={GREEN} />
                        <View style={styles.info}>
                          <Text style={[styles.name, { color: colors.textColor }]} numberOfLines={1}>
                            {entry.name.split(" ").slice(0, 2).join(" ")}
                          </Text>
                          <View style={styles.streakRow}>
                            <IconFlame outer={fc.outer} innerStart={fc.innerStart} innerEnd={fc.innerEnd} size={12} />
                            <Text style={[styles.streakText, { color: colors.subTextColor }]}>
                              {entry.streak} {entry.streak === 1 ? "dia" : "dias"}
                            </Text>
                            {tab === "escola" && entry.turma && (
                              <>
                                <Text style={[styles.streakText, { color: colors.dividerColor }]}>·</Text>
                                <Text style={[styles.streakText, { color: colors.subTextColor }]}>
                                  Turma {entry.turma}
                                </Text>
                              </>
                            )}
                          </View>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <Text style={[styles.points, { color: entry.isMe ? GREEN : colors.textColor }]}>
                            {entry.points}
                          </Text>
                          <Text style={[styles.pointsLabel, { color: colors.subTextColor }]}>pts</Text>
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
