import { useRef, useEffect } from "react";
import { Animated, Easing } from "react-native";

export function useLoginAnimations() {
  const headerAnim   = useRef(new Animated.Value(0)).current;
  const logoAnim     = useRef(new Animated.Value(0)).current;
  const cardAnim     = useRef(new Animated.Value(40)).current;
  const cardOpacity  = useRef(new Animated.Value(0)).current;
  const rememberAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1, duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(logoAnim, {
          toValue: 1, tension: 120, friction: 7, useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 1, duration: 350, useNativeDriver: true,
          }),
          Animated.timing(cardAnim, {
            toValue: 0, duration: 350,
            easing: Easing.out(Easing.back(1.1)),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const headerOpacity = headerAnim.interpolate({
    inputRange: [0, 1], outputRange: [0, 1],
  });

  const toggleRemember = (value: boolean) => {
    Animated.spring(rememberAnim, {
      toValue: value ? 1 : 0,
      tension: 120, friction: 8, useNativeDriver: true,
    }).start();
  };

  const rememberScale = rememberAnim.interpolate({
    inputRange: [0, 1], outputRange: [1, 1.1],
  });

  return {
    headerOpacity,
    logoAnim,
    cardAnim,
    cardOpacity,
    rememberScale,
    toggleRemember,
  };
}
