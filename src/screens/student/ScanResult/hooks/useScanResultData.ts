import { useEffect, useRef } from "react";
import { Animated, Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import * as Haptics from "expo-haptics";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useAuthStore } from "../../../../store/useAuthStore";
import { getLevelInfo } from "../../Profile/hooks/useProfileData";
import { useNotificationScheduler } from "../../../../hooks/useNotificationScheduler";

const GREEN = "#22c55e";

// ── Streak ───────────────────────────────────────────────
const STREAK_THRESHOLDS = [0, 1, 3, 7, 14, 21, 30, 45, 60, 90, 120];

function streakLevel(streak: number): number {
  let level = 0;
  for (const t of STREAK_THRESHOLDS) {
    if (streak >= t) level = t;
    else break;
  }
  return level;
}

export const STREAK_MESSAGES: Record<number, string> = {
  0:   "Primeira vez? Boa!",
  1:   "Começou a sequência!",
  3:   "Tá pegando fogo!",
  7:   "Uma semana inteira!",
  14:  "Duas semanas seguidas!",
  21:  "Você é imparável!",
  30:  "Um mês de reciclagem!",
  45:  "Lenda em formação!",
  60:  "Ninguém te para!",
  90:  "Herói da reciclagem!",
  120: "Lenda absoluta!",
};

export function getStreakMessage(streak: number): string {
  const level = streakLevel(streak);
  return STREAK_MESSAGES[level] ?? "Continue assim!";
}

// ── Categorias ───────────────────────────────────────────
export const CATEGORY_LABEL: Record<string, string> = {
  plastico: "Plástico",
  papel:    "Papel",
  metal:    "Metal",
  organico: "Orgânico",
  vidro:    "Vidro",
};

export const CATEGORY_BIN: Record<string, { color: string; label: string; material: string }> = {
  plastico: { color: "#ef4444", label: "Lixeira Vermelha", material: "para Plásticos" },
  papel:    { color: "#3b82f6", label: "Lixeira Azul",     material: "para Papéis" },
  metal:    { color: "#eab308", label: "Lixeira Amarela",  material: "para Metais" },
  organico: { color: "#92400e", label: "Lixeira Marrom",   material: "para Orgânicos" },
  vidro:    { color: "#22c55e", label: "Lixeira Verde",    material: "para Vidros" },
};

// ── Curiosidades por categoria ───────────────────────────
export const CATEGORY_CURIOSITIES: Record<string, string[]> = {
  plastico: [
    "Plásticos levam até 400 anos para se decompor na natureza.",
    "Já foram encontrados microplásticos até na neve do Monte Everest!",
    "Apenas 9% do plástico produzido no mundo foi reciclado até hoje.",
    "Uma garrafa PET reciclada pode virar tecido para roupas!",
  ],
  papel: [
    "Uma tonelada de papel reciclado salva 20 árvores!",
    "O papel pode ser reciclado de 5 a 7 vezes antes de perder qualidade.",
    "Uma árvore produz cerca de 8.000 folhas de papel!",
    "Reciclar papel economiza 70% da energia comparado a produzir novo.",
  ],
  metal: [
    "O alumínio pode ser reciclado infinitas vezes sem perder qualidade!",
    "Uma latinha reciclada economiza energia pra assistir TV por 3 horas!",
    "O Brasil é campeão mundial em reciclagem de latas de alumínio!",
    "Reciclar uma lata gasta 95% menos energia que produzir uma nova.",
  ],
  organico: [
    "Lixo orgânico pode virar adubo e ajudar a natureza a crescer!",
    "Minhocas podem comer metade do seu peso por dia em compostagem!",
    "A compostagem reduz até 50% do lixo de uma casa!",
    "O gás do lixo orgânico pode ser usado como combustível limpo!",
  ],
  vidro: [
    "O vidro pode ser reciclado infinitas vezes sem perder qualidade!",
    "O vidro demora mais de 1 milhão de anos pra se decompor na natureza!",
    "Reciclar vidro economiza 30% da energia comparado a produzir novo.",
    "O vidro é 100% reciclável e pode voltar às prateleiras em 30 dias!",
  ],
};

export function getRandomCuriosity(category?: string): string {
  const pool = category ? CATEGORY_CURIOSITIES[category] : null;
  if (!pool || pool.length === 0) return "Continue reciclando para aprender mais!";
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Mensagens motivacionais (header celebratório) ────────
const CELEBRATION_MESSAGES = [
  "Arrasou!",
  "Mandou bem!",
  "Incrível!",
  "Boa demais!",
  "Show!",
  "Excelente!",
  "Perfeito!",
  "Parabéns!",
];

export function getRandomCelebration(): string {
  return CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
}

// ── Hook principal ───────────────────────────────────────
export function useScanResultData() {
  const navigation   = useNavigation<any>();
  const route        = useRoute<any>();
  const setStreak    = useAuthStore((s) => s.setStreak);
  const setLeveledUp = useAuthStore((s) => s.setLeveledUp);
  const prevStreak   = useAuthStore((s) => s.streak);

  const { result, photoUri, error } = route.params ?? {};

  const { onScanCompleted } = useNotificationScheduler();

  // ── Animations ──────────────────────────────────────
  const headerAnim      = useRef(new Animated.Value(0)).current;
  const cardAnim        = useRef(new Animated.Value(60)).current;
  const cardOpacity     = useRef(new Animated.Value(0)).current;
  const pointsScale     = useRef(new Animated.Value(0.5)).current;
  const pointsOpacity   = useRef(new Animated.Value(0)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;
  const streakAnim      = useRef(new Animated.Value(0)).current;
  const xpBarAnim       = useRef(new Animated.Value(0)).current;
  const confettiAnim    = useRef(new Animated.Value(0)).current;
  const btnPulse        = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(GREEN);
    NavigationBar.setButtonStyleAsync("light");

    // Sequência principal de animações
    Animated.sequence([
      // 1. Header aparece
      Animated.timing(headerAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      // 2. Confetti + celebração
      Animated.parallel([
        Animated.spring(pointsScale,   { toValue: 1, tension: 120, friction: 6, useNativeDriver: true }),
        Animated.timing(pointsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(confettiAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      // 3. Celebration text bounce
      Animated.spring(celebrationAnim, { toValue: 1, tension: 100, friction: 5, useNativeDriver: true }),
      // 4. Card sobe
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(cardAnim,    { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
      // 5. Streak aparece
      Animated.spring(streakAnim, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
    ]).start(() => {
      // Haptic feedback quando as animações de entrada completam
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Trigger notifications for scan result (achievements, milestones, ranking, missions)
      if (result) {
        onScanCompleted({
          streak:          result.streak ?? 0,
          totalPoints:     result.totalPoints ?? 0,
          newAchievements: result.newAchievements ?? [],
        });
      }
    });

    // XP bar (non-native driver pra animar width)
    if (result?.totalPoints != null) {
      const info = getLevelInfo(result.totalPoints);
      // Anima de 0 → progresso real com delay
      Animated.timing(xpBarAnim, {
        toValue: info.progress,
        duration: 1000,
        delay: 1200,
        useNativeDriver: false,
      }).start();
    }

    // Pulse loop no botão principal
    Animated.loop(
      Animated.sequence([
        Animated.timing(btnPulse, { toValue: 1.04, duration: 1000, useNativeDriver: true }),
        Animated.timing(btnPulse, { toValue: 1,    duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // ── Dados derivados ────────────────────────────────
  const newStreak      = result?.streak ?? 0;
  const streakLevelUp  = streakLevel(newStreak) > streakLevel(prevStreak);
  const streakMessage  = getStreakMessage(newStreak);
  const celebration    = useRef(getRandomCelebration()).current;
  const curiosity      = useRef(getRandomCuriosity(result?.category)).current;
  const levelInfo      = result?.totalPoints != null ? getLevelInfo(result.totalPoints) : null;

  // Calcula o próximo threshold do streak
  const nextStreakThreshold = STREAK_THRESHOLDS.find((t) => t > newStreak) ?? null;

  const xpWidth = xpBarAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ["0%", "100%"],
  });

  function goHome() {
    setStreak(newStreak);
    if (streakLevelUp) setLeveledUp(true);
    navigation.navigate("Tabs", { screen: "Home" });
  }

  function goScan() {
    setStreak(newStreak);
    if (streakLevelUp) setLeveledUp(true);
    navigation.navigate("Tabs", { screen: "Scanner" });
  }

  function goRanking() {
    setStreak(newStreak);
    if (streakLevelUp) setLeveledUp(true);
    navigation.navigate("Tabs", { screen: "Ranking" });
  }

  return {
    navigation,
    result,
    photoUri,
    error,
    // Animações
    headerAnim,
    cardAnim,
    cardOpacity,
    pointsScale,
    pointsOpacity,
    celebrationAnim,
    streakAnim,
    xpWidth,
    confettiAnim,
    btnPulse,
    // Dados derivados
    newStreak,
    streakLevelUp,
    streakMessage,
    nextStreakThreshold,
    celebration,
    curiosity,
    levelInfo,
    // Navegação
    goHome,
    goScan,
    goRanking,
  };
}
