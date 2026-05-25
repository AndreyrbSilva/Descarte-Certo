import { useRef, useEffect, useCallback } from "react";
import { Animated } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export function useHomeAnimations() {
  const headerOpacity  = useRef(new Animated.Value(0)).current;
  const card1Opacity   = useRef(new Animated.Value(0)).current;
  const card1Y         = useRef(new Animated.Value(30)).current;
  const card2Opacity   = useRef(new Animated.Value(0)).current;
  const card2Y         = useRef(new Animated.Value(30)).current;
  const btnOpacity     = useRef(new Animated.Value(0)).current;
  const btnY           = useRef(new Animated.Value(30)).current;
  const card3Opacity   = useRef(new Animated.Value(0)).current;
  const card3Y         = useRef(new Animated.Value(30)).current;
  const card4Opacity   = useRef(new Animated.Value(0)).current;
  const card4Y         = useRef(new Animated.Value(30)).current;
  const card5Opacity   = useRef(new Animated.Value(0)).current;
  const card5Y         = useRef(new Animated.Value(30)).current;
  const pulse          = useRef(new Animated.Value(1)).current;
  const flamePop       = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale      = useRef(new Animated.Value(0.7)).current;
  const flameScale     = useRef(new Animated.Value(0.5)).current;

  function startEntranceAnimation() {
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
  }

  function animateStreakPop() {
    Animated.sequence([
      Animated.timing(flamePop, { toValue: 1.4, duration: 200, useNativeDriver: true }),
      Animated.spring(flamePop, { toValue: 1,   useNativeDriver: true }),
    ]).start();
  }

  function playLevelUpOverlay(onComplete: () => void) {
    overlayOpacity.setValue(0);
    cardScale.setValue(0.7);
    flameScale.setValue(0.5);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1,   duration: 300, useNativeDriver: true }),
        Animated.spring(cardScale,      { toValue: 1,   tension: 100, friction: 7, useNativeDriver: true }),
        Animated.spring(flameScale,     { toValue: 1,   tension: 80,  friction: 5, useNativeDriver: true }),
      ]),
      Animated.delay(3000),
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 0,   duration: 400, useNativeDriver: true }),
        Animated.timing(cardScale,      { toValue: 0.8, duration: 400, useNativeDriver: true }),
      ]),
    ]).start(onComplete);
  }

  return {
    headerOpacity,
    card1Opacity, card1Y,
    card2Opacity, card2Y,
    btnOpacity, btnY,
    card3Opacity, card3Y,
    card4Opacity, card4Y,
    card5Opacity, card5Y,
    pulse,
    flamePop,
    overlayOpacity,
    cardScale,
    flameScale,
    startEntranceAnimation,
    animateStreakPop,
    playLevelUpOverlay,
  };
}
