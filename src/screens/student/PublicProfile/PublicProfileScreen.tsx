import { useEffect, useRef, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Animated, StatusBar, Image,
} from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigation, useRoute } from "@react-navigation/native";

import { fetchPublicProfile } from "../../../services/profileService";
import { useProfileColors }   from "../../../theme/useProfileColors";
import { getStreakColors }    from "../../../theme/streakColors";
import { styles }             from "./profileStyles";
import {
  IconTrophy, IconTrend, IconRecycle, IconFlame,
} from "../../../components/icons";

const GREEN  = "#22c55e";
const ORANGE = "#f97316";
const BLUE   = "#3b82f6";

const CATEGORY_LABEL: Record<string, string> = {
  plastico: "Plástico", papel: "Papel",
  metal: "Metal", organico: "Orgânico", vidro: "Vidro",
};

const CATEGORY_COLOR: Record<string, string> = {
  plastico: "#ef4444", papel: "#3b82f6",
  metal: "#eab308", organico: "#92400e", vidro: GREEN,
};

type TimeFilter = "hoje" | "3dias" | "semana";

const FILTERS: { key: TimeFilter; label: string }[] = [
  { key: "hoje",   label: "Hoje" },
  { key: "3dias",  label: "3 dias" },
  { key: "semana", label: "Semana" },
];

const PREVIEW_COUNT = 4;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

const LEVELS = [
  { name: "Semente",             min: 0,    max: 50   },
  { name: "Broto",               min: 50,   max: 150  },
  { name: "Coletor Verde",       min: 150,  max: 300  },
  { name: "Guardião Verde",      min: 300,  max: 500  },
  { name: "Herói da Reciclagem", min: 500,  max: 1000 },
  { name: "Salvador do Planeta", min: 1000, max: null },
];

function getLevelInfo(points: number) {
  const current   = [...LEVELS].reverse().find((l) => points >= l.min)!;
  const nextIndex = LEVELS.indexOf(current) + 1;
  const next      = LEVELS[nextIndex] ?? null;
  const progress  = next ? (points - current.min) / (next.min - current.min) : 1;
  return {
    currentName:   current.name,
    nextName:      next?.name ?? null,
    pointsInLevel: points - current.min,
    pointsToNext:  next ? next.min - current.min : null,
    progress,
    isMax:         next === null,
  };
}

function isWithinDays(iso: string, days: number): boolean {
  return Date.now() - new Date(iso).getTime() <= days * 86_400_000;
}

function filterScans(scans: any[], filter: TimeFilter): any[] {
  if (filter === "hoje")  return scans.filter((s) => isWithinDays(s.createdAt, 1));
  if (filter === "3dias") return scans.filter((s) => isWithinDays(s.createdAt, 3));
  return scans.filter((s) => isWithinDays(s.createdAt, 7));
}

function useChipAnims(activeKey: TimeFilter, colors: any) {
  const anims = useRef<Record<TimeFilter, Animated.Value>>({
    hoje:    new Animated.Value(0),
    "3dias": new Animated.Value(0),
    semana:  new Animated.Value(1),
  }).current;

  useEffect(() => {
    Animated.parallel(
      FILTERS.map((f) =>
        Animated.timing(anims[f.key], {
          toValue: activeKey === f.key ? 1 : 0,
          duration: 200,
          useNativeDriver: false,
        })
      )
    ).start();
  }, [activeKey]);

  return anims;
}

function useListAnim(filterKey: TimeFilter) {
  const opacity    = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const isFirst    = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 0, duration: 110, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -6, duration: 110, useNativeDriver: true }),
    ]).start(() => {
      translateY.setValue(6);
      Animated.parallel([
        Animated.timing(opacity,    { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 160, useNativeDriver: true }),
      ]).start();
    });
  }, [filterKey]);

  return { opacity, translateY };
}

export function PublicProfileScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const colors     = useProfileColors();
  const { userId } = route.params as { userId: string };

  const [profileUser,  setProfileUser]  = useState<any>(null);
  const [totalPoints,  setTotalPoints]  = useState(0);
  const [totalScans,   setTotalScans]   = useState(0);
  const [scans,        setScans]        = useState<any[]>([]);
  const [schoolRank,   setSchoolRank]   = useState<number | null>(null);
  const [turmaRank,    setTurmaRank]    = useState<number | null>(null);
  const [streak,       setStreak]       = useState(0);
  const [expanded,     setExpanded]     = useState(false);
  const [timeFilter,   setTimeFilter]   = useState<TimeFilter>("semana");

  const headerAnim  = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardAnim    = useRef(new Animated.Value(40)).current;
  const expandAnim  = useRef(new Animated.Value(1)).current;
  const xpAnim      = useRef(new Animated.Value(0)).current;

  const chipAnims = useChipAnims(timeFilter, colors);
  const listAnim  = useListAnim(timeFilter);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(GREEN);
    NavigationBar.setButtonStyleAsync("light");

    Animated.sequence([
      Animated.timing(headerAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(cardAnim,    { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();

    fetchPublicProfile(userId).then((data) => {
      setProfileUser(data.user);
      setTotalPoints(data.totalPoints);
      setTotalScans(data.totalScans);
      setScans(data.scans);
      setSchoolRank(data.schoolRank);
      setTurmaRank(data.turmaRank);
      setStreak(data.streak);
    });
  }, []);

  useEffect(() => {
    const info = getLevelInfo(totalPoints);
    xpAnim.setValue(0);
    Animated.timing(xpAnim, {
      toValue: info.progress, duration: 800, useNativeDriver: false,
    }).start();
  }, [totalPoints]);

  useEffect(() => { setExpanded(false); }, [timeFilter]);

  function handleExpand() {
    Animated.sequence([
      Animated.timing(expandAnim, { toValue: 0, duration: 90,  useNativeDriver: true }),
      Animated.timing(expandAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
    ]).start(() => setExpanded((prev) => !prev));
  }

  const levelInfo     = getLevelInfo(totalPoints);
  const flameColors   = getStreakColors(streak);
  const initial       = (profileUser?.name?.split(" ")[0] ?? "A")[0].toUpperCase();
  const filteredScans = filterScans(scans, timeFilter);
  const visibleScans  = expanded ? filteredScans : filteredScans.slice(0, PREVIEW_COUNT);
  const hasMore       = filteredScans.length > PREVIEW_COUNT;

  const xpWidth = xpAnim.interpolate({
    inputRange: [0, 1], outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 90 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, { backgroundColor: GREEN, opacity: headerAnim }]}>
          {/* botão voltar */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={{ position: "absolute", top: 56, left: 20 }}
          >
            <Text style={{ color: "#fff", fontSize: 28, lineHeight: 32 }}>←</Text>
          </TouchableOpacity>

          {/* avatar — sem picker */}
          <View style={{
            width: 96, height: 96, borderRadius: 48,
            borderWidth: 3, borderColor: colors.dividerColor,
            alignItems: "center", justifyContent: "center", marginBottom: 12,
          }}>
            <View style={[styles.avatarWrap, { backgroundColor: ORANGE }]}>
              {profileUser?.avatarUrl
                ? <Image source={{ uri: profileUser.avatarUrl }} style={styles.avatarImg} />
                : <Text style={styles.avatarText}>{initial}</Text>
              }
            </View>
          </View>

          <Text style={styles.userName}>{profileUser?.name ?? "..."}</Text>
          <Text style={styles.userTurma}>{profileUser?.turma ?? ""} • Descarte Certo</Text>

          {/* streak badge */}
          <View style={[styles.levelBadge, { marginTop: 6 }]}>
            <IconFlame
              outer={flameColors.outer}
              innerStart={flameColors.innerStart}
              innerEnd={flameColors.innerEnd}
              size={14}
            />
            <Text style={styles.levelText}>{streakText(streak)}</Text>
          </View>

          <View style={styles.levelBadge}>
            <IconTrophy color="#fff" size={14} />
            <Text style={styles.levelText}>{levelInfo.currentName}</Text>
          </View>

          <View style={styles.xpBarWrap}>
            <View style={styles.xpBarBg}>
              <Animated.View style={[styles.xpBarFill, { width: xpWidth }]} />
            </View>
            {levelInfo.isMax ? (
              <Text style={styles.xpLabel}>Nível máximo!</Text>
            ) : (
              <Text style={styles.xpLabel}>
                {levelInfo.pointsInLevel}/{levelInfo.pointsToNext} → {levelInfo.nextName}
              </Text>
            )}
          </View>
        </Animated.View>

        <Animated.View style={[styles.statsRow, { opacity: cardOpacity, transform: [{ translateY: cardAnim }] }]}>
          <View style={[styles.statCard, { backgroundColor: ORANGE }]}>
            <IconTrend color="#fff" size={20} />
            <Text style={styles.statNumber}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Pontos totais</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: BLUE }]}>
            <IconRecycle color="#fff" size={20} />
            <Text style={styles.statNumber}>{totalScans}</Text>
            <Text style={styles.statLabel}>Itens escaneados</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: cardOpacity,
          transform: [{ translateY: cardAnim }],
        }]}>
          <Text style={[styles.cardTitle, { color: colors.textColor }]}>Posição no ranking</Text>
          <View style={styles.rankRow}>
            <View style={styles.rankItem}>
              <IconTrend color={ORANGE} size={20} />
              <Text style={[styles.rankNum, { color: ORANGE }]}>
                {turmaRank ? `#${turmaRank}` : "--"}
              </Text>
              <Text style={[styles.rankLabel, { color: colors.subTextColor }]}>Turma</Text>
            </View>
            <View style={[styles.divider, { width: 1, height: 50, backgroundColor: colors.dividerColor }]} />
            <View style={styles.rankItem}>
              <IconTrophy color={BLUE} size={20} />
              <Text style={[styles.rankNum, { color: BLUE }]}>
                {schoolRank ? `#${schoolRank}` : "--"}
              </Text>
              <Text style={[styles.rankLabel, { color: colors.subTextColor }]}>Escola</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: cardOpacity,
          transform: [{ translateY: cardAnim }],
        }]}>
          <Text style={[styles.cardTitle, { color: colors.textColor }]}>Últimos escaneamentos</Text>

          <View style={styles.filterRow}>
            {FILTERS.map((f) => {
              const anim        = chipAnims[f.key];
              const bgColor     = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.chipBg, GREEN] });
              const borderColor = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.dividerColor, GREEN] });
              const textColor   = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.subTextColor, "#ffffff"] });

              return (
                <TouchableOpacity key={f.key} onPress={() => setTimeFilter(f.key)} activeOpacity={0.8}>
                  <Animated.View style={[styles.filterChip, { backgroundColor: bgColor, borderColor, borderWidth: 1 }]}>
                    <Animated.Text style={[styles.filterChipText, { color: textColor }]}>
                      {f.label}
                    </Animated.Text>
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>

          {filteredScans.length === 0 ? (
            <Animated.Text style={[styles.scanDate, { color: colors.subTextColor, marginTop: 8 }, { opacity: listAnim.opacity }]}>
              Nenhum escaneamento neste período
            </Animated.Text>
          ) : (
            <Animated.View style={{ opacity: listAnim.opacity, transform: [{ translateY: listAnim.translateY }] }}>
              {visibleScans.map((scan, i) => (
                <View key={scan.id}>
                  <View style={styles.scanItem}>
                    <View style={[styles.scanIconWrap, { backgroundColor: CATEGORY_COLOR[scan.category] + "22" }]}>
                      <IconRecycle color={CATEGORY_COLOR[scan.category]} size={18} />
                    </View>
                    <View>
                      <Text style={[styles.scanCategory, { color: colors.textColor }]}>
                        {CATEGORY_LABEL[scan.category] ?? scan.category}
                      </Text>
                      <Text style={[styles.scanDate, { color: colors.subTextColor }]}>
                        {formatDate(scan.createdAt)}
                      </Text>
                    </View>
                    <Text style={[styles.scanPoints, { color: GREEN }]}>+{scan.points}</Text>
                  </View>
                  {i < visibleScans.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />
                  )}
                </View>
              ))}

              {hasMore && (
                <TouchableOpacity onPress={handleExpand} activeOpacity={0.7} style={styles.expandBtn}>
                  <Animated.Text style={[styles.expandBtnText, { color: GREEN, opacity: expandAnim }]}>
                    {expanded ? "Mostrar menos" : `Mostrar tudo (${filteredScans.length})`}
                  </Animated.Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function streakText(streak: number): string {
  if (streak === 0) return "Sem sequência";
  if (streak === 1) return "1 dia seguido";
  return `${streak} dias seguidos`;
}
