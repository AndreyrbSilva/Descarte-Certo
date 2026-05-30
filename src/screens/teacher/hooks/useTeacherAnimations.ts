import { useRef } from "react";
import { Animated } from "react-native";

/**
 * Encapsulates all Animated values and helpers used by TeacherScreen.
 *
 * - Header entrance (opacity + translateY)
 * - Stats bar entrance (opacity + translateY)
 * - Motivation card entrance (opacity + scale)
 * - Streak overview entrance (opacity)
 *
 * Call `playEntrance()` once after data loads to trigger the stagger.
 */
export function useTeacherAnimations() {
  // ── Header ──────────────────────────────────────────────────────────────
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY       = useRef(new Animated.Value(-12)).current;

  // ── Stats bar ───────────────────────────────────────────────────────────
  const statsOpacity = useRef(new Animated.Value(0)).current;
  const statsY       = useRef(new Animated.Value(16)).current;

  // ── Motivation card ─────────────────────────────────────────────────────
  const motivationOpacity = useRef(new Animated.Value(0)).current;
  const motivationScale   = useRef(new Animated.Value(0.95)).current;

  // ── Streak overview ─────────────────────────────────────────────────────
  const streakOpacity = useRef(new Animated.Value(0)).current;

  // ── Entrance sequence ───────────────────────────────────────────────────

  function playEntrance() {
    Animated.stagger(100, [
      // 1) Header fades in + slides down
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1, duration: 350, useNativeDriver: true,
        }),
        Animated.timing(headerY, {
          toValue: 0, duration: 350, useNativeDriver: true,
        }),
      ]),

      // 2) Stats bar fades in + slides up
      Animated.parallel([
        Animated.timing(statsOpacity, {
          toValue: 1, duration: 300, useNativeDriver: true,
        }),
        Animated.timing(statsY, {
          toValue: 0, duration: 300, useNativeDriver: true,
        }),
      ]),

      // 3) Motivation card fades in + scales up
      Animated.parallel([
        Animated.timing(motivationOpacity, {
          toValue: 1, duration: 280, useNativeDriver: true,
        }),
        Animated.spring(motivationScale, {
          toValue: 1, useNativeDriver: true, tension: 60, friction: 8,
        }),
      ]),

      // 4) Streak overview fades in
      Animated.timing(streakOpacity, {
        toValue: 1, duration: 250, useNativeDriver: true,
      }),
    ]).start();
  }

  return {
    headerOpacity,
    headerY,
    statsOpacity,
    statsY,
    motivationOpacity,
    motivationScale,
    streakOpacity,
    playEntrance,
  };
}
