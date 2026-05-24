import { useRef, useCallback } from "react";
import { Animated } from "react-native";

export function useAdminAnimations() {
  // ── Header ────────────────────────────────────────────────────────────────
  const headerAnim = useRef(new Animated.Value(0)).current;

  // ── Stat cards ────────────────────────────────────────────────────────────
  const s0Opacity = useRef(new Animated.Value(0)).current;
  const s0Y       = useRef(new Animated.Value(24)).current;
  const s1Opacity = useRef(new Animated.Value(0)).current;
  const s1Y       = useRef(new Animated.Value(24)).current;
  const s2Opacity = useRef(new Animated.Value(0)).current;
  const s2Y       = useRef(new Animated.Value(24)).current;
  const s3Opacity = useRef(new Animated.Value(0)).current;
  const s3Y       = useRef(new Animated.Value(24)).current;

  // ── List / sections ───────────────────────────────────────────────────────
  const listOpacity = useRef(new Animated.Value(0)).current;
  const listY       = useRef(new Animated.Value(24)).current;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const slide = useCallback(
    (o: Animated.Value, y: Animated.Value) =>
      Animated.parallel([
        Animated.timing(o, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.timing(y, { toValue: 0, duration: 320, useNativeDriver: true }),
      ]),
    [],
  );

  function startEntranceAnimation() {
    Animated.stagger(60, [
      Animated.timing(headerAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      slide(s0Opacity, s0Y),
      slide(s1Opacity, s1Y),
      slide(s2Opacity, s2Y),
      slide(s3Opacity, s3Y),
      slide(listOpacity, listY),
    ]).start();
  }

  return {
    headerAnim,
    s0Opacity, s0Y,
    s1Opacity, s1Y,
    s2Opacity, s2Y,
    s3Opacity, s3Y,
    listOpacity, listY,
    startEntranceAnimation,
  };
}
