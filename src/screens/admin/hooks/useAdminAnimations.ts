import { useRef, useCallback } from "react";
import { Animated, Easing } from "react-native";

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

  // ── Tab indicator (uses translateX with useNativeDriver: true) ────────────
  const tabAnim = useRef(new Animated.Value(0)).current;
  const tabBarHalfWidth = useRef(0);

  // ── View mode indicator (uses translateX with useNativeDriver: true) ──────
  const viewModeAnim = useRef(new Animated.Value(0)).current;
  const viewModeHalfWidth = useRef(0);

  // ── Content opacity (simple fade, nativeDriver) ───────────────────────────
  const contentOpacity = useRef(new Animated.Value(1)).current;

  // ── Filter content opacity ────────────────────────────────────────────────
  const filterContentOpacity = useRef(new Animated.Value(1)).current;

  // ── Users tab: item cards (staggered entrance) ────────────────────────────
  const cardAnims = useRef(
    Array.from({ length: 40 }, () => ({
      opacity: new Animated.Value(0),
      y:       new Animated.Value(16),
    }))
  ).current;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const slide = useCallback(
    (o: Animated.Value, y: Animated.Value) =>
      Animated.parallel([
        Animated.timing(o, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.timing(y, { toValue: 0, duration: 320, useNativeDriver: true }),
      ]),
    [],
  );

  /** Initial entrance animation */
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

  /** Store measured tab bar width (called from onLayout) */
  function setTabBarWidth(width: number) {
    tabBarHalfWidth.current = (width - 8) / 2; // subtract padding
  }

  /** Store measured view mode toggle width (called from onLayout) */
  function setViewModeWidth(width: number) {
    viewModeHalfWidth.current = (width - 8) / 2;
  }

  /** Slide the main tab indicator — useNativeDriver: true, zero stutter */
  function animateTabIndicator(nextTab: "dashboard" | "users") {
    Animated.timing(tabAnim, {
      toValue:         nextTab === "dashboard" ? 0 : tabBarHalfWidth.current,
      duration:        250,
      easing:          Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }

  /** Slide the view mode indicator — useNativeDriver: true */
  function animateViewModeIndicator(nextMode: "list" | "grouped") {
    Animated.timing(viewModeAnim, {
      toValue:         nextMode === "list" ? 0 : viewModeHalfWidth.current,
      duration:        250,
      easing:          Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }

  /** Quick content fade for tab switch — all nativeDriver */
  function crossFadeContent(onSwap: () => void) {
    Animated.timing(contentOpacity, {
      toValue: 0, duration: 80, useNativeDriver: true,
    }).start(() => {
      onSwap();
      Animated.timing(contentOpacity, {
        toValue: 1, duration: 150, useNativeDriver: true,
      }).start();
    });
  }

  /** Quick content fade for filter/viewMode switch */
  function crossFadeFilterContent(onSwap: () => void) {
    Animated.timing(filterContentOpacity, {
      toValue: 0, duration: 60, useNativeDriver: true,
    }).start(() => {
      onSwap();
      Animated.timing(filterContentOpacity, {
        toValue: 1, duration: 120, useNativeDriver: true,
      }).start();
    });
  }

  /** Staggered entrance for user card items */
  function animateCardEntrance(count: number) {
    cardAnims.forEach((a) => {
      a.opacity.setValue(0);
      a.y.setValue(16);
    });
    const toAnimate = Math.min(count, cardAnims.length);
    cardAnims.slice(0, toAnimate).forEach((a, i) => {
      Animated.parallel([
        Animated.timing(a.opacity, {
          toValue: 1, duration: 250, delay: i * 30, useNativeDriver: true,
        }),
        Animated.timing(a.y, {
          toValue: 0, duration: 250, delay: i * 30, useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
      ]).start();
    });
  }

  return {
    headerAnim,
    s0Opacity, s0Y,
    s1Opacity, s1Y,
    s2Opacity, s2Y,
    s3Opacity, s3Y,
    listOpacity, listY,
    startEntranceAnimation,
    // Tab indicator (translateX based)
    tabAnim,
    setTabBarWidth,
    animateTabIndicator,
    // View mode indicator (translateX based)
    viewModeAnim,
    setViewModeWidth,
    animateViewModeIndicator,
    // Content fades
    contentOpacity,
    crossFadeContent,
    filterContentOpacity,
    crossFadeFilterContent,
    // Card stagger
    cardAnims,
    animateCardEntrance,
  };
}
