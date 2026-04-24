import { useState, useRef, useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const GREEN       = "#22c55e";
const GREEN_LIGHT = "#86efac";

function IconMail({ color }: { color: string }) {
  return (
    <View style={icon.wrap}>
      <View style={[icon.envelopeBody, { borderColor: color }]}>
        <View style={[icon.envelopeFlap, { borderColor: color }]} />
      </View>
    </View>
  );
}

function IconLock({ color }: { color: string }) {
  return (
    <View style={icon.wrap}>
      <View style={[icon.lockBody, { borderColor: color }]}>
        <View style={[icon.lockHole, { backgroundColor: color }]} />
      </View>
      <View style={[icon.lockShackle, { borderColor: color }]} />
    </View>
  );
}

function IconEye({ color, off }: { color: string; off?: boolean }) {
  return (
    <View style={icon.wrap}>
      <View style={[icon.eyeOuter, { borderColor: color }]}>
        <View style={[icon.eyeInner, { backgroundColor: color }]} />
      </View>
      {off && <View style={[icon.eyeLine, { backgroundColor: color }]} />}
    </View>
  );
}

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const isDark     = useColorScheme() === "dark";

  const [matricula, setMatricula] = useState("");
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus,  setPassFocus]  = useState(false);

  const bgBottom     = isDark ? "#1a1a1a" : "#ffffff";
  const cardBg       = isDark ? "#242424" : "#ffffff";
  const inputBg      = isDark ? "#2d2d2d" : "#f8fafc";
  const inputBorder  = isDark ? "#3d3d3d" : "#e2e8f0";
  const labelColor   = isDark ? "#9ca3af" : "#6b7280";
  const textColor    = isDark ? "#f1f5f9" : "#111827";
  const subTextColor = isDark ? "#6b7280" : "#9ca3af";
  const iconColor    = isDark ? "#4b5563" : "#94a3b8";
  const dividerColor = isDark ? "#2d2d2d" : "#f1f5f9";

  const headerAnim  = useRef(new Animated.Value(0)).current;
  const logoAnim    = useRef(new Animated.Value(0)).current;
  const cardAnim    = useRef(new Animated.Value(40)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const rememberAnim = useRef(new Animated.Value(0)).current;

  const toggleRemember = (value: boolean) => {
    setRememberMe(value);

    Animated.spring(rememberAnim, {
      toValue: value ? 1 : 0,
      tension: 120,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const scale = rememberAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#22c55e"); // mesma cor do seu GREEN
    NavigationBar.setButtonStyleAsync("light"); // ícones brancos
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(logoAnim, {
          toValue: 1,
          tension: 120,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(cardAnim, {
            toValue: 0,
            duration: 350,
            easing: Easing.out(Easing.back(1.1)),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const headerOpacity = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: GREEN }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.root, { backgroundColor: GREEN }]}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER VERDE ─────────────────────────────────────────────── */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <Animated.View
            style={[
              styles.logoArea,
              { opacity: logoAnim, transform: [{ scale: logoAnim }] },
            ]}
          >
            <View style={styles.appNameRow}>
              <Text style={styles.appNameDark}>Descarte</Text>
              <Text style={styles.appNameWhite}> Certo</Text>
            </View>
            <Text style={styles.appTagline}>RECICLE • PONTUE • TRANSFORME</Text>
          </Animated.View>
        </Animated.View>
        {/* ── fim HEADER ───────────────────────────────────────────────── */}

        {/* ── CURVA de transição ───────────────────────────────────────── */}
        {/*
          A técnica: um container verde que tem overflow:hidden.
          Dentro dele, um retângulo com a cor do fundo (bgBottom)
          que tem borderTopLeftRadius e borderTopRightRadius grandes,
          criando a ilusão de curva côncava no header.
        */}
        
        {/* ── fim CURVA ────────────────────────────────────────────────── */}

        {/* ── CARD DE LOGIN ────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: cardBg,
              opacity: cardOpacity,
              transform: [{ translateY: cardAnim }],
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: textColor }]}>Entrar</Text>
          <Text style={[styles.cardSubtitle, { color: subTextColor }]}>
            Bem-vindo de volta 👋
          </Text>

          {/* Campo E-mail */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: labelColor }]}>
              Últimos 4 dígitos da matrícula
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: inputBg,
                  borderColor: emailFocus ? GREEN : inputBorder,
                },
              ]}
            >
              <IconMail color={emailFocus ? GREEN : iconColor} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Ex: 1234"
                placeholderTextColor={subTextColor}
                keyboardType="numeric"
                maxLength={4}
                value={matricula}
                onChangeText={(text) => {
                  const onlyNumbers = text.replace(/[^0-9]/g, "");
                  setMatricula(onlyNumbers);
                }}
              />
            </View>
          </View>

          {/* Campo Senha */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: labelColor }]}>Senha</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: inputBg,
                  borderColor: passFocus ? GREEN : inputBorder,
                },
              ]}
            >
              <IconLock color={passFocus ? GREEN : iconColor} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="••••••••"
                placeholderTextColor={subTextColor}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPassFocus(true)}
                onBlur={() => setPassFocus(false)}
              />
              <TouchableOpacity
                onPress={() => setShowPass(!showPass)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <IconEye color={passFocus ? GREEN : iconColor} off={!showPass} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Lembrar + Esqueci */}
          <View style={styles.rememberRow}>
            <View style={styles.rememberLeft}>
              <Animated.View style={{ transform: [{ scale }] }}>
                <Switch
                  value={rememberMe}
                  onValueChange={toggleRemember}
                  trackColor={{ false: inputBorder, true: GREEN_LIGHT }}
                  thumbColor={rememberMe ? GREEN : "#cbd5e1"}
                  style={styles.switch}
                />
              </Animated.View>
              <Text style={[styles.rememberText, { color: labelColor }]}>
                Lembrar-me
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Esqueci a senha</Text>
            </TouchableOpacity>
          </View>

          {/* Botão LOGIN */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.replace("Home")}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>ENTRAR</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: dividerColor }]} />
            <Text style={[styles.dividerText, { color: subTextColor }]}>ou</Text>
            <View style={[styles.dividerLine, { backgroundColor: dividerColor }]} />
          </View>

          {/* Criar conta */}
          <TouchableOpacity
            style={[styles.registerBtn, { borderColor: GREEN }]}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.8}
          >
            <Text style={[styles.registerBtnText, { color: GREEN }]}>
              Criar conta
            </Text>
          </TouchableOpacity>
        </Animated.View>
        {/* ── fim CARD ─────────────────────────────────────────────────── */}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const icon = StyleSheet.create({
  wrap: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  envelopeBody: {
    width: 16,
    height: 11,
    borderWidth: 1.5,
    borderRadius: 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  envelopeFlap: {
    width: 14,
    height: 7,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    marginTop: -3,
    transform: [{ rotate: "180deg" }],
  },
  lockBody: {
    width: 14,
    height: 10,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  lockHole: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  lockShackle: {
    position: "absolute",
    top: 0,
    width: 8,
    height: 8,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  eyeOuter: {
    width: 16,
    height: 10,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  eyeInner: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  eyeLine: {
    position: "absolute",
    width: 18,
    height: 1.5,
    borderRadius: 1,
    transform: [{ rotate: "-40deg" }],
  },
});

const HEADER_HEIGHT = height * 0.28;

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
  },

  // Header — sem nenhum borderRadius, a curva é feita pelo bloco abaixo
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },

  logoArea: {
    alignItems: "center",
  },
  appNameRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  appNameDark: {
    fontSize: 30,
    fontWeight: "900",
    color: "#052e16",
    letterSpacing: -0.5,
  },
  appNameWhite: {
    fontSize: 30,
    fontWeight: "300",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 3.5,
    color: "rgba(255,255,255,0.65)",
    marginTop: 6,
  },

  card: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
    flex: 1,
    marginTop: -20,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 28,
  },

  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    marginTop: 4,
  },
  rememberLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  rememberText: {
    fontSize: 13,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "600",
    color: GREEN,
  },

  loginBtn: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  loginBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
  },

  registerBtn: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  registerBtnText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});