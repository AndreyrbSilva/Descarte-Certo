import { useEffect, useRef, useState, useCallback } from "react";
import {
  View, Text, ScrollView, Animated,
  StatusBar, TouchableOpacity, Image,
} from "react-native";
import * as NavigationBar from "expo-navigation-bar";

import { useRankingColors }                    from "../../hooks/useRankingColors";
import { fetchTurmaRanking, fetchEscolaRanking, RankingEntry } from "../../services/rankingService";
import { getStreakColors }                     from "../../hooks/streakColors";
import { IconFlame, IconCrown, IconMedal } from "../../components/icons";
import { styles }                              from "./rankingStyles";
import { useFocusEffect } from "@react-navigation/native";

const GREEN = "#22c55e";

type Tab = "turma" | "escola";

function Avatar({ name, avatarUrl, size, bg }: {
  name: string; avatarUrl: string | null; size: number; bg: string;
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
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: bg, alignItems: "center", justifyContent: "center",
    }}>
      <Text style={{ fontSize: size * 0.38, fontWeight: "900", color: "#fff" }}>
        {name[0].toUpperCase()}
      </Text>
    </View>
  );
}

function PodiumItem({ entry, height, colors, showTurma }: {
  entry: RankingEntry; height: number; colors: any; showTurma?: boolean;
}) {
  const fc = getStreakColors(entry.streak);
  const bg = entry.position === 1
    ? colors.gold
    : entry.position === 2
    ? colors.silver
    : colors.bronze;

  return (
    <View style={styles.podiumItem}>
      {entry.position === 1 && <IconCrown size={30} />}
      <View style={[
        styles.podiumAvatar,
        entry.isMe && { borderWidth: 3, borderColor: GREEN },
      ]}>
        <Avatar name={entry.name} avatarUrl={entry.avatarUrl} size={56} bg={bg} />
      </View>
      <Text style={[styles.podiumName, { color: colors.textColor }]} numberOfLines={1}>
        {entry.name.split(" ")[0]}{showTurma && entry.turma ? ` · T${entry.turma}` : ""}
      </Text>

      <Text style={[styles.podiumPoints, { color: colors.subTextColor }]}>
        {entry.points} pts
      </Text>
      
      <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
        <IconFlame outer={fc.outer} innerStart={fc.innerStart} innerEnd={fc.innerEnd} size={12} />
        <Text style={[styles.streakText, { color: colors.subTextColor }]}>{entry.streak}d</Text>
      </View>
      
      <View style={[styles.podiumBase, { height, backgroundColor: bg + "cc" }]}>
        <IconMedal
          type={entry.position === 1 ? "gold" : entry.position === 2 ? "silver" : "bronze"}
          size={32}
        />
      </View>
    </View>
  );
}

export function RankingScreen() {
  const colors = useRankingColors();
  const [tab,          setTab]          = useState<Tab>("turma");
  const [turmaData,    setTurmaData]    = useState<RankingEntry[]>([]);
  const [escolaData,   setEscolaData]   = useState<RankingEntry[]>([]);
  const [turmaLabel,   setTurmaLabel]   = useState("");
  const [loading,      setLoading]      = useState(true);

  const tabAnim     = useRef(new Animated.Value(0)).current;
  const listOpacity = useRef(new Animated.Value(1)).current;

  // entrada stagger dos cards
  const cardAnims = useRef(
    Array.from({ length: 20 }, () => ({
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
    const anims = cardAnims.slice(0, count).map((a, i) =>
      Animated.parallel([
        Animated.timing(a.opacity, { toValue: 1, duration: 300, delay: i * 50, useNativeDriver: true }),
        Animated.timing(a.y,       { toValue: 0, duration: 300, delay: i * 50, useNativeDriver: true }),
      ])
    );
    Animated.stagger(50, anims).start();
  }

  function switchTab(next: Tab) {
    if (next === tab) return;

    Animated.timing(listOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      // reseta animações dos cards
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

  const data    = tab === "turma" ? turmaData : escolaData;
  const top3    = data.slice(0, 3);
  const rest    = data.slice(3);

  // pódio: 2º esquerda, 1º centro, 3º direita
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  const tabIndicatorLeft = tabAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ["0%", "50%"],
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
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
            position:     "absolute",
            left:         tabIndicatorLeft,
            width:        "50%",
            top:          4, bottom: 4,
            borderRadius: 11,
            backgroundColor: GREEN,
          }} />
          {(["turma", "escola"] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={styles.tabBtn}
              onPress={() => switchTab(t)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText,
                { color: tab === t ? "#fff" : colors.tabInactive },
              ]}>
                {t === "turma" ? "Minha turma" : "Escola"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyText, { color: colors.subTextColor }]}>Carregando...</Text>
          </View>
        ) : data.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyText, { color: colors.textColor }]}>Nenhum dado ainda</Text>
            <Text style={[styles.emptySub,  { color: colors.subTextColor }]}>
              Faça seu primeiro scan para entrar no ranking!
            </Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: listOpacity }}>
            {/* PÓDIO */}
            {top3.length >= 2 && (
              <View style={styles.podium}>
                {podiumOrder.map((entry) => (
                  <PodiumItem
                    key={entry.userId}
                    entry={entry}
                    colors={colors}
                    height={entry.position === 1 ? 80 : entry.position === 2 ? 60 : 48}
                    showTurma={tab === "escola"}
                  />
                ))}
              </View>
            )}

            {/* LISTA — 4º em diante */}
            <View style={styles.listWrap}>
              {rest.map((entry, i) => {
                const anim = cardAnims[i + 3] ?? cardAnims[0];
                const fc   = getStreakColors(entry.streak);
                return (
                  <Animated.View
                    key={entry.userId}
                    style={{
                      opacity:   anim.opacity,
                      transform: [{ translateY: anim.y }],
                    }}
                  >
                    <View style={[
                      styles.card,
                      {
                        backgroundColor: entry.isMe
                          ? GREEN + "18"
                          : colors.cardBg,
                        borderWidth:  entry.isMe ? 1.5 : 0,
                        borderColor:  entry.isMe ? GREEN : "transparent",
                      },
                    ]}>
                      <Text style={[styles.position, { color: colors.subTextColor }]}>
                        {entry.position}
                      </Text>
                      <Avatar
                        name={entry.name}
                        avatarUrl={entry.avatarUrl}
                        size={44}
                        bg={GREEN}
                      />
                      <View style={styles.info}>
                        <Text style={[styles.name, { color: colors.textColor }]} numberOfLines={1}>
                          {entry.name.split(" ")[0]}
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
