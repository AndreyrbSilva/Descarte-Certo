import { useEffect, useRef } from "react";
import * as NavigationBar from "expo-navigation-bar";
import {
  View,
  Text,
  Animated,
  Easing,
  Image,
  Dimensions,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("window");
const DIAGONAL = Math.sqrt(
  Dimensions.get("window").width ** 2 + height ** 2
);
const BALL_SIZE = 110;

export function SplashScreen() {
  const navigation = useNavigation<any>();
  const isDark = useColorScheme() === "dark";

  // Tema
  const bgColor         = isDark ? "#1a1a1a" : "#ffffff";
  const explosionColor  = isDark ? "#4ed37e" : "#86efac";
  const titleGreenColor = isDark ? "#082010" : "#0a3018";
  const titleDarkColor  = "#111827";
  const taglineColor    = isDark ? "#9ca3af" : "#6b7280";
  const ballColor       = isDark ? "#4ade80" : "#86efac";

  // Valores animados
  const bgOpacity       = useRef(new Animated.Value(0)).current;
  const ballOpacity     = useRef(new Animated.Value(0)).current;
  const logoOpacity     = useRef(new Animated.Value(0)).current;
  const logoScale       = useRef(new Animated.Value(0.4)).current;
  const rippleScale     = useRef(new Animated.Value(0.8)).current;
  const rippleOpacity   = useRef(new Animated.Value(0)).current;
  const explosionScale  = useRef(new Animated.Value(1)).current;
  const explosionOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity     = useRef(new Animated.Value(0)).current;
  const textY           = useRef(new Animated.Value(30)).current;
  const taglineOpacity  = useRef(new Animated.Value(0)).current;
  const taglineY        = useRef(new Animated.Value(20)).current;
  const screenOpacity   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([

      // 1. Fundo
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),

      // 2. Bolinha entra com fade
      Animated.timing(ballOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),

      // 3. Logo pop-in dentro da bolinha
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 160,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),

      // 4. Ripple se expande e some
      Animated.parallel([
        Animated.timing(rippleOpacity, {
          toValue: 0.5,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(rippleScale, {
          toValue: 1.6,
          duration: 300,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(rippleOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(120),

      // 5. Explosão cobre toda a tela
      Animated.parallel([
        Animated.timing(explosionOpacity, {
          toValue: 1,
          duration: 30,
          useNativeDriver: true,
        }),
        Animated.timing(explosionScale, {
          toValue: (DIAGONAL / BALL_SIZE) * 2.2,
          duration: 420,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // 6. Título e tagline entram após a explosão
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(textY, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(100),
          Animated.parallel([
            Animated.timing(taglineOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(taglineY, {
              toValue: 0,
              duration: 200,
              easing: Easing.out(Easing.exp),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]),

      // 7. Tela some e navega pro Login
      Animated.delay(500),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),

    ]).start(() => navigation.replace("Login"));
  }, []);

  return (
    <Animated.View
      style={[styles.root, { backgroundColor: bgColor, opacity: screenOpacity }]}
    >
      <Animated.View
        style={[styles.background, { backgroundColor: bgColor, opacity: bgOpacity }]}
      />

      <Animated.View
        style={[
          styles.ripple,
          { opacity: rippleOpacity, transform: [{ scale: rippleScale }] },
        ]}
      />

      <Animated.View
        style={[
          styles.ball,
          {
            opacity: ballOpacity,
            backgroundColor: ballColor,
            shadowColor: ballColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.explosion,
          {
            backgroundColor: explosionColor,
            opacity: explosionOpacity,
            transform: [{ scale: explosionScale }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.textBlock,
          { opacity: textOpacity, transform: [{ translateY: textY }] },
        ]}
      >
        <View style={styles.titleRow}>
          <Text style={[styles.titleGreen, { color: titleGreenColor }]}>
            Descarte
          </Text>
          <Text style={[styles.titleDark, { color: titleDarkColor }]}>
            {" "}Certo
          </Text>
        </View>
      </Animated.View>

      <Animated.Text
        style={[
          styles.tagline,
          {
            color: taglineColor,
            opacity: taglineOpacity,
            transform: [{ translateY: taglineY }],
          },
        ]}
      >
        RECICLE • PONTUE • TRANSFORME
      </Animated.Text>
    </Animated.View>
  );
}

const GREEN = "#22c55e";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  ripple: {
    position: "absolute",
    width: BALL_SIZE + 40,
    height: BALL_SIZE + 40,
    borderRadius: (BALL_SIZE + 40) / 2,
    borderWidth: 2,
    borderColor: GREEN,
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 20,
  },
  logoContainer: {
    width: BALL_SIZE * 0.65,
    height: BALL_SIZE * 0.65,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  explosion: {
    position: "absolute",
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
  },
  textBlock: {
    position: "absolute",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  titleGreen: {
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: -1,
  },
  titleDark: {
    fontSize: 42,
    fontWeight: "300",
    letterSpacing: -1,
  },
  tagline: {
    position: "absolute",
    bottom: height * 0.18,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 4,
  },
});
