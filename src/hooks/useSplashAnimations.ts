import { useRef, useEffect } from "react";
import { Animated, Easing, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const DIAGONAL  = Math.sqrt(width ** 2 + height ** 2);
const BALL_SIZE = 110;

export function useSplashAnimations(onFinish: () => void) {
  const bgOpacity        = useRef(new Animated.Value(0)).current;
  const ballOpacity      = useRef(new Animated.Value(0)).current;
  const logoOpacity      = useRef(new Animated.Value(0)).current;
  const logoScale        = useRef(new Animated.Value(0.4)).current;
  const rippleScale      = useRef(new Animated.Value(0.8)).current;
  const rippleOpacity    = useRef(new Animated.Value(0)).current;
  const explosionScale   = useRef(new Animated.Value(1)).current;
  const explosionOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity      = useRef(new Animated.Value(0)).current;
  const textY            = useRef(new Animated.Value(30)).current;
  const taglineOpacity   = useRef(new Animated.Value(0)).current;
  const taglineY         = useRef(new Animated.Value(20)).current;
  const screenOpacity    = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(bgOpacity,   { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(ballOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.spring(logoScale,   { toValue: 1, tension: 160, friction: 6, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(rippleOpacity, { toValue: 0.5, duration: 120, useNativeDriver: true }),
        Animated.timing(rippleScale,   { toValue: 1.6, duration: 300, easing: Easing.out(Easing.exp), useNativeDriver: true }),
        Animated.timing(rippleOpacity, { toValue: 0,   duration: 300, useNativeDriver: true }),
      ]),
      Animated.delay(120),
      Animated.parallel([
        Animated.timing(explosionOpacity, { toValue: 1, duration: 30, useNativeDriver: true }),
        Animated.timing(explosionScale,   {
          toValue: (DIAGONAL / BALL_SIZE) * 2.2,
          duration: 420,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(textY,       { toValue: 0, duration: 250, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(100),
          Animated.parallel([
            Animated.timing(taglineOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(taglineY,       { toValue: 0, duration: 200, easing: Easing.out(Easing.exp), useNativeDriver: true }),
          ]),
        ]),
      ]),
      Animated.delay(500),
      Animated.timing(screenOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(onFinish);
  }, []);

  return {
    bgOpacity, ballOpacity, logoOpacity, logoScale,
    rippleScale, rippleOpacity, explosionScale, explosionOpacity,
    textOpacity, textY, taglineOpacity, taglineY, screenOpacity,
    BALL_SIZE,
    EXPLOSION_SCALE: (DIAGONAL / BALL_SIZE) * 2.2,
  };
}
