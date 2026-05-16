import { loginUser } from "../../services/authService";
import { useState, useEffect, useRef } from "react";
import * as NavigationBar from "expo-navigation-bar";
import {
  View, Text, TextInput, TouchableOpacity,
  Animated, Dimensions, KeyboardAvoidingView,
  Platform, ScrollView, Switch,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { GREEN }               from "../../theme/colors";
import { IconHash, IconLock, IconEye } from "../../components/icons";
import { useLoginAnimations }  from "../../hooks/useLoginAnimations";
import { useThemeColors }      from "../../theme/useThemeColors";
import { styles }              from "./loginStyles";

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const fromRegister = route.params?.registered === true;

  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleLogin() {
    if (!matricula || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await loginUser({ matricula, password, rememberMe });
      navigation.replace("Tabs");
    } catch (err: any) {
      const msg = err.response?.data?.error ?? "Erro ao entrar. Tente novamente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!fromRegister) return;

    setShowBanner(true);

    // Fade in
    Animated.timing(bannerOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Após 4s, fade out e remove
    const timer = setTimeout(() => {
      Animated.timing(bannerOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setShowBanner(false));
    }, 4000);

    return () => clearTimeout(timer);
  }, [fromRegister]);

  const colors     = useThemeColors();
  const anim       = useLoginAnimations();

  const [matricula, setMatricula] = useState("");
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus,  setPassFocus]  = useState(false);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#22c55e");
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  const handleRemember = (value: boolean) => {
    setRememberMe(value);
    anim.toggleRemember(value);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: GREEN }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.root, { backgroundColor: GREEN }]}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <Animated.View style={[styles.header, { opacity: anim.headerOpacity }]}>
          <Animated.View
            style={[styles.logoArea, { opacity: anim.logoAnim, transform: [{ scale: anim.logoAnim }] }]}
          >
            <View style={styles.appNameRow}>
              <Text style={styles.appNameDark}>Descarte</Text>
              <Text style={styles.appNameWhite}> Certo</Text>
            </View>
            <Text style={styles.appTagline}>RECICLE • PONTUE • TRANSFORME</Text>
          </Animated.View>
        </Animated.View>

        {/* CARD */}
        <Animated.View
          style={[styles.card, {
            backgroundColor: colors.cardBg,
            opacity: anim.cardOpacity,
            transform: [{ translateY: anim.cardAnim }],
          }]}
        >
          <Text style={[styles.cardTitle,    { color: colors.textColor }]}>Entrar</Text>
          <Text style={[styles.cardSubtitle, { color: colors.subTextColor }]}>Bem-vindo de volta 👋</Text>

          {/* Matrícula */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.labelColor }]}>
              Últimos 4 dígitos da matrícula
            </Text>
            <View style={[styles.inputWrapper, {
              backgroundColor: colors.inputBg,
              borderColor: emailFocus ? GREEN : colors.inputBorder,
            }]}>
              <IconHash color={emailFocus ? GREEN : colors.iconColor} />
              <TextInput
                style={[styles.input, { color: colors.textColor }]}
                placeholder="Ex: 1234"
                placeholderTextColor={colors.subTextColor}
                keyboardType="numeric"
                maxLength={4}
                value={matricula}
                onChangeText={(t) => setMatricula(t.replace(/[^0-9]/g, ""))}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
            </View>
          </View>

          {/* Senha */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.labelColor }]}>Senha</Text>
            <View style={[styles.inputWrapper, {
              backgroundColor: colors.inputBg,
              borderColor: passFocus ? GREEN : colors.inputBorder,
            }]}>
              <IconLock color={passFocus ? GREEN : colors.iconColor} />
              <TextInput
                style={[styles.input, { color: colors.textColor }]}
                placeholder="••••••••"
                placeholderTextColor={colors.subTextColor}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPassFocus(true)}
                onBlur={() => setPassFocus(false)}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <IconEye color={passFocus ? GREEN : colors.iconColor} off={!showPass} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Lembrar + Esqueci */}
          <View style={styles.rememberRow}>
            <View style={styles.rememberLeft}>
              <Animated.View style={{ transform: [{ scale: anim.rememberScale }] }}>
                <Switch
                  value={rememberMe}
                  onValueChange={handleRemember}
                  trackColor={{ false: colors.inputBorder, true: "#86efac" }}
                  thumbColor={rememberMe ? GREEN : "#cbd5e1"}
                  style={styles.switch}
                />
              </Animated.View>
              <Text style={[styles.rememberText, { color: colors.labelColor }]}>Me manter conectado</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
              <Text style={styles.forgotText}>Esqueci a senha</Text>
            </TouchableOpacity>
          </View>

          {/* Erro */}
          {error !== "" && (
            <Text style={{ color: "red", textAlign: "center", marginBottom: 8 }}>
              {error}
            </Text>
          )}

          {/* Botão */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>
              {loading ? "ENTRANDO..." : "ENTRAR"}
            </Text>
          </TouchableOpacity>

          {/* Banner de cadastro concluído */}
          {showBanner && (
            <Animated.View style={[styles.successBanner, { opacity: bannerOpacity }]}>
              <Text style={styles.successBannerText}>
                ✓ Cadastro realizado! Entre com suas credenciais.
              </Text>
            </Animated.View>
          )}

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.dividerColor }]} />
            <Text style={[styles.dividerText, { color: colors.subTextColor }]}>ou</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.dividerColor }]} />
          </View>

          {/* Criar conta */}
          <TouchableOpacity
            style={[styles.registerBtn, { borderColor: GREEN }]}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.8}
          >
            <Text style={[styles.registerBtnText, { color: GREEN }]}>Criar conta</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
