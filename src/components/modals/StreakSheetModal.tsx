import { useEffect, useRef, useState } from "react";
import {
  Modal, View, Text, StyleSheet,
  TouchableWithoutFeedback, Animated, ScrollView,
} from "react-native";

import { IconFlame }       from "../icons";
import { getStreakColors } from "../../hooks/streakColors";
import { useHomeColors }   from "../../hooks/useHomeColors";

const MILESTONES = [1, 3, 7, 14, 30, 45, 60, 90, 120];

const INACTIVE = {
  outer:      "#94a3b8",
  innerStart: "#cbd5e1",
  innerEnd:   "#e2e8f0",
};

type Props = {
  visible: boolean;
  streak:  number;
  onClose: () => void;
};

export function StreakSheetModal({ visible, streak, onClose }: Props) {
  const colors      = useHomeColors();
  const slideY      = useRef(new Animated.Value(300)).current;
  const opacity     = useRef(new Animated.Value(0)).current;
  // mounted controla o Modal — só desmonta após animação de saída terminar
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      // entrada — aguarda o mount antes de animar
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
          Animated.spring(slideY,  { toValue: 0, tension: 70, friction: 11, useNativeDriver: true }),
        ]).start();
      });
    } else {
      // saída — só desmonta quando acabar
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(slideY,  { toValue: 300, duration: 220, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity }]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, {
        backgroundColor: colors.cardBg,
        transform: [{ translateY: slideY }],
      }]}>
        <View style={[styles.handle, { backgroundColor: colors.dividerColor }]} />

        <Text style={[styles.title, { color: colors.textColor }]}>
          Selos de sequência
        </Text>
        <Text style={[styles.sub, { color: colors.subTextColor }]}>
          {streak === 0
            ? "Comece sua sequência escaneando hoje!"
            : `Você está em ${streak} ${streak === 1 ? "dia" : "dias"} seguidos`}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {MILESTONES.map((days, i) => {
            const reached    = streak >= days;
            const fc         = reached ? getStreakColors(days) : INACTIVE;
            const isLast     = i === MILESTONES.length - 1;
            const lineActive = reached && !isLast && streak >= MILESTONES[i + 1];

            return (
              <View key={days} style={styles.itemRow}>
                <View style={styles.item}>
                  <IconFlame
                    outer={fc.outer}
                    innerStart={fc.innerStart}
                    innerEnd={fc.innerEnd}
                    size={40}
                  />
                  <Text style={[
                    styles.days,
                    { color: reached ? fc.outer : colors.subTextColor },
                  ]}>
                    {days}d
                  </Text>
                </View>

                {!isLast && (
                  <View style={[
                    styles.line,
                    { backgroundColor: lineActive ? fc.outer : colors.dividerColor },
                  ]} />
                )}
              </View>
            );
          })}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position:             "absolute",
    bottom:               0,
    left:                 0,
    right:                0,
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    paddingTop:           16,
    paddingBottom:        48,
    shadowColor:          "#000",
    shadowOffset:         { width: 0, height: -4 },
    shadowOpacity:        0.15,
    shadowRadius:         12,
    elevation:            16,
  },
  handle: {
    width:        40,
    height:       4,
    borderRadius: 2,
    alignSelf:    "center",
    marginBottom: 20,
  },
  title: {
    fontSize:          20,
    fontWeight:        "900",
    letterSpacing:     -0.4,
    marginBottom:      4,
    paddingHorizontal: 24,
  },
  sub: {
    fontSize:          13,
    fontWeight:        "500",
    marginBottom:      28,
    paddingHorizontal: 24,
  },
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 24,
    paddingBottom:     8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems:    "center",
  },
  item: {
    alignItems: "center",
    gap:        6,
  },
  line: {
    width:            28,
    height:           2,
    borderRadius:     1,
    marginHorizontal: 6,
    marginBottom:     18,
  },
  days: {
    fontSize:   11,
    fontWeight: "700",
  },
});
