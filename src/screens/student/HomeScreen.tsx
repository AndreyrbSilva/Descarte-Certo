import { useEffect, useRef, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Animated, StatusBar, Image,
} from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigation } from "@react-navigation/native";
import { useColorScheme } from "react-native";

import { useAuthStore }     from "../../store/useAuthStore";
import { fetchHomeData }    from "../../services/homeService";
import { useHomeColors }    from "../../hooks/useHomeColors";
import { getStreakColors }  from "../../hooks/streakColors";
import { styles }           from "./homeStyles";
import {
  IconTrophy, IconTrend, IconCamera,
  IconTarget, IconBulb, IconRecycle, IconRanking, IconStar, IconFlame,
} from "../../components/icons";

const GREEN  = "#22c55e";
const ORANGE = "#f97316";
const BLUE   = "#3b82f6";

const FACTS = [
  "O Brasil recicla 97% das latas de alumínio, um dos maiores índices do mundo!",
  "Uma folha de papel pode ser reciclada até 7 vezes!",
  "Reciclar 1kg de plástico economiza até 2kg de petróleo!",
  "O lixo orgânico pode virar adubo em apenas 3 meses!",
  "Cada brasileiro gera em média 1kg de lixo por dia!",
];

type LastScan = { category: string; createdAt: string; points: number } | null;

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
  const navigation = useNavigation<any>();
  const user       = useAuthStore((s) => s.user);
  const colors     = useHomeColors();
  const dark       = useColorScheme() === "dark";

  const [totalPoints,   setTotalPoints]   = useState(0);
  const [displayPoints, setDisplayPoints] = useState(0);
  const [schoolRank,    setSchoolRank]    = useState<number | null>(null);
  const [turmaRank,     setTurmaRank]     = useState<number | null>(null);
  const [lastScan,      setLastScan]      = useState<LastScan>(null);
  const [fact,          setFact]          = useState("");
  const [streak,        setStreak]        = useState(0);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const card1Opacity  = useRef(new Animated.Value(0)).current;
  const card1Y        = useRef(new Animated.Value(30)).current;
  const card2Opacity  = useRef(new Animated.Value(0)).current;
  const card2Y        = useRef(new Animated.Value(30)).current;
  const btnOpacity    = useRef(new Animated.Value(0)).current;
  const btnY          = useRef(new Animated.Value(30)).current;
  const card3Opacity  = useRef(new Animated.Value(0)).current;
  const card3Y        = useRef(new Animated.Value(30)).current;
  const card4Opacity  = useRef(new Animated.Value(0)).current;
  const card4Y        = useRef(new Animated.Value(30)).current;
  const card5Opacity  = useRef(new Animated.Value(0)).current;
  const card5Y        = useRef(new Animated.Value(30)).current;
  const pulse         = useRef(new Animated.Value(1)).current;
  const flamePop      = useRef(new Animated.Value(1)).current;

  const avatarUrl    = useAuthStore((s) => s.user?.avatarUrl ?? null);
  const flameColors  = getStreakColors(streak);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(colors.bg);
    NavigationBar.setButtonStyleAsync("dark");

    setFact(FACTS[Math.floor(Math.random() * FACTS.length)]);

    const slide = (o: Animated.Value, y: Animated.Value) =>
      Animated.parallel([
        Animated.timing(o, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(y, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]);

    Animated.stagger(80, [
      Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      slide(card1Opacity, card1Y),
      slide(card2Opacity, card2Y),
      slide(btnOpacity,   btnY),
      slide(card3Opacity, card3Y),
      slide(card4Opacity, card4Y),
      slide(card5Opacity, card5Y),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.02, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    ).start();

    fetchHomeData().then((data) => {
      setTotalPoints(data.totalPoints);
      setSchoolRank(data.schoolRank);
      setTurmaRank(data.turmaRank);
      setLastScan(data.lastScan);
      setStreak(data.streak);

      if (data.streak > 0) {
        Animated.sequence([
          Animated.timing(flamePop, { toValue: 1.4, duration: 200, useNativeDriver: true }),
          Animated.spring(flamePop,  { toValue: 1,   useNativeDriver: true }),
        ]).start();
      }

      let val        = 0;
      const step     = Math.ceil(data.totalPoints / 40);
      const timer    = setInterval(() => {
        val += step;
        if (val >= data.totalPoints) {
          setDisplayPoints(data.totalPoints);
          clearInterval(timer);
        } else {
          setDisplayPoints(val);
        }
      }, 30);
    });
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "Aluno";
  const initial   = firstName[0].toUpperCase();
  const greeting  = getGreeting();

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")} activeOpacity={0.8}>
            <View style={{
              width: 52, height: 52, borderRadius: 26,
              borderWidth: 3, borderColor: colors.dividerColor,
              alignItems: "center", justifyContent: "center", marginRight: 12,
            }}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: GREEN }]}>
                  <Text style={styles.avatarText}>{initial}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerHello, { color: colors.subTextColor }]}>{greeting},</Text>
            <Text style={[styles.headerName,  { color: colors.textColor }]}>{firstName}! 👋</Text>
          </View>
        </Animated.View>

        {/* CARD PONTOS */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: card1Opacity,
          transform: [{ translateY: card1Y }],
        }]}>
          <View style={styles.pointsRow}>
            <View style={[styles.pointsIconWrap, { backgroundColor: colors.iconBg }]}>
              <IconStar color={GREEN} size={28} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.pointsTitle, { color: colors.textColor }]}>
                {totalPoints === 0 ? "Comece a escanear!" : "Você está indo bem!"}
              </Text>
              <Text style={[styles.pointsSub, { color: colors.subTextColor }]}>
                {totalPoints === 0
                  ? "Escaneie seu primeiro item"
                  : "Continue assim e faça a diferença! 💚"}
              </Text>
            </View>
            <View style={styles.pointsNumBlock}>
              <Text style={[styles.pointsNumber, { color: GREEN }]}>{displayPoints}</Text>
              <Text style={[styles.pointsLabel,  { color: colors.subTextColor }]}>pontos</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />

          <View style={styles.rankingLinkRow}>
            <Animated.View style={{ transform: [{ scale: flamePop }] }}>
              <IconFlame
                outer={flameColors.outer}
                innerStart={flameColors.innerStart}
                innerEnd={flameColors.innerEnd}
                size={16}
              />
            </Animated.View>
            <Text style={[styles.rankingLinkText, { color: colors.subTextColor }]}>
              {streakLabel(streak)}
            </Text>
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
          opacity: btnOpacity,
          transform: [{ translateY: btnY }, { scale: pulse }],
          marginBottom: 1,
        }}>
          <TouchableOpacity
            style={[styles.scanBtn, { backgroundColor: GREEN }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Scanner")}
          >
            <IconCamera color="#fff" size={22} />
            <Text style={styles.scanText}>Escanear lixo</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* MISSÃO DO DIA */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: card3Opacity,
          transform: [{ translateY: card3Y }],
        }]}>
          <View style={styles.missionHeader}>
            <View style={[styles.missionIconWrap, { backgroundColor: colors.iconBg }]}>
              <IconTarget color={ORANGE} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.missionLabel, { color: colors.subTextColor }]}>Missão do dia</Text>
              <Text style={[styles.missionText,  { color: colors.textColor }]}>
                Escaneie pelo menos 1 item de cada categoria
              </Text>
            </View>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.progressTrack }]}>
            <View style={[styles.progressBar, { width: "0%", backgroundColor: GREEN }]} />
          </View>
          <View style={styles.progressFooter}>
            <Text style={[styles.progressPct, { color: colors.subTextColor }]}>0%</Text>
            <Text style={[styles.progressPct, { color: colors.subTextColor }]}>0/5 categorias</Text>
          </View>
        </Animated.View>

        {/* RANKING */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: card2Opacity,
          transform: [{ translateY: card2Y }],
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
              {turmaRank ? `#${turmaRank}` : "--"}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />

          <View style={styles.rankItem}>
            <View style={[styles.rankIconWrap, { backgroundColor: colors.iconBg }]}>
              <IconTrophy color={BLUE} size={16} />
            </View>
            <Text style={[styles.rankItemLabel, { color: colors.subTextColor }]}>Escola inteira</Text>
            <Text style={[styles.rankItemNum,   { color: BLUE }]}>
              {schoolRank ? `#${schoolRank}` : "--"}
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
          opacity: card4Opacity,
          transform: [{ translateY: card4Y }],
          overflow: "hidden",
        }]}>
          <View style={styles.factContent}>
            <View style={styles.missionIconWrap}>
              <IconBulb color={colors.factIcon} size={40} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.factTitle, { color: colors.factSubText }]}>Você sabia?</Text>
              <Text style={[styles.factText,  { color: colors.factSubText }]}>{fact}</Text>
            </View>
          </View>
          <Image
            source={require("../../../assets/planet.png")}
            style={styles.planetImg}
            resizeMode="contain"
          />
        </Animated.View>

        {/* ÚLTIMO ESCANEAMENTO */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: card5Opacity,
          transform: [{ translateY: card5Y }],
        }]}>
          <Text style={[styles.lastTitle, { color: colors.subTextColor, marginBottom: 0 }]}>
            Último escaneamento
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.dividerColor, marginBottom: 12, marginTop: 6 }]} />
          {lastScan ? (
            <View style={styles.lastRow}>
              <View style={[styles.lastIconWrap, { backgroundColor: CATEGORY_COLOR[lastScan.category] + "22" }]}>
                <IconRecycle color={CATEGORY_COLOR[lastScan.category]} size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.lastCategory, { color: colors.textColor }]}>
                  {CATEGORY_LABEL[lastScan.category] ?? lastScan.category}
                </Text>
                <Text style={[styles.lastDate, { color: colors.subTextColor }]}>
                  {formatDate(lastScan.createdAt)}
                </Text>
              </View>
              <Text style={[styles.lastPoints, { color: GREEN }]}>+{lastScan.points}</Text>
            </View>
          ) : (
            <Text style={[styles.lastDate, { color: colors.subTextColor, marginTop: 8 }]}>
              Nenhum escaneamento ainda 🌱
            </Text>
          )}
        </Animated.View>

      </ScrollView>
    </View>
  );
}
