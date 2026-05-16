import { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GREEN } from "../../theme/colors";

const { width, height } = Dimensions.get("window");
const CIRCLE = 90;

export function RegisterSuccessScreen() {
  const navigation = useNavigation<any>();

  const circleScale   = useRef(new Animated.Value(0)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;
  const checkOpacity  = useRef(new Animated.Value(0)).current;
  const checkScale    = useRef(new Animated.Value(0.5)).current;
  const bgScale       = useRef(new Animated.Value(0)).current;
  const bgOpacity     = useRef(new Animated.Value(0)).current;
  const textOpacity   = useRef(new Animated.Value(0)).current;
  const textY         = useRef(new Animated.Value(20)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Círculo pop-in
      Animated.parallel([
        Animated.timing(circleOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(circleScale,   { toValue: 1, tension: 140, friction: 6, useNativeDriver: true }),
      ]),
      // Check aparece
      Animated.parallel([
        Animated.timing(checkOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.spring(checkScale,   { toValue: 1, tension: 160, friction: 5, useNativeDriver: true }),
      ]),
      Animated.delay(100),
      // Explosão verde cobre tudo
      Animated.parallel([
        Animated.timing(bgOpacity, { toValue: 1, duration: 30,  useNativeDriver: true }),
        Animated.timing(bgScale,   {
          toValue: (Math.sqrt(width ** 2 + height ** 2) / CIRCLE) * 2.2,
          duration: 400,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Texto entra
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(textY,       { toValue: 0, duration: 250, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
      ]),
      Animated.delay(1800),
      // Fade out e navega pro Login
      Animated.timing(screenOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => navigation.replace("Login", { registered: true }));
  }, []);

  return (
    <Animated.View style={[s.root, { opacity: screenOpacity }]}>
      {/* Explosão verde de fundo */}
      <Animated.View style={[s.bg, { opacity: bgOpacity, transform: [{ scale: bgScale }] }]} />

      {/* Círculo com check */}
      <Animated.View style={[s.circle, { opacity: circleOpacity, transform: [{ scale: circleScale }] }]}>
        <Animated.Text style={[s.check, { opacity: checkOpacity, transform: [{ scale: checkScale }] }]}>
          ✓
        </Animated.Text>
      </Animated.View>

      {/* Texto de sucesso */}
      <Animated.View style={[s.textBlock, { opacity: textOpacity, transform: [{ translateY: textY }] }]}>
        <Text style={s.title}>Conta criada!</Text>
        <Text style={s.subtitle}>Tudo certo por aqui</Text>
      </Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center" },
  bg: {
    position: "absolute",
    width: CIRCLE, height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: GREEN,
  },
  circle: {
    width: CIRCLE, height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: GREEN,
    alignItems: "center", justifyContent: "center",
    shadowColor: GREEN, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 20, elevation: 16,
  },
  check:    { fontSize: 42, color: "#ffffff", fontWeight: "800" },
  textBlock:{ position: "absolute", alignItems: "center", bottom: "30%" },
  title:    { fontSize: 28, fontWeight: "900", color: "#ffffff", letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 6 },
});
