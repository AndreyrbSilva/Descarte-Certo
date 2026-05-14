import { useEffect, useRef, useState } from "react";
import {
  Modal, View, Text, StyleSheet,
  TouchableWithoutFeedback, Animated,
} from "react-native";

import { useHomeColors } from "../../hooks/useHomeColors";
import {
  IconStar, IconRecycle, IconMedal, IconTrophy, IconCrown,
  IconFlame, IconTarget, IconTrend, IconShield,
  IconDiamond, IconRainbow, IconLightning, IconShieldCheck,
} from "../icons";
import type { NewAchievement } from "../../services/achievementService";

// ── Cor por tipo de troféu ──────────────────────────────
const TYPE_COLORS: Record<string, string> = {
  total_scans:         "#22c55e",
  total_points:        "#f59e0b",
  streak:              "#ef4444",
  ranking_turma:       "#f97316",
  ranking_escola:      "#3b82f6",
  ranking_consistency: "#8b5cf6",
  category_diversity:  "#06b6d4",
  missions_completed:  "#ec4899",
};

// ── Mapeamento ícone → componente ───────────────────────
function AchievementIcon({ icon, color, size }: { icon: string; color: string; size: number }) {
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

type Props = {
  achievement: NewAchievement | null;
  visible: boolean;
  onClose: () => void;
};

export function AchievementUnlockedModal({ achievement, visible, onClose }: Props) {
  const colors       = useHomeColors();
  const overlayOp    = useRef(new Animated.Value(0)).current;
  const cardScale    = useRef(new Animated.Value(0.6)).current;
  const iconScale    = useRef(new Animated.Value(0.3)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const badgeY       = useRef(new Animated.Value(10)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible && achievement) {
      setMounted(true);
      requestAnimationFrame(() => {
        overlayOp.setValue(0);
        cardScale.setValue(0.6);
        iconScale.setValue(0.3);
        badgeOpacity.setValue(0);
        badgeY.setValue(10);

        Animated.sequence([
          // Entrada
          Animated.parallel([
            Animated.timing(overlayOp, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.spring(cardScale, { toValue: 1, tension: 100, friction: 7, useNativeDriver: true }),
            Animated.spring(iconScale, { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }),
          ]),
          // Badge aparece com delay
          Animated.parallel([
            Animated.timing(badgeOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
            Animated.timing(badgeY, { toValue: 0, duration: 250, useNativeDriver: true }),
          ]),
          // Espera
          Animated.delay(2800),
          // Saída
          Animated.parallel([
            Animated.timing(overlayOp, { toValue: 0, duration: 400, useNativeDriver: true }),
            Animated.timing(cardScale, { toValue: 0.8, duration: 400, useNativeDriver: true }),
          ]),
        ]).start(() => {
          setMounted(false);
          onClose();
        });
      });
    } else if (!visible) {
      Animated.parallel([
        Animated.timing(overlayOp, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(cardScale, { toValue: 0.8, duration: 250, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, achievement]);

  if (!mounted || !achievement) return null;

  const accentColor = TYPE_COLORS[achievement.type] ?? "#22c55e";

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: overlayOp }]} />
      </TouchableWithoutFeedback>

      <Animated.View style={styles.centeredWrap} pointerEvents="box-none">
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          transform: [{ scale: cardScale }],
        }]}>
          {/* Ícone com glow */}
          <Animated.View style={[styles.iconCircle, {
            backgroundColor: accentColor + "18",
            transform: [{ scale: iconScale }],
          }]}>
            <View style={[styles.iconInner, { backgroundColor: accentColor + "25" }]}>
              <AchievementIcon icon={achievement.icon} color={accentColor} size={48} />
            </View>
          </Animated.View>

          {/* Label */}
          <View style={[styles.labelBadge, { backgroundColor: accentColor + "18" }]}>
            <Text style={[styles.labelText, { color: accentColor }]}>Novo Troféu!</Text>
          </View>

          {/* Título */}
          <Text style={[styles.title, { color: colors.textColor }]}>
            {achievement.title}
          </Text>

          {/* Descrição */}
          <Text style={[styles.description, { color: colors.subTextColor }]}>
            {achievement.description}
          </Text>

          {/* Badge de pontos */}
          {achievement.reward > 0 && (
            <Animated.View style={[styles.rewardBadge, {
              backgroundColor: accentColor,
              opacity: badgeOpacity,
              transform: [{ translateY: badgeY }],
            }]}>
              <Text style={styles.rewardText}>+{achievement.reward} pts</Text>
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  centeredWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems:     "center",
    justifyContent: "center",
    zIndex:         100,
  },
  card: {
    width:         290,
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
  iconCircle: {
    width:          96,
    height:         96,
    borderRadius:   48,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   4,
  },
  iconInner: {
    width:          72,
    height:         72,
    borderRadius:   36,
    alignItems:     "center",
    justifyContent: "center",
  },
  labelBadge: {
    paddingHorizontal: 14,
    paddingVertical:   5,
    borderRadius:      12,
  },
  labelText: {
    fontSize:   11,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    fontSize:       22,
    fontWeight:     "900",
    letterSpacing:  -0.5,
    textAlign:      "center",
  },
  description: {
    fontSize:   13,
    fontWeight: "500",
    textAlign:  "center",
    lineHeight: 18,
  },
  rewardBadge: {
    paddingHorizontal: 18,
    paddingVertical:   8,
    borderRadius:      20,
    marginTop:         4,
  },
  rewardText: {
    color:      "#fff",
    fontSize:   14,
    fontWeight: "800",
  },
});
