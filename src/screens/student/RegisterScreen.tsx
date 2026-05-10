import { registerUser } from "../../services/authService";
import { useState, useEffect, useRef } from "react";
import * as NavigationBar from "expo-navigation-bar";
import {
  View, Text, TextInput, TouchableOpacity,
  Animated, KeyboardAvoidingView, Platform,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { GREEN }                  from "../../constants/theme";
import { IconMail, IconLock, IconUser, IconHash, IconBook, IconEye } from "../../components/icons";
import { useRegisterAnimations }  from "../../hooks/useRegisterAnimations";
import { useRegisterColors }      from "../../hooks/useRegisterColors";
import { styles }                 from "./registerStyles";

type PasswordLevel = {
  level: number;
  label: string;
  emoji: string;
  color: string;
};

function getPasswordStrength(pass: string): PasswordLevel {
  if (pass.length === 0) return { level: 0, label: "",              emoji: "",   color: "transparent" };
  if (pass.length < 4)   return { level: 1, label: "Fraquinha...",  emoji: "😴", color: "#ef4444" };

  let score = 0;
  if (pass.length >= 6)           score++;
  if (/[A-Z]/.test(pass))        score++;
  if (/[0-9]/.test(pass))        score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  if (score <= 1) return { level: 2, label: "Tá fraca ainda!", emoji: "😬", color: "#f97316" };
  if (score === 2) return { level: 3, label: "Ficando boa!",   emoji: "😊", color: "#eab308" };
  if (score === 3) return { level: 4, label: "Muito boa!",     emoji: "💪", color: "#22c55e" };
  return              { level: 5, label: "Impossível!",     emoji: "🔥", color: "#8b5cf6" };
}

export function RegisterScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const colors     = useRegisterColors();
  const anim       = useRegisterAnimations();

  const [nome,      setNome]      = useState("");
  const [matricula, setMatricula] = useState("");
  const [email,     setEmail]     = useState("");
  const [senha,     setSenha]     = useState("");
  const [turma,     setTurma]     = useState("");
  const [showPass,  setShowPass]  = useState(false);

  const [nomeFocus,      setNomeFocus]      = useState(false);
  const [matriculaFocus, setMatriculaFocus] = useState(false);
  const [emailFocus,     setEmailFocus]     = useState(false);
  const [senhaFocus,     setSenhaFocus]     = useState(false);
  const [turmaFocus,     setTurmaFocus]     = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");

  const barAnim  = useRef(new Animated.Value(0)).current;
  const strength = getPasswordStrength(senha);

  useEffect(() => {
    Animated.spring(barAnim, {
      toValue: strength.level / 5,
      tension: 80,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [senha]);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#22c55e");
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  const isPasswordWeak = senha.length > 0 && strength.level < 3;
  const registered     = route.params?.registered;

  async function handleRegister() {
    if (!nome || !matricula || !email || !senha || !turma) {
      setError("Preencha todos os campos.");
      return;
    }

    if (strength.level < 3) {
      setError("Sua senha tá fraquinha! Tente deixar ela mais forte 💪");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await registerUser({ name: nome, matricula, email, password: senha, turma });
      navigation.replace("RegisterSuccess");
    } catch (err: any) {
      const msg = err.response?.data?.error ?? "Erro ao criar conta. Tente novamente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

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
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Criar conta</Text>
            <Text style={styles.headerSub}>DESCARTE CERTO</Text>
          </View>
        </Animated.View>

        {/* CARD */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: anim.cardOpacity,
          transform: [{ translateY: anim.cardAnim }],
        }]}>
          <Text style={[styles.cardTitle,    { color: colors.textColor }]}>Cadastro</Text>
          <Text style={[styles.cardSubtitle, { color: colors.subTextColor }]}>
            {registered
              ? "✅ Cadastro concluído! Use seus dados para entrar."
              : "Preencha os dados abaixo para começar 🌱"}
          </Text>

          {/* Nome */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.labelColor }]}>Nome completo</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: nomeFocus ? GREEN : colors.inputBorder }]}>
              <IconUser color={nomeFocus ? GREEN : colors.iconColor} />
              <TextInput
                style={[styles.input, { color: colors.textColor }]}
                placeholder="Ex: João da Silva"
                placeholderTextColor={colors.subTextColor}
                value={nome}
                onChangeText={setNome}
                onFocus={() => setNomeFocus(true)}
                onBlur={() => setNomeFocus(false)}
              />
            </View>
          </View>

          {/* Matrícula */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.labelColor }]}>Matrícula</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: matriculaFocus ? GREEN : colors.inputBorder }]}>
              <IconHash color={matriculaFocus ? GREEN : colors.iconColor} />
              <TextInput
                style={[styles.input, { color: colors.textColor }]}
                placeholder="Ex: 20241234"
                placeholderTextColor={colors.subTextColor}
                keyboardType="numeric"
                value={matricula}
                onChangeText={(t) => setMatricula(t.replace(/[^0-9]/g, ""))}
                onFocus={() => setMatriculaFocus(true)}
                onBlur={() => setMatriculaFocus(false)}
              />
            </View>
          </View>

          {/* E-mail */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.labelColor }]}>E-mail</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: emailFocus ? GREEN : colors.inputBorder }]}>
              <IconMail color={emailFocus ? GREEN : colors.iconColor} />
              <TextInput
                style={[styles.input, { color: colors.textColor }]}
                placeholder="seu@email.com"
                placeholderTextColor={colors.subTextColor}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
            </View>
          </View>

          {/* Senha */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.labelColor }]}>Senha</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: senhaFocus ? GREEN : colors.inputBorder }]}>
              <IconLock color={senhaFocus ? GREEN : colors.iconColor} />
              <TextInput
                style={[styles.input, { color: colors.textColor }]}
                placeholder="••••••••"
                placeholderTextColor={colors.subTextColor}
                secureTextEntry={!showPass}
                value={senha}
                onChangeText={setSenha}
                onFocus={() => setSenhaFocus(true)}
                onBlur={() => setSenhaFocus(false)}
              />
              <TouchableOpacity
                onPress={() => setShowPass(!showPass)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <IconEye color={senhaFocus ? GREEN : colors.iconColor} off={!showPass} />
              </TouchableOpacity>
            </View>

            {/* Barra de força */}
            {senha.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <View style={styles.strengthTrack}>
                  <Animated.View style={[styles.strengthBar, {
                    width: barAnim.interpolate({
                      inputRange:  [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                    backgroundColor: strength.color,
                  }]} />
                </View>
                <View style={styles.strengthRow}>
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>
                    {strength.emoji}  {strength.label}
                  </Text>
                  {isPasswordWeak && (
                    <Text style={styles.strengthHint}>mínimo: média</Text>
                  )}
                </View>
              </View>
            )}
          </View>

          {/* Turma */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.labelColor }]}>Turma / Série</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: turmaFocus ? GREEN : colors.inputBorder }]}>
              <IconBook color={turmaFocus ? GREEN : colors.iconColor} />
              <TextInput
                style={[styles.input, { color: colors.textColor }]}
                placeholder="Ex: 3º A"
                placeholderTextColor={colors.subTextColor}
                value={turma}
                onChangeText={setTurma}
                onFocus={() => setTurmaFocus(true)}
                onBlur={() => setTurmaFocus(false)}
              />
            </View>
          </View>

          {/* Erro */}
          {error !== "" && (
            <Text style={{ color: "red", textAlign: "center", marginBottom: 8 }}>
              {error}
            </Text>
          )}

          {/* Botão */}
          <TouchableOpacity
            style={[styles.registerBtn, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.registerBtnText}>
              {loading ? "CRIANDO..." : "CRIAR CONTA"}
            </Text>
          </TouchableOpacity>

          {/* Link pro login */}
          <View style={styles.loginRow}>
            <Text style={[styles.loginText, { color: colors.subTextColor }]}>Já tem conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
