import { useEffect, useCallback } from "react";
import {
  View, Text, TouchableOpacity,
  Animated, Image, StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as NavigationBar      from "expo-navigation-bar";
import { useNavigation }       from "@react-navigation/native";
import { useFocusEffect }      from "@react-navigation/native";
import { useColorScheme }      from "react-native";
import { StreakSheetModal } from "../../../components/modals/StreakSheetModal";

import { useHomeColors }   from "../../../theme/useHomeColors";
import { getStreakColors } from "../../../theme/streakColors";
import { styles }          from "./homeStyles";
import { FocusAwareStatusBar } from "../../../components/layout/FocusAwareStatusBar";
import {
  IconTrophy, IconTrend, IconCamera, IconCheck,
  IconTarget, IconBulb, IconRecycle, IconRanking, IconStar, IconFlame,
} from "../../../components/icons";

import { useHomeData }       from "./hooks/useHomeData";
import { useHomeAnimations } from "./hooks/useHomeAnimations";

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

function streakLabel(streak: number): string {
  if (streak === 0) return "Comece sua sequência";
  if (streak === 1) return "1 dia seguido";
  return `${streak} dias seguidos`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function HomeScreen() {
  const navigation   = useNavigation<any>();
  const colors       = useHomeColors();
  const data         = useHomeData();
  const anim         = useHomeAnimations();
  const flameColors  = getStreakColors(data.streak);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(colors.bg);
    NavigationBar.setButtonStyleAsync("dark");

    anim.startEntranceAnimation();

    data.loadData(
      (streak) => { if (streak > 0) anim.animateStreakPop(); },
    );
  }, []);

  // detecta level up ao voltar pra tela
  useFocusEffect(
    useCallback(() => {
      if (!data.leveledUp) return;
      data.setLeveledUp(false);
      data.setShowOverlay(true);

      anim.playLevelUpOverlay(() => data.setShowOverlay(false));
    }, [data.leveledUp])
  );

  const greeting  = getGreeting();

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <FocusAwareStatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <Animated.View style={[styles.header, { opacity: anim.headerOpacity }]}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")} activeOpacity={0.8}>
            <View style={{
              width: 52, height: 52, borderRadius: 26,
              borderWidth: 3, borderColor: colors.dividerColor,
              alignItems: "center", justifyContent: "center", marginRight: 12,
            }}>
              {data.avatarUrl ? (
                <Image source={{ uri: data.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: GREEN }]}>
                  <Text style={styles.avatarText}>{data.initial}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerHello, { color: colors.subTextColor }]}>{greeting},</Text>
            <Text style={[styles.headerName,  { color: colors.textColor }]}>{data.firstName}! 👋</Text>
          </View>
        </Animated.View>

        {/* CARD PONTOS */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: anim.card1Opacity,
          transform: [{ translateY: anim.card1Y }],
        }]}>
          <View style={styles.pointsRow}>
            <View style={[styles.pointsIconWrap, { backgroundColor: colors.iconBg }]}>
              <IconStar color={GREEN} size={28} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.pointsTitle, { color: colors.textColor }]}>
                {data.totalPoints === 0 ? "Comece a escanear!" : "Você está indo bem!"}
              </Text>
              <Text style={[styles.pointsSub, { color: colors.subTextColor }]}>
                {data.totalPoints === 0
                  ? "Escaneie seu primeiro item"
                  : "Continue assim e faça a diferença! 💚"}
              </Text>
            </View>
            <View style={styles.pointsNumBlock}>
              <Text style={[styles.pointsNumber, { color: GREEN }]}>{data.displayPoints}</Text>
              <Text style={[styles.pointsLabel,  { color: colors.subTextColor }]}>pontos</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />

          <View style={styles.rankingLinkRow}>
            <TouchableOpacity
              onPress={() => data.setStreakSheetVisible(true)}
              activeOpacity={0.7}
              style={{ flexDirection: "row", alignItems: "center", gap: 6, flex: 1 }}
            >
              <Animated.View style={{ transform: [{ scale: anim.flamePop }] }}>
                <IconFlame
                  outer={flameColors.outer}
                  innerStart={flameColors.innerStart}
                  innerEnd={flameColors.innerEnd}
                  size={16}
                />
              </Animated.View>
              <Text style={[styles.rankingLinkText, { color: colors.subTextColor }]}>
                {streakLabel(data.streak)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Ranking")}
              style={styles.rankingLink}
            >
              <Text style={[styles.rankingLinkBtn, { color: GREEN }]}>Ver ranking </Text>
              <Text style={{ color: GREEN, fontSize: 12 }}>›</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* BOTÃO ESCANEAR */}
        <Animated.View style={{
          opacity: anim.btnOpacity,
          transform: [{ translateY: anim.btnY }, { scale: anim.pulse }],
          marginBottom: 1,
        }}>
          <TouchableOpacity
            style={[styles.scanBtn, { backgroundColor: GREEN }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Scanner")}
          >
            <IconCamera color="#fff" size={22} style={{ marginTop: -5 }} />
            <Text style={styles.scanText}>Escanear lixo</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* MISSÃO DO DIA */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: anim.card3Opacity,
          transform: [{ translateY: anim.card3Y }],
          borderWidth: data.mission?.completed ? 1.5 : 0,
          borderColor: data.mission?.completed ? GREEN : "transparent",
        }]}>
          <View style={styles.missionHeader}>
            <View style={[styles.missionIconWrap, {
              backgroundColor: data.mission?.completed ? GREEN + "22" : colors.iconBg,
            }]}>
              {data.mission?.completed
                ? <IconCheck color={GREEN} size={20} />
                : <IconTarget color={ORANGE} size={20} />
              }
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.missionLabel, { color: colors.subTextColor }]}>
                {data.mission?.completed ? "Missão completa!" : "Missão diária"}
              </Text>
              <Text style={[styles.missionText, { color: colors.textColor }]}>
                {data.mission?.mission.title ?? "Carregando..."}
              </Text>
            </View>
            {data.mission?.completed && (
              <View style={{
                backgroundColor: GREEN,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <Text style={{ color: "#fff", fontSize: 11, fontWeight: "800" }}>
                  +{data.mission.mission.reward} pts
                </Text>
              </View>
            )}
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.progressTrack }]}>
            <View style={[styles.progressBar, {
              width: data.mission
                ? `${Math.min((data.mission.progress / data.mission.mission.target) * 100, 100)}%`
                : "0%",
              backgroundColor: data.mission?.completed ? GREEN : ORANGE,
            }]} />
          </View>
          <View style={styles.progressFooter}>
            <Text style={[styles.progressPct, { color: colors.subTextColor }]}>
              {data.mission
                ? `${Math.min(Math.round((data.mission.progress / data.mission.mission.target) * 100), 100)}%`
                : "0%"}
            </Text>
            <Text style={[styles.progressPct, { color: colors.subTextColor }]}>
              {data.mission
                ? `${Math.min(data.mission.progress, data.mission.mission.target)}/${data.mission.mission.target}`
                : "0/0"}
            </Text>
          </View>
          {data.mission?.completed ? (
            <Text style={{ color: colors.subTextColor, fontSize: 11, marginTop: 8, textAlign: "center" }}>
              Volte amanhã para uma nova missão!
            </Text>
          ) : (
            <Text style={{ color: colors.subTextColor, fontSize: 11, marginTop: 8, textAlign: "center", opacity: 0.7 }}>
              Nova missão todos os dias à meia-noite
            </Text>
          )}
        </Animated.View>

        {/* RANKING */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: anim.card2Opacity,
          transform: [{ translateY: anim.card2Y }],
        }]}>
          <View style={styles.cardTitleRow}>
            <View style={[styles.missionIconWrap, { backgroundColor: colors.iconBg }]}>
              <IconRanking color={ORANGE} size={18} />
            </View>
            <Text style={[styles.cardTitleText, { color: colors.textColor }]}>Ranking</Text>
          </View>

          <View style={styles.rankItem}>
            <View style={[styles.rankIconWrap, { backgroundColor: colors.iconBg }]}>
              <IconTrend color={ORANGE} size={16} />
            </View>
            <Text style={[styles.rankItemLabel, { color: colors.subTextColor }]}>Sua turma</Text>
            <Text style={[styles.rankItemNum,   { color: ORANGE }]}>
              {data.turmaRank ? `#${data.turmaRank}` : "--"}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />

          <View style={styles.rankItem}>
            <View style={[styles.rankIconWrap, { backgroundColor: colors.iconBg }]}>
              <IconTrophy color={BLUE} size={16} />
            </View>
            <Text style={[styles.rankItemLabel, { color: colors.subTextColor }]}>Escola inteira</Text>
            <Text style={[styles.rankItemNum,   { color: BLUE }]}>
              {data.schoolRank ? `#${data.schoolRank}` : "--"}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />

          <TouchableOpacity style={styles.rankingLink} onPress={() => navigation.navigate("Ranking")}>
            <Text style={[styles.rankingLinkBtn, { color: GREEN }]}>Ver detalhes </Text>
            <Text style={{ color: GREEN, fontSize: 12 }}>›</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* VOCÊ SABIA */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.factBg,
          opacity: anim.card4Opacity,
          transform: [{ translateY: anim.card4Y }],
          overflow: "hidden",
        }]}>
          <View style={styles.factContent}>
            <View style={styles.missionIconWrap}>
              <IconBulb color={colors.factIcon} size={40} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.factTitle, { color: colors.factSubText }]}>Você sabia?</Text>
              <Text style={[styles.factText,  { color: colors.factSubText }]}>{data.fact}</Text>
            </View>
          </View>
          <Image
            source={require("../../../../assets/planet.png")}
            style={styles.planetImg}
            resizeMode="contain"
          />
        </Animated.View>

        {/* ÚLTIMO ESCANEAMENTO */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: anim.card5Opacity,
          transform: [{ translateY: anim.card5Y }],
        }]}>
          <Text style={[styles.lastTitle, { color: colors.subTextColor, marginBottom: 0 }]}>
            Último escaneamento
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.dividerColor, marginBottom: 12, marginTop: 6 }]} />
          {data.lastScan ? (
            <View style={styles.lastRow}>
              <View style={[styles.lastIconWrap, { backgroundColor: CATEGORY_COLOR[data.lastScan.category] + "22" }]}>
                <IconRecycle color={CATEGORY_COLOR[data.lastScan.category]} size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.lastCategory, { color: colors.textColor }]}>
                  {CATEGORY_LABEL[data.lastScan.category] ?? data.lastScan.category}
                </Text>
                <Text style={[styles.lastDate, { color: colors.subTextColor }]}>
                  {formatDate(data.lastScan.createdAt)}
                </Text>
              </View>
              <Text style={[styles.lastPoints, { color: GREEN }]}>+{data.lastScan.points}</Text>
            </View>
          ) : (
            <Text style={[styles.lastDate, { color: colors.subTextColor, marginTop: 8 }]}>
              Nenhum escaneamento ainda 🌱
            </Text>
          )}
        </Animated.View>
      </ScrollView>

      {/* LEVEL UP OVERLAY */}
      {data.showOverlay && (
        <Animated.View style={[overlayStyles.backdrop, { opacity: anim.overlayOpacity }]}>
          <Animated.View style={[overlayStyles.card, {
            backgroundColor: colors.cardBg,
            transform: [{ scale: anim.cardScale }],
          }]}>
            <Animated.View style={{ transform: [{ scale: anim.flameScale }] }}>
              <IconFlame
                outer={flameColors.outer}
                innerStart={flameColors.innerStart}
                innerEnd={flameColors.innerEnd}
                size={96}
              />
            </Animated.View>
            <Text style={[overlayStyles.title, { color: colors.textColor }]}>
              Sequência evoluiu!
            </Text>
            <Text style={[overlayStyles.sub, { color: colors.subTextColor }]}>
              {data.streak} {data.streak === 1 ? "dia seguido" : "dias seguidos"}
            </Text>
            <View style={[overlayStyles.badge, { backgroundColor: flameColors.outer + "22" }]}>
              <Text style={[overlayStyles.badgeText, { color: flameColors.outer }]}>
                Novo nível desbloqueado
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
      )}
      <StreakSheetModal
        visible={data.streakSheetVisible}
        streak={data.streak}
        onClose={() => data.setStreakSheetVisible(false)}
      />
    </View>
  );
}

const overlayStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems:      "center",
    justifyContent:  "center",
    zIndex:          99,
  },
  card: {
    width:         280,
    borderRadius:  28,
    padding:       32,
    alignItems:    "center",
    gap:           12,
    shadowColor:   "#000",
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius:  20,
    elevation:     12,
  },
  title: {
    fontSize:      22,
    fontWeight:    "900",
    letterSpacing: -0.5,
  },
  sub: {
    fontSize:   14,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical:   8,
    borderRadius:      20,
    marginTop:         4,
  },
  badgeText: {
    fontSize:   13,
    fontWeight: "800",
  },
});
