import { useEffect, useRef, useState } from "react";
import {
  View, Text, TouchableOpacity,
  Animated, StatusBar,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigation } from "@react-navigation/native";

import { fetchAchievements, AchievementData } from "../../services/achievementService";
import { useTrophyColors, getTypeColor, getTypeLabel } from "../../hooks/useTrophyColors";
import { styles } from "./trophyStyles";
import {
  IconTrophy, IconStar, IconRecycle, IconMedal, IconCrown,
  IconFlame, IconTarget, IconTrend, IconShield, IconCheck,
  IconDiamond, IconRainbow, IconLightning, IconShieldCheck,
} from "../../components/icons";

const GREEN = "#22c55e";

// ── Mapeamento ícone → componente ───────────────────────
function TrophyIcon({ icon, color, size, locked }: {
  icon: string; color: string; size: number; locked?: boolean;
}) {
  const c = locked ? "#94a3b8" : color;
  switch (icon) {
    case "star": return <IconStar color={c} size={size} />;
    case "recycle": return <IconRecycle color={c} size={size} />;
    case "medal": return <IconMedal type="gold" size={size} />;
    case "trophy": return <IconTrophy color={c} size={size} />;
    case "crown": return <IconCrown color={c} size={size} />;
    case "flame": return <IconFlame outer={c} innerStart={c} innerEnd={c} size={size} />;
    case "target": return <IconTarget color={c} size={size} />;
    case "trend": return <IconTrend color={c} size={size} />;
    case "shield": return <IconShieldCheck color={c} size={size} />;
    case "diamond": return <IconDiamond color={c} size={size} />;
    case "rainbow": return <IconRainbow color={c} size={size} />;
    case "lightning": return <IconLightning color={c} size={size} />;
    default: return <IconTrophy color={c} size={size} />;
  }
}

const SECTION_ORDER = [
  "total_scans",
  "total_points",
  "streak",
  "ranking_turma",
  "ranking_escola",
  "ranking_consistency",
  "category_diversity",
  "missions_completed",
];

const SECTION_ICONS: Record<string, string> = {
  total_scans: "recycle",
  total_points: "star",
  streak: "flame",
  ranking_turma: "trend",
  ranking_escola: "crown",
  ranking_consistency: "shield",
  category_diversity: "rainbow",
  missions_completed: "target",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short",
  });
}

export function TrophyScreen() {
  const navigation = useNavigation<any>();
  const colors = useTrophyColors();

  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY = useRef(new Animated.Value(20)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;
  const listY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(colors.bg);

    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(headerY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(listOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(listY, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();

    fetchAchievements().then((data) => {
      setAchievements(data.achievements);
      setTotalCount(data.totalCount);
      setUnlockedCount(data.unlockedCount);
    });
  }, []);

  const progressPct = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  // Agrupa por tipo
  const sections = SECTION_ORDER.map((type) => ({
    type,
    label: getTypeLabel(type),
    icon: SECTION_ICONS[type] ?? "trophy",
    color: getTypeColor(type),
    items: achievements.filter((a) => a.type === type),
  })).filter((s) => s.items.length > 0);

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      {/* Botão Voltar */}
      <TouchableOpacity
        style={[styles.backBtn, { paddingTop: Math.max(insets.top, 12) + 12 }]}
        activeOpacity={0.7}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: GREEN, fontSize: 22, fontWeight: "700", marginTop: -2 }}>‹</Text>
        <Text style={[styles.backText, { color: GREEN }]}>Voltar</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ────────────────────────────── */}
        <Animated.View style={[styles.header, {
          opacity: headerOpacity,
          transform: [{ translateY: headerY }],
        }]}>
          <View style={[styles.headerIconWrap, { backgroundColor: GREEN + "18" }]}>
            <IconTrophy color={GREEN} size={32} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.textColor }]}>
            Troféus
          </Text>
          <Text style={[styles.headerSub, { color: colors.subTextColor }]}>
            {unlockedCount} de {totalCount} desbloqueados
          </Text>

          {/* Barra de progresso geral */}
          <View style={styles.progressBarWrap}>
            <View style={[styles.progressTrack, { backgroundColor: colors.progressTrack }]}>
              <View style={[styles.progressBar, {
                width: `${progressPct}%`,
                backgroundColor: GREEN,
              }]} />
            </View>
            <Text style={[styles.progressLabel, { color: colors.subTextColor }]}>
              {Math.round(progressPct)}%
            </Text>
          </View>
        </Animated.View>

        {/* ── Seções por tipo ───────────────────── */}
        <Animated.View style={{
          opacity: listOpacity,
          transform: [{ translateY: listY }],
        }}>
          {sections.map((section) => (
            <CollapsibleSection key={section.type} section={section} colors={colors} />
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function CollapsibleSection({ section, colors }: any) {
  const [expanded, setExpanded] = useState(true);
  const sectionUnlocked = section.items.filter((a: any) => a.unlocked).length;

  return (
    <View>
      {/* Header da seção */}
      <TouchableOpacity 
        style={[
          styles.sectionHeader, 
          { 
            backgroundColor: section.color + "15", 
            paddingHorizontal: 16, 
            paddingVertical: 12, 
            borderRadius: 16,
            marginBottom: expanded ? 12 : 20 
          }
        ]} 
        activeOpacity={0.7} 
        onPress={() => setExpanded(!expanded)}
      >
        <TrophyIcon icon={section.icon} color={section.color} size={22} />
        <Text style={[styles.sectionTitle, { color: colors.textColor }]}>
          {section.label}
        </Text>
        <Text style={[styles.sectionCount, { color: section.color }]}>
          {sectionUnlocked}/{section.items.length}
        </Text>
        <Text style={{ fontSize: 18, color: colors.subTextColor, marginLeft: 4 }}>
          {expanded ? "▾" : "▸"}
        </Text>
      </TouchableOpacity>

      {/* Cards dos troféus */}
      {expanded && section.items.map((trophy: any) => {
        const isUnlocked = trophy.unlocked;
        const pct = trophy.threshold > 0
          ? Math.min((trophy.progress / trophy.threshold) * 100, 100)
          : 0;

        return (
          <View
            key={trophy.id}
            style={[styles.trophyCard, {
              backgroundColor: isUnlocked ? colors.cardBg : colors.lockedBg,
              opacity: isUnlocked ? 1 : 0.7,
            }]}
          >
            {/* Ícone */}
            <View style={[styles.trophyIconWrap, {
              backgroundColor: isUnlocked
                ? section.color + "18"
                : colors.progressTrack,
            }]}>
              <TrophyIcon
                icon={trophy.icon}
                color={section.color}
                size={24}
                locked={!isUnlocked}
              />
            </View>

            {/* Info */}
            <View style={styles.trophyInfo}>
              <Text style={[styles.trophyTitle, {
                color: isUnlocked ? colors.textColor : colors.subTextColor,
              }]}>
                {trophy.title}
              </Text>
              <Text style={[styles.trophyDesc, {
                color: colors.subTextColor,
              }]}>
                {trophy.description}
              </Text>

              {/* Mini progress bar */}
              {!isUnlocked && (
                <View style={{ marginTop: 4 }}>
                  <View style={[styles.miniTrack, { backgroundColor: colors.progressTrack }]}>
                    <View style={[styles.miniBar, {
                      width: `${pct}%`,
                      backgroundColor: section.color,
                    }]} />
                  </View>
                </View>
              )}
            </View>

            {/* Right side */}
            <View style={styles.trophyRight}>
              {isUnlocked ? (
                <>
                  <View style={[styles.checkCircle, { backgroundColor: section.color }]}>
                    <IconCheck color="#fff" size={12} />
                  </View>
                  {trophy.unlockedAt && (
                    <Text style={[styles.trophyDate, { color: colors.subTextColor }]}>
                      {formatDate(trophy.unlockedAt)}
                    </Text>
                  )}
                </>
              ) : (
                <>
                  <Text style={[styles.trophyProgressMini, { color: section.color }]}>
                    {trophy.progress}/{trophy.threshold}
                  </Text>
                  {trophy.reward > 0 && (
                    <View style={[styles.rewardBadge, { backgroundColor: section.color + "22" }]}>
                      <Text style={[styles.rewardText, { color: section.color }]}>
                        +{trophy.reward}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
