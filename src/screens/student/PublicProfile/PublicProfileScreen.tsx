import { useEffect, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Animated, StatusBar, Image,
} from "react-native";

import { useProfileColors } from "../../../theme/useProfileColors";
import { getStreakColors }   from "../../../theme/streakColors";
import { styles }            from "../Profile/profileStyles";
import {
  IconTrophy, IconTrend, IconRecycle, IconFlame, IconCheck,
} from "../../../components/icons";
import { ProfileTrophyIcon } from "../Profile/ProfileScreen";
import { getTypeColor } from "../../../theme/useTrophyColors";
import { AnimatedHeroHeader } from "../../../components/layout/AnimatedHeroHeader";

import { usePublicProfileData, FILTERS, formatDate } from "./hooks/usePublicProfileData";

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

function useChipAnims(activeKey: string) {
  type TF = "hoje" | "3dias" | "semana";
  const anims = useRef<Record<TF, Animated.Value>>({
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

function useListAnim(filterKey: string) {
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

function streakText(streak: number): string {
  if (streak === 0) return "Sem sequência";
  if (streak === 1) return "1 dia seguido";
  return `${streak} dias seguidos`;
}

export function PublicProfileScreen() {
  const colors   = useProfileColors();
  const d        = usePublicProfileData();
  const chipAnims = useChipAnims(d.timeFilter);
  const listAnim  = useListAnim(d.timeFilter);
  const flameColors = getStreakColors(d.streak);

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 90 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: d.headerAnim }}>
          <AnimatedHeroHeader style={styles.header}>
            {/* botão voltar */}
            <TouchableOpacity
              onPress={() => d.navigation.goBack()}
              activeOpacity={0.7}
              style={{ position: "absolute", top: 56, left: 20, zIndex: 20 }}
            >
              <Text style={{ color: "#fff", fontSize: 28, lineHeight: 32 }}>←</Text>
            </TouchableOpacity>

            {/* avatar */}
            <View style={{
              width: 96, height: 96, borderRadius: 48,
              borderWidth: 3, borderColor: colors.dividerColor,
              alignItems: "center", justifyContent: "center", marginBottom: 12,
              alignSelf: 'center'
            }}>
              <View style={[styles.avatarWrap, { backgroundColor: ORANGE }]}>
                {d.profileUser?.avatarUrl
                  ? <Image source={{ uri: d.profileUser.avatarUrl }} style={styles.avatarImg} />
                  : <Text style={styles.avatarText}>{d.initial}</Text>
                }
              </View>
            </View>

            <Text style={styles.userName}>{d.profileUser?.name ?? "..."}</Text>
            <Text style={styles.userTurma}>{d.profileUser?.turma ?? ""} • Descarte Certo</Text>

            {/* streak badge */}
            <View style={[styles.levelBadge, { marginTop: 6 }]}>
              <IconFlame
                outer={flameColors.outer}
                innerStart={flameColors.innerStart}
                innerEnd={flameColors.innerEnd}
                size={14}
              />
              <Text style={styles.levelText}>{streakText(d.streak)}</Text>
            </View>

            <View style={styles.levelBadge}>
              <IconTrophy color="#fff" size={14} />
              <Text style={styles.levelText}>{d.levelInfo.currentName}</Text>
            </View>

            <View style={styles.xpBarWrap}>
              <View style={styles.xpBarBg}>
                <Animated.View style={[styles.xpBarFill, { width: d.xpWidth }]} />
              </View>
              {d.levelInfo.isMax ? (
                <Text style={styles.xpLabel}>Nível máximo!</Text>
              ) : (
                <Text style={styles.xpLabel}>
                  {d.levelInfo.pointsInLevel}/{d.levelInfo.pointsToNext} → {d.levelInfo.nextName}
                </Text>
              )}
            </View>
          </AnimatedHeroHeader>
        </Animated.View>

        <Animated.View style={[styles.statsRow, { opacity: d.cardOpacity, transform: [{ translateY: d.cardAnim }] }]}>
          <View style={[styles.statCard, { backgroundColor: ORANGE }]}>
            <IconTrend color="#fff" size={20} />
            <Text style={styles.statNumber}>{d.totalPoints}</Text>
            <Text style={styles.statLabel}>Pontos totais</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: BLUE }]}>
            <IconRecycle color="#fff" size={20} />
            <Text style={styles.statNumber}>{d.totalScans}</Text>
            <Text style={styles.statLabel}>Itens escaneados</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: d.cardOpacity,
          transform: [{ translateY: d.cardAnim }],
        }]}>
          <Text style={[styles.cardTitle, { color: colors.textColor }]}>Posição no ranking</Text>
          <View style={styles.rankRow}>
            <View style={styles.rankItem}>
              <IconTrend color={ORANGE} size={20} />
              <Text style={[styles.rankNum, { color: ORANGE }]}>{d.turmaRank ? `#${d.turmaRank}` : "--"}</Text>
              <Text style={[styles.rankLabel, { color: colors.subTextColor }]}>Turma</Text>
            </View>
            <View style={[styles.divider, { width: 1, height: 50, backgroundColor: colors.dividerColor }]} />
            <View style={styles.rankItem}>
              <IconTrophy color={BLUE} size={20} />
              <Text style={[styles.rankNum, { color: BLUE }]}>{d.schoolRank ? `#${d.schoolRank}` : "--"}</Text>
              <Text style={[styles.rankLabel, { color: colors.subTextColor }]}>Escola</Text>
            </View>
          </View>
        </Animated.View>

        {/* TROFÉUS RECENTES */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: d.cardOpacity,
          transform: [{ translateY: d.cardAnim }],
        }]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={[styles.cardTitle, { color: colors.textColor, marginBottom: 0 }]}>Troféus recentes</Text>
            <Text style={{ color: colors.subTextColor, fontSize: 13, fontWeight: "700" }}>
              {d.trophyStats.unlocked}/{d.trophyStats.total}
            </Text>
          </View>

          {d.recentTrophies.length > 0 ? (
            <View style={{ gap: 8 }}>
              {d.recentTrophies.map((trophy: any) => {
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
        </Animated.View>

        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: d.cardOpacity,
          transform: [{ translateY: d.cardAnim }],
        }]}>
          <Text style={[styles.cardTitle, { color: colors.textColor }]}>Últimos escaneamentos</Text>

          <View style={styles.filterRow}>
            {FILTERS.map((f) => {
              const anim = chipAnims[f.key];
              const bgColor = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.chipBg, GREEN] });
              const borderColor = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.dividerColor, GREEN] });
              const textColor = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.subTextColor, "#ffffff"] });

              return (
                <TouchableOpacity key={f.key} onPress={() => d.setTimeFilter(f.key)} activeOpacity={0.8}>
                  <Animated.View style={[styles.filterChip, { backgroundColor: bgColor, borderColor, borderWidth: 1 }]}>
                    <Animated.Text style={[styles.filterChipText, { color: textColor }]}>
                      {f.label}
                    </Animated.Text>
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>

          {d.filteredScans.length === 0 ? (
            <Animated.Text style={[styles.scanDate, { color: colors.subTextColor, marginTop: 8 }, { opacity: listAnim.opacity }]}>
              Nenhum escaneamento neste período
            </Animated.Text>
          ) : (
            <Animated.View style={{ opacity: listAnim.opacity, transform: [{ translateY: listAnim.translateY }] }}>
              {d.visibleScans.map((scan: any, i: number) => (
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
                  {i < d.visibleScans.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />
                  )}
                </View>
              ))}

              {d.hasMore && (
                <TouchableOpacity onPress={d.handleExpand} activeOpacity={0.7} style={styles.expandBtn}>
                  <Animated.Text style={[styles.expandBtnText, { color: GREEN, opacity: d.expandAnim }]}>
                    {d.expanded ? "Mostrar menos" : `Mostrar tudo (${d.filteredScans.length})`}
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
