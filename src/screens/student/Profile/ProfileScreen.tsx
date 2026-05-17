import { useEffect, useRef, useState } from "react";
import {
  View, Text, TouchableOpacity,
  Animated, StatusBar, Image, Modal, ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import * as NavigationBar from "expo-navigation-bar";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

import { useAuthStore }     from "../../../store/useAuthStore";
import { logout }           from "../../../services/authService";
import { fetchProfile, uploadAvatar } from "../../../services/profileService";
import { useProfileColors } from "../../../theme/useProfileColors";
import { styles }           from "./profileStyles";
import {
  IconTrophy, IconTrend, IconRecycle, IconLogout, IconCamera,
  IconStar, IconCrown, IconMedal, IconFlame, IconTarget,
  IconShield, IconDiamond, IconRainbow, IconLightning, IconShieldCheck, IconCheck,
} from "../../../components/icons";
import { fetchAchievements, AchievementData } from "../../../services/achievementService";
import { getTypeColor } from "../../../theme/useTrophyColors";

const GREEN  = "#22c55e";
const ORANGE = "#f97316";
const BLUE   = "#3b82f6";

function ProfileTrophyIcon({ icon, color, size }: { icon: string; color: string; size: number }) {
  switch (icon) {
    case "star":       return <IconStar color={color} size={size} />;
    case "recycle":    return <IconRecycle color={color} size={size} />;
    case "medal":      return <IconMedal type="gold" size={size} />;
    case "trophy":     return <IconTrophy color={color} size={size} />;
    case "crown":      return <IconCrown color={color} size={size} />;
    case "flame":      return <IconFlame outer={color} innerStart={color} innerEnd={color} size={size} />;
    case "target":     return <IconTarget color={color} size={size} />;
    case "trend":      return <IconTrend color={color} size={size} />;
    case "shield":     return <IconShieldCheck color={color} size={size} />;
    case "diamond":    return <IconDiamond color={color} size={size} />;
    case "rainbow":    return <IconRainbow color={color} size={size} />;
    case "lightning":  return <IconLightning color={color} size={size} />;
    default:           return <IconTrophy color={color} size={size} />;
  }
}

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
  const current    = [...LEVELS].reverse().find((l) => points >= l.min)!;
  const nextIndex  = LEVELS.indexOf(current) + 1;
  const next       = LEVELS[nextIndex] ?? null;
  const progress   = next ? (points - current.min) / (next.min - current.min) : 1;

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
  const diff = Date.now() - new Date(iso).getTime();
  return diff <= days * 24 * 60 * 60 * 1000;
}

function filterScans(scans: any[], filter: TimeFilter): any[] {
  if (filter === "hoje")  return scans.filter((s) => isWithinDays(s.createdAt, 1));
  if (filter === "3dias") return scans.filter((s) => isWithinDays(s.createdAt, 3));
  return scans.filter((s) => isWithinDays(s.createdAt, 7));
}

function useChipAnims(activeKey: TimeFilter, chipBg: string, dividerColor: string) {
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

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const user       = useAuthStore((s) => s.user);
  const avatarUrl  = useAuthStore((s) => s.user?.avatarUrl ?? null);
  const colors     = useProfileColors();
  const borderColor = colors.dividerColor;

  const [photoUri,       setPhotoUri]       = useState<string | null>(avatarUrl);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [totalPoints,    setTotalPoints]    = useState(0);
  const [totalScans,     setTotalScans]     = useState(0);
  const [scans,          setScans]          = useState<any[]>([]);
  const [schoolRank,     setSchoolRank]     = useState<number | null>(null);
  const [turmaRank,      setTurmaRank]      = useState<number | null>(null);
  const [showLogout,     setShowLogout]     = useState(false);
  const [expanded,       setExpanded]       = useState(false);
  const [timeFilter,     setTimeFilter]     = useState<TimeFilter>("semana");
  const [recentTrophies, setRecentTrophies] = useState<AchievementData[]>([]);
  const [trophyStats,    setTrophyStats]    = useState({ total: 0, unlocked: 0 });

  const headerAnim  = useRef(new Animated.Value(0)).current;
  const cardAnim    = useRef(new Animated.Value(40)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const expandAnim  = useRef(new Animated.Value(1)).current;
  const xpAnim      = useRef(new Animated.Value(0)).current;

  const chipAnims = useChipAnims(timeFilter, colors.chipBg, colors.dividerColor);
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

    SecureStore.getItemAsync("user").then((raw) => {
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.avatarUrl) setPhotoUri(saved.avatarUrl);
      }
    });

    fetchProfile().then((data) => {
      setTotalPoints(data.totalPoints);
      setTotalScans(data.totalScans);
      setScans(data.scans);
      setSchoolRank(data.schoolRank);
      setTurmaRank(data.turmaRank);
    });

    fetchAchievements().then((data) => {
      const unlocked = data.achievements
        .filter((a) => a.unlocked && a.unlockedAt)
        .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
        .slice(0, 4);
      setRecentTrophies(unlocked);
      setTrophyStats({ total: data.totalCount, unlocked: data.unlockedCount });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const info = getLevelInfo(totalPoints);
    xpAnim.setValue(0);
    Animated.timing(xpAnim, {
      toValue: info.progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [totalPoints]);

  useEffect(() => { setExpanded(false); }, [timeFilter]);

  function handleExpand() {
    Animated.sequence([
      Animated.timing(expandAnim, { toValue: 0, duration: 90,  useNativeDriver: true }),
      Animated.timing(expandAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
    ]).start(() => setExpanded((prev) => !prev));
  }

  async function handlePickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      setUploadingPhoto(true);
      try {
        await uploadAvatar(uri);
      } catch (err) {
        console.log("ERRO UPLOAD:", err);
        setPhotoUri(avatarUrl);
      } finally {
        setUploadingPhoto(false);
      }
    }
  }

  async function confirmLogout() {
    setShowLogout(false);
    await logout();
    navigation.replace("Login");
  }

  const fullName  = user?.name ?? "Aluno";
  const initial   = (user?.name?.split(" ")[0] ?? "A")[0].toUpperCase();
  const levelInfo = getLevelInfo(totalPoints);

  const xpWidth = xpAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ["0%", "100%"],
  });

  const filteredScans = filterScans(scans, timeFilter);
  const visibleScans  = expanded ? filteredScans : filteredScans.slice(0, PREVIEW_COUNT);
  const hasMore       = filteredScans.length > PREVIEW_COUNT;

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >

        <Animated.View style={[styles.header, { backgroundColor: GREEN, opacity: headerAnim }]}>
          <TouchableOpacity onPress={handlePickPhoto} activeOpacity={0.85} disabled={uploadingPhoto}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                borderWidth: 3,
                borderColor: borderColor,
                alignItems: "center",
                marginBottom: 12,
                justifyContent: "center",
              }}
            >
              <View style={[styles.avatarWrap, { backgroundColor: ORANGE }]}>
                {photoUri
                  ? <Image source={{ uri: photoUri }} style={styles.avatarImg} />
                  : <Text style={styles.avatarText}>{initial}</Text>
                }

                {uploadingPhoto && (
                  <View style={styles.avatarOverlay}>
                    <ActivityIndicator color="#fff" size="small" />
                  </View>
                )}
              </View>
            </View>
            <View style={styles.cameraIcon}>
              <IconCamera color="#fff" size={14} />
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userTurma}>{user?.turma ?? ""} • Descarte Certo</Text>

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
          <Text style={[styles.cardTitle, { color: colors.textColor }]}>Sua posição no ranking</Text>
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

        {/* TROFÉUS RECENTES */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: cardOpacity,
          transform: [{ translateY: cardAnim }],
        }]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={[styles.cardTitle, { color: colors.textColor, marginBottom: 0 }]}>Troféus</Text>
            <Text style={{ color: colors.subTextColor, fontSize: 13, fontWeight: "700" }}>
              {trophyStats.unlocked}/{trophyStats.total}
            </Text>
          </View>

          {recentTrophies.length > 0 ? (
            <View style={{ gap: 8 }}>
              {recentTrophies.map((trophy) => {
                const accentColor = getTypeColor(trophy.type);
                return (
                  <View key={trophy.id} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{
                      width: 36, height: 36, borderRadius: 18,
                      backgroundColor: accentColor + "18",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <ProfileTrophyIcon icon={trophy.icon} color={accentColor} size={18} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: "700", color: colors.textColor }}>{trophy.title}</Text>
                      <Text style={{ fontSize: 10, fontWeight: "500", color: colors.subTextColor }}>{trophy.description}</Text>
                    </View>
                    <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: accentColor, alignItems: "center", justifyContent: "center" }}>
                      <IconCheck color="#fff" size={10} />
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={{ fontSize: 12, color: colors.subTextColor, textAlign: "center", marginVertical: 8 }}>
              Nenhum troféu desbloqueado ainda 🏆
            </Text>
          )}

          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 14, gap: 4 }}
            onPress={() => navigation.navigate("Trophies")}
            activeOpacity={0.7}
          >
            <Text style={{ color: GREEN, fontSize: 13, fontWeight: "700" }}>Ver todos </Text>
            <Text style={{ color: GREEN, fontSize: 12 }}>›</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: cardOpacity,
          transform: [{ translateY: cardAnim }],
        }]}>
          <Text style={[styles.cardTitle, { color: colors.textColor }]}>Últimos escaneamentos</Text>

          <View style={styles.filterRow}>
            {FILTERS.map((f) => {
              const anim = chipAnims[f.key];

              const bgColor = anim.interpolate({
                inputRange: [0, 1], outputRange: [colors.chipBg, GREEN],
              });
              const borderColor = anim.interpolate({
                inputRange: [0, 1], outputRange: [colors.dividerColor, GREEN],
              });
              const textColor = anim.interpolate({
                inputRange: [0, 1], outputRange: [colors.subTextColor, "#ffffff"],
              });

              return (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => setTimeFilter(f.key)}
                  activeOpacity={0.8}
                >
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
            <Animated.Text style={[
              styles.scanDate,
              { color: colors.subTextColor, marginTop: 8 },
              { opacity: listAnim.opacity },
            ]}>
              Nenhum escaneamento neste período
            </Animated.Text>
          ) : (
            <Animated.View style={{
              opacity: listAnim.opacity,
              transform: [{ translateY: listAnim.translateY }],
            }}>
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

      <Modal visible={showLogout} transparent animationType="fade" onRequestClose={() => setShowLogout(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 32 }}>
          <View style={[{ width: "100%", borderRadius: 24, padding: 24, alignItems: "center" }, { backgroundColor: colors.cardBg }]}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#fee2e2", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <IconLogout color="#ef4444" size={28} />
            </View>
            <Text style={[{ fontSize: 20, fontWeight: "800", marginBottom: 8 }, { color: colors.textColor }]}>
              Sair da conta?
            </Text>
            <Text style={[{ fontSize: 14, textAlign: "center", marginBottom: 24 }, { color: colors.subTextColor }]}>
              Você precisará entrar novamente para acessar o app.
            </Text>
            <TouchableOpacity
              style={{ width: "100%", paddingVertical: 14, borderRadius: 14, backgroundColor: "#ef4444", alignItems: "center", marginBottom: 10 }}
              onPress={confirmLogout}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>Sair</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: "100%", paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: colors.dividerColor, alignItems: "center" }}
              onPress={() => setShowLogout(false)}
            >
              <Text style={{ fontWeight: "700", fontSize: 15, color: colors.textColor }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
