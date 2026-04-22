import { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function SplashScreen() {
  const navigation = useNavigation<any>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  const pulseDot = (dot: Animated.Value, delay: number) =>
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dot, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    pulseDot(dot1, 0).start();
    pulseDot(dot2, 200).start();
    pulseDot(dot3, 400).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeOutAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => navigation.replace("Login"));
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-180deg", "0deg"],
  });

  return (
    <Animated.View
      style={{ opacity: fadeOutAnim }}
      className="flex-1 items-center justify-center bg-white"
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { rotate }],
        }}
      >
        <Image
          source={require("../../../assets/logo.png")}
          className="w-32 h-32"
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={{ opacity: fadeAnim }}
        className="items-center mt-6"
      >
        <Text className="text-4xl font-bold text-primary">Descarte</Text>
        <Text className="text-4xl font-bold text-secondary">Certo</Text>
        <Text className="text-sm text-gray-400 mt-2">
          Recicle. Pontue. Faça a diferença.
        </Text>
      </Animated.View>

      <Animated.View
        style={{ opacity: fadeAnim }}
        className="flex-row gap-3 mt-10"
      >
        <Animated.View
          style={{ opacity: dot1 }}
          className="w-3 h-3 rounded-full bg-primary"
        />
        <Animated.View
          style={{ opacity: dot2 }}
          className="w-3 h-3 rounded-full bg-secondary"
        />
        <Animated.View
          style={{ opacity: dot3 }}
          className="w-3 h-3 rounded-full bg-accent"
        />
      </Animated.View>
    </Animated.View>
  );
}
