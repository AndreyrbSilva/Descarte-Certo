import { useEffect, useRef, useState } from "react";
import {
  View, Text, TouchableOpacity,
  Animated, Image, Modal, ActivityIndicator, StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProfileColors } from "../../../theme/useProfileColors";
import { styles } from "./profileStyles";
import { FocusAwareStatusBar } from "../../../components/layout/FocusAwareStatusBar";
import {
  IconTrophy, IconTrend, IconRecycle, IconLogout, IconCamera,
  IconStar, IconCrown, IconMedal, IconFlame, IconTarget,
  IconShield, IconDiamond, IconRainbow, IconLightning, IconShieldCheck, IconCheck, IconPalette,
} from "../../../components/icons";
import { getTypeColor } from "../../../theme/useTrophyColors";
import { AnimatedHeroHeader } from "../../../components/layout/AnimatedHeroHeader";
import { useProfileThemeStore, PROFILE_COLOR_OPTIONS } from "../../../store/useProfileThemeStore";

import { useProfileData, FILTERS, formatDate } from "./hooks/useProfileData";

const GREEN = "#22c55e";
const ORANGE = "#f97316";
const BLUE = "#3b82f6";

const CATEGORY_LABEL: Record<string, string> = {
  plastico: "Plástico", papel: "Papel",
  metal: "Metal", organico: "Orgânico", vidro: "Vidro",
};

const CATEGORY_COLOR: Record<string, string> = {
  plastico: "#ef4444", papel: "#3b82f6",
  metal: "#eab308", organico: "#92400e", vidro: GREEN,
};

export function ProfileTrophyIcon({ icon, color, size }: { icon: string; color: string; size: number }) {
  switch (icon) {
    case "star": return <IconStar color={color} size={size} />;
    case "recycle": return <IconRecycle color={color} size={size} />;
    case "medal": return <IconMedal type="gold" size={size} />;
    case "trophy": return <IconTrophy color={color} size={size} />;
    case "crown": return <IconCrown color={color} size={size} />;
    case "flame": return <IconFlame outer={color} innerStart={color} innerEnd={color} size={size} />;
    case "target": return <IconTarget color={color} size={size} />;
    case "trend": return <IconTrend color={color} size={size} />;
    case "shield": return <IconShieldCheck color={color} size={size} />;
    case "diamond": return <IconDiamond color={color} size={size} />;
    case "rainbow": return <IconRainbow color={color} size={size} />;
    case "lightning": return <IconLightning color={color} size={size} />;
    default: return <IconTrophy color={color} size={size} />;
  }
}

function useChipAnims(activeKey: string, chipBg: string, dividerColor: string) {
  type TF = "hoje" | "3dias" | "semana";
  const anims = useRef<Record<TF, Animated.Value>>({
    hoje: new Animated.Value(0),
    "3dias": new Animated.Value(0),
    semana: new Animated.Value(1),
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

function useListAnim(filterKey: string) {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }

    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 110, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -6, duration: 110, useNativeDriver: true }),
    ]).start(() => {
      translateY.setValue(6);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 160, useNativeDriver: true }),
      ]).start();
    });
  }, [filterKey]);

  return { opacity, translateY };
}

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const colors = useProfileColors();
  const data = useProfileData();
  const borderColor = colors.dividerColor;

  const { activeColor, setProfileColor } = useProfileThemeStore();
  const themeGradient = PROFILE_COLOR_OPTIONS.find(o => o.value === activeColor)?.colors || ["#16a34a", "#22c55e", "#4ade80"];
  const [showColorPicker, setShowColorPicker] = useState(false);

  const chipAnims = useChipAnims(data.timeFilter, colors.chipBg, colors.dividerColor);
  const listAnim = useListAnim(data.timeFilter);

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor={activeColor} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >

        <AnimatedHeroHeader 
          style={[styles.header, { opacity: data.headerAnim }]}
          baseColor={activeColor}
          colors={themeGradient}
        >
          <TouchableOpacity 
            style={{ position: 'absolute', top: Math.max(insets.top + 10, 20), right: 20, zIndex: 10 }} 
            onPress={() => setShowColorPicker(true)}
            activeOpacity={0.7}
          >
            <IconPalette color="#ffffff" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={data.handlePickPhoto} activeOpacity={0.85} disabled={data.uploadingPhoto} style={{ alignSelf: 'center' }}>
              <View
                style={{
                  width: 96, height: 96, borderRadius: 48,
                  borderWidth: 3, borderColor,
                  alignItems: "center", marginBottom: 12, justifyContent: "center",
                }}
              >
                <View style={[styles.avatarWrap, { backgroundColor: ORANGE }]}>
                  {data.photoUri
                    ? <Image source={{ uri: data.photoUri }} style={styles.avatarImg} />
                    : <Text style={styles.avatarText}>{data.initial}</Text>
                  }
                  {data.uploadingPhoto && (
                    <View style={styles.avatarOverlay}>
                      <ActivityIndicator color="#fff" size="small" />
                    </View>
                  )}
                </View>
              </View>
              <View style={[styles.cameraIcon, { backgroundColor: activeColor }]}>
                <IconCamera color="#fff" size={14} />
              </View>
            </TouchableOpacity>

            <Text style={styles.userName}>{data.fullName}</Text>
            <Text style={styles.userTurma}>{data.user?.turma ?? ""} • Descarte Certo</Text>

            <View style={styles.levelBadge}>
              <IconTrophy color="#fff" size={14} />
              <Text style={styles.levelText}>{data.levelInfo.currentName}</Text>
            </View>

            <View style={styles.xpBarWrap}>
              <View style={styles.xpBarBg}>
                <Animated.View style={[styles.xpBarFill, { width: data.xpWidth }]} />
              </View>
              {data.levelInfo.isMax ? (
                <Text style={styles.xpLabel}>Nível máximo!</Text>
              ) : (
                <Text style={styles.xpLabel}>
                  {data.levelInfo.pointsInLevel}/{data.levelInfo.pointsToNext} → {data.levelInfo.nextName}
                </Text>
              )}
            </View>
          </AnimatedHeroHeader>

        <Animated.View style={[styles.statsRow, { opacity: data.cardOpacity, transform: [{ translateY: data.cardAnim }] }]}>
          <View style={[styles.statCard, { backgroundColor: ORANGE }]}>
            <IconTrend color="#fff" size={20} />
            <Text style={styles.statNumber}>{data.totalPoints}</Text>
            <Text style={styles.statLabel}>Pontos totais</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: BLUE }]}>
            <IconRecycle color="#fff" size={20} />
            <Text style={styles.statNumber}>{data.totalScans}</Text>
            <Text style={styles.statLabel}>Itens escaneados</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: data.cardOpacity,
          transform: [{ translateY: data.cardAnim }],
        }]}>
          <Text style={[styles.cardTitle, { color: colors.textColor }]}>Sua posição no ranking</Text>
          <View style={styles.rankRow}>
            <View style={styles.rankItem}>
              <IconTrend color={ORANGE} size={20} />
              <Text style={[styles.rankNum, { color: ORANGE }]}>{data.turmaRank ? `#${data.turmaRank}` : "--"}</Text>
              <Text style={[styles.rankLabel, { color: colors.subTextColor }]}>Turma</Text>
            </View>
            <View style={[styles.divider, { width: 1, height: 50, backgroundColor: colors.dividerColor }]} />
            <View style={styles.rankItem}>
              <IconTrophy color={BLUE} size={20} />
              <Text style={[styles.rankNum, { color: BLUE }]}>{data.schoolRank ? `#${data.schoolRank}` : "--"}</Text>
              <Text style={[styles.rankLabel, { color: colors.subTextColor }]}>Escola</Text>
            </View>
          </View>
        </Animated.View>

        {/* TROFÉUS RECENTES */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: data.cardOpacity,
          transform: [{ translateY: data.cardAnim }],
        }]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={[styles.cardTitle, { color: colors.textColor, marginBottom: 0 }]}>Troféus</Text>
            <Text style={{ color: colors.subTextColor, fontSize: 13, fontWeight: "700" }}>
              {data.trophyStats.unlocked}/{data.trophyStats.total}
            </Text>
          </View>

          {data.recentTrophies.length > 0 ? (
            <View style={{ gap: 8 }}>
              {data.recentTrophies.map((trophy) => {
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
          opacity: data.cardOpacity,
          transform: [{ translateY: data.cardAnim }],
        }]}>
          <Text style={[styles.cardTitle, { color: colors.textColor }]}>Últimos escaneamentos</Text>

          <View style={styles.filterRow}>
            {FILTERS.map((f) => {
              const anim = chipAnims[f.key];
              const bgColor = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.chipBg, activeColor] });
              const bColor = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.dividerColor, activeColor] });
              const textColor = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.subTextColor, "#ffffff"] });

              return (
                <TouchableOpacity key={f.key} onPress={() => data.setTimeFilter(f.key)} activeOpacity={0.8}>
                  <Animated.View style={[styles.filterChip, { backgroundColor: bgColor, borderColor: bColor, borderWidth: 1 }]}>
                    <Animated.Text style={[styles.filterChipText, { color: textColor }]}>
                      {f.label}
                    </Animated.Text>
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>

          {data.filteredScans.length === 0 ? (
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
              {data.visibleScans.map((scan: any, i: number) => (
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
                    <Text style={[styles.scanPoints, { color: activeColor }]}>+{scan.points}</Text>
                  </View>
                  {i < data.visibleScans.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />
                  )}
                </View>
              ))}

              {data.hasMore && (
                <TouchableOpacity onPress={data.handleExpand} activeOpacity={0.7} style={styles.expandBtn}>
                  <Animated.Text style={[styles.expandBtnText, { color: activeColor, opacity: data.expandAnim }]}>
                    {data.expanded ? "Mostrar menos" : `Mostrar tudo (${data.filteredScans.length})`}
                  </Animated.Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}
        </Animated.View>

      </ScrollView>

      <Modal visible={data.showLogout} transparent animationType="fade" onRequestClose={() => data.setShowLogout(false)}>
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
              onPress={data.confirmLogout}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>Sair</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: "100%", paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: colors.dividerColor, alignItems: "center" }}
              onPress={() => data.setShowLogout(false)}
            >
              <Text style={{ fontWeight: "700", fontSize: 15, color: colors.textColor }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showColorPicker} transparent animationType="fade" onRequestClose={() => setShowColorPicker(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <View style={[{ width: "100%", borderRadius: 24, padding: 24, alignItems: "center" }, { backgroundColor: colors.cardBg }]}>
            <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 8, color: colors.textColor }}>
              Cor do Perfil
            </Text>
            <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 24, color: colors.subTextColor }}>
              Escolha uma cor para personalizar o cabeçalho e os ícones do seu perfil.
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 24 }}>
              {PROFILE_COLOR_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={StyleSheet.flatten([
                    styles.colorItem, 
                    { backgroundColor: option.value }
                  ])}
                  onPress={() => { setProfileColor(option.value); setShowColorPicker(false); }}
                  activeOpacity={0.8}
                >
                  {activeColor === option.value && <IconCheck color="#ffffff" size={24} />}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={{ width: "100%", paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: colors.dividerColor, alignItems: "center" }}
              onPress={() => setShowColorPicker(false)}
            >
              <Text style={{ fontWeight: "700", fontSize: 15, color: colors.textColor }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
