import { useEffect, useRef, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Animated, StatusBar, Modal,
} from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigation } from "@react-navigation/native";

import { useAuthStore }   from "../../store/useAuthStore";
import { logout }         from "../../services/authService";
import { fetchHomeData }  from "../../services/homeService";
import { useHomeColors }  from "../../hooks/useHomeColors";
import { styles }         from "./homeStyles";
import {
  IconTrophy, IconTrend, IconCamera,
  IconTarget, IconBulb, IconRecycle, IconLogout, IconUser
} from "../../components/icons";

const GREEN      = "#22c55e";
const GREEN_DARK = "#16a34a";
const ORANGE     = "#f97316";
const BLUE       = "#3b82f6";

const FACTS = [
  "O Brasil recicla 97% das latas de alumínio, um dos maiores índices do mundo!",
  "Uma folha de papel pode ser reciclada até 7 vezes!",
  "Reciclar 1kg de plástico economiza até 2kg de petróleo!",
  "O lixo orgânico pode virar adubo em apenas 3 meses!",
  "Cada brasileiro gera em média 1kg de lixo por dia!",
];

type LastScan = {
  category: string;
  createdAt: string;
  points: number;
} | null;

const CATEGORY_LABEL: Record<string, string> = {
  plastico: "Plástico",
  papel:    "Papel",
  metal:    "Metal",
  organico: "Orgânico",
  vidro:    "Vidro",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const user       = useAuthStore((s) => s.user);
  const colors     = useHomeColors();

  const [totalPoints,   setTotalPoints]   = useState(0);
  const [displayPoints, setDisplayPoints] = useState(0);
  const [schoolRank,    setSchoolRank]    = useState<number | null>(null);
  const [turmaRank,     setTurmaRank]     = useState<number | null>(null);
  const [lastScan,      setLastScan]      = useState<LastScan>(null);
  const [fact,          setFact]          = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const card1Opacity  = useRef(new Animated.Value(0)).current;
  const card1Y        = useRef(new Animated.Value(40)).current;
  const card2Opacity  = useRef(new Animated.Value(0)).current;
  const card2Y        = useRef(new Animated.Value(40)).current;
  const btnOpacity    = useRef(new Animated.Value(0)).current;
  const btnY          = useRef(new Animated.Value(40)).current;
  const card3Opacity  = useRef(new Animated.Value(0)).current;
  const card3Y        = useRef(new Animated.Value(40)).current;
  const card4Opacity  = useRef(new Animated.Value(0)).current;
  const card4Y        = useRef(new Animated.Value(40)).current;
  const card5Opacity  = useRef(new Animated.Value(0)).current;
  const card5Y        = useRef(new Animated.Value(40)).current;
  const pulse         = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(GREEN);
    NavigationBar.setButtonStyleAsync("light");

    // fact aleatório
    setFact(FACTS[Math.floor(Math.random() * FACTS.length)]);

    const makeSlide = (opacity: Animated.Value, y: Animated.Value) =>
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(y,       { toValue: 0, duration: 350, useNativeDriver: true }),
      ]);

    Animated.stagger(90, [
      Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      makeSlide(card1Opacity, card1Y),
      makeSlide(card2Opacity, card2Y),
      makeSlide(btnOpacity,   btnY),
      makeSlide(card3Opacity, card3Y),
      makeSlide(card4Opacity, card4Y),
      makeSlide(card5Opacity, card5Y),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.03, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    ).start();

    // busca dados reais
    fetchHomeData().then((data) => {
      setTotalPoints(data.totalPoints);
      setSchoolRank(data.schoolRank);
      setTurmaRank(data.turmaRank);
      setLastScan(data.lastScan);

      // contador animado
      let val  = 0;
      const step  = Math.ceil(data.totalPoints / 40);
      const timer = setInterval(() => {
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

  async function confirmLogout() {
    setShowLogoutModal(false);
    await logout();
    navigation.replace("Login");
  }

  const firstName = user?.name?.split(" ")[0] ?? "Aluno";
  const initial   = firstName[0].toUpperCase();

  return (
    <View style={[styles.root, { backgroundColor: GREEN }]}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <View style={[styles.avatar, { backgroundColor: colors.avatarBg }]}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerHello}>Olá,</Text>
            <Text style={styles.headerName}>{firstName}! 👋</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={[styles.logoutBtn, { marginRight: 8 }]}>
            <IconUser color="#fff" size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.logoutBtn, { backgroundColor: colors.logoutBg }]}
            onPress={() => setShowLogoutModal(true)}
            activeOpacity={0.7}
          >
            <IconLogout color="#fff" size={18} />
          </TouchableOpacity>
        </Animated.View>

        {/* ── CARD PONTOS ── */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: card1Opacity,
          transform: [{ translateY: card1Y }],
        }]}>
          <View style={styles.levelRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.levelLabel, { color: colors.subTextColor }]}>Seus pontos</Text>
              <Text style={[styles.levelName,  { color: ORANGE }]}>
                {totalPoints === 0 ? "Comece a escanear!" : "Continue assim!"}
              </Text>
              <View style={styles.trophyRow}>
                <IconTrophy color={ORANGE} size={14} />
                <Text style={[styles.trophyText, { color: ORANGE }]}>
                  {totalPoints === 0 ? "  Nenhum ponto ainda" : "  Arrasando! 🔥"}
                </Text>
              </View>
            </View>
            <View style={styles.pointsBlock}>
              <Text style={[styles.pointsNumber, { color: colors.textColor }]}>{displayPoints}</Text>
              <Text style={[styles.pointsLabel,  { color: colors.subTextColor }]}>pontos</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── RANKINGS ── */}
        <Animated.View style={[styles.rankRow, {
          opacity: card2Opacity,
          transform: [{ translateY: card2Y }],
        }]}>
          <View style={[styles.rankCard, { backgroundColor: ORANGE }]}>
            <IconTrend color="#fff" size={22} />
            <Text style={styles.rankSub}>Sua Turma</Text>
            <Text style={styles.rankNum}>
              {turmaRank ? `#${turmaRank}` : "--"}
            </Text>
          </View>
          <View style={[styles.rankCard, { backgroundColor: BLUE }]}>
            <IconTrophy color="#fff" size={22} />
            <Text style={styles.rankSub}>Escola Inteira</Text>
            <Text style={styles.rankNum}>
              {schoolRank ? `#${schoolRank}` : "--"}
            </Text>
          </View>
        </Animated.View>

        {/* ── BOTÃO ESCANEAR ── */}
        <Animated.View style={{
          opacity: btnOpacity,
          transform: [{ translateY: btnY }, { scale: pulse }],
          marginBottom: 14,
        }}>
          <TouchableOpacity
            style={[styles.scanBtn, { backgroundColor: GREEN_DARK }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Scanner")}
          >
            <IconCamera color="#fff" size={22} />
            <Text style={styles.scanText}>  Escanear Lixo</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── MISSÃO DO DIA ── */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: card3Opacity,
          transform: [{ translateY: card3Y }],
        }]}>
          <View style={styles.missionHeader}>
            <View style={[styles.missionIconWrap, { backgroundColor: colors.missionIconBg }]}>
              <IconTarget color={ORANGE} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.missionLabel, { color: colors.subTextColor }]}>Missão do Dia</Text>
              <Text style={[styles.missionText,  { color: colors.textColor }]}>
                Escaneie pelo menos 1 item de cada categoria
              </Text>
            </View>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.progressTrack }]}>
            <View style={[styles.progressBar, { width: "0%", backgroundColor: GREEN }]} />
          </View>
          <Text style={[styles.progressPct, { color: colors.subTextColor }]}>
            0% concluído
          </Text>
        </Animated.View>

        {/* ── VOCÊ SABIA ── */}
        <Animated.View style={[styles.card, styles.factCard, {
          opacity: card4Opacity,
          transform: [{ translateY: card4Y }],
        }]}>
          <View style={styles.factTitleRow}>
            <IconBulb color="#fff" size={16} />
            <Text style={styles.factTitle}>  Você Sabia?</Text>
          </View>
          <Text style={styles.factText}>{fact}</Text>
        </Animated.View>

        {/* ── ÚLTIMO ESCANEAMENTO ── */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: card5Opacity,
          transform: [{ translateY: card5Y }],
        }]}>
          <Text style={[styles.lastLabel, { color: colors.subTextColor }]}>Último escaneamento</Text>
          {lastScan ? (
            <View style={styles.lastRow}>
              <View style={[styles.lastIconWrap, { backgroundColor: colors.lastIconBg }]}>
                <IconRecycle color={GREEN} size={20} />
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
            <Text style={[styles.lastDate, { color: colors.subTextColor }]}>
              Nenhum escaneamento ainda — que tal começar agora? 🌱
            </Text>
          )}
        </Animated.View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── MODAL LOGOUT ── */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBg }]}>
            <View style={styles.modalIconWrap}>
              <IconLogout color={GREEN} size={28} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textColor }]}>
              Sair da conta?
            </Text>
            <Text style={[styles.modalSub, { color: colors.subTextColor }]}>
              Você precisará entrar novamente para acessar o app.
            </Text>
            <TouchableOpacity
              style={styles.modalBtnConfirm}
              onPress={confirmLogout}
              activeOpacity={0.85}
            >
              <Text style={styles.modalBtnConfirmText}>Sair</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtnCancel, { borderColor: colors.dividerColor }]}
              onPress={() => setShowLogoutModal(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalBtnCancelText, { color: colors.textColor }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
