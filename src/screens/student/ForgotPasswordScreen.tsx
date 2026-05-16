import { useState, useEffect, useRef } from "react";
import * as NavigationBar from "expo-navigation-bar";
import {
  View, Text, TextInput, TouchableOpacity,
  Animated, KeyboardAvoidingView, Platform,
  ScrollView, NativeSyntheticEvent, TextInputKeyPressEventData,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { GREEN }          from "../../theme/colors";
import { IconMail, IconLock, IconEye, IconMailCheck, IconShieldCheck } from "../../components/icons";
import { useThemeColors } from "../../theme/useThemeColors";
import { styles }         from "./forgotPasswordStyles";
import {
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
} from "../../services/authService";

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

type Step = "email" | "code" | "password" | "success";

export function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const colors     = useThemeColors();

  // ─── animations ────────────────────────────────────────────
  const headerAnim  = useRef(new Animated.Value(0)).current;
  const cardAnim    = useRef(new Animated.Value(40)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const fadeAnim    = useRef(new Animated.Value(1)).current;
  const barAnim     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#22c55e");
    NavigationBar.setButtonStyleAsync("light");

    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1, duration: 350, useNativeDriver: true,
        }),
        Animated.timing(cardAnim, {
          toValue: 0, duration: 350, useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  // ─── state ────────────────────────────────────────────────
  const [step,       setStep]       = useState<Step>("email");
  const [email,      setEmail]      = useState("");
  const [code,       setCode]       = useState(["", "", "", "", "", ""]);
  const [newPass,    setNewPass]    = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNewPass,     setShowNewPass]     = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const [emailFocus,   setEmailFocus]   = useState(false);
  const [newPassFocus,  setNewPassFocus]  = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const codeRefs = useRef<(TextInput | null)[]>([]);

  const strength     = getPasswordStrength(newPass);
  const isPasswordWeak = newPass.length > 0 && strength.level < 3;

  useEffect(() => {
    Animated.spring(barAnim, {
      toValue: strength.level / 5,
      tension: 80, friction: 8,
      useNativeDriver: false,
    }).start();
  }, [newPass]);

  // Countdown para reenviar
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // ─── transition helper ──────────────────────────────────────
  function transitionTo(next: Step) {
    Animated.timing(fadeAnim, {
      toValue: 0, duration: 150, useNativeDriver: true,
    }).start(() => {
      setStep(next);
      setError("");
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 250, useNativeDriver: true,
      }).start();
    });
  }

  // ─── handlers ──────────────────────────────────────────────
  async function handleSendCode() {
    if (!email.trim()) {
      setError("Digite seu e-mail.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await requestPasswordReset(email.trim());
      setCountdown(60);
      transitionTo("code");
    } catch (err: any) {
      const msg = err.response?.data?.error ?? "Erro ao enviar código.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    if (countdown > 0) return;
    try {
      setLoading(true);
      setError("");
      await requestPasswordReset(email.trim());
      setCountdown(60);
    } catch (err: any) {
      const msg = err.response?.data?.error ?? "Erro ao reenviar código.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode() {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      setError("Digite o código completo de 6 dígitos.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await verifyResetCode(email.trim(), fullCode);
      transitionTo("password");
    } catch (err: any) {
      const msg = err.response?.data?.error ?? "Código inválido.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!newPass || !confirmPass) {
      setError("Preencha ambos os campos de senha.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("As senhas não coincidem.");
      return;
    }
    if (strength.level < 3) {
      setError("Sua senha tá fraquinha! Tente deixar ela mais forte 💪");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const fullCode = code.join("");
      await resetPassword(email.trim(), fullCode, newPass);
      transitionTo("success");
    } catch (err: any) {
      const msg = err.response?.data?.error ?? "Erro ao redefinir senha.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // ─── code input helpers ─────────────────────────────────────
  function handleCodeChange(text: string, index: number) {
    const digit = text.replace(/[^0-9]/g, "");
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
  }

  function handleCodeKeyPress(e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  }

  // ─── masked email ──────────────────────────────────────────
  function maskEmail(e: string): string {
    const [local, domain] = e.split("@");
    if (!domain) return e;
    const visible = local.length <= 3 ? local[0] : local.substring(0, 3);
    return `${visible}${"*".repeat(Math.max(local.length - visible.length, 3))}@${domain}`;
  }

  // ─── header text per step ──────────────────────────────────
  const headerTitles: Record<Step, string> = {
    email:    "Recuperar senha",
    code:     "Verificar código",
    password: "Nova senha",
    success:  "Tudo certo!",
  };

  // ─── render ────────────────────────────────────────────────
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
        <Animated.View style={[styles.header, { opacity: headerAnim }]}>
          {step !== "success" && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => {
                if (step === "email") navigation.goBack();
                else if (step === "code") transitionTo("email");
                else if (step === "password") transitionTo("code");
              }}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          )}
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{headerTitles[step]}</Text>
            <Text style={styles.headerSub}>DESCARTE CERTO</Text>
          </View>
        </Animated.View>

        {/* CARD */}
        <Animated.View
          style={[styles.card, {
            backgroundColor: colors.cardBg,
            opacity: cardOpacity,
            transform: [{ translateY: cardAnim }],
          }]}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* ══════════════ STEP 1: E-MAIL ══════════════ */}
            {step === "email" && (
              <>
                <Text style={[styles.cardTitle, { color: colors.textColor }]}>
                  Esqueceu a senha?
                </Text>
                <Text style={[styles.cardSubtitle, { color: colors.subTextColor }]}>
                  Sem problemas! Digite o e-mail da sua conta e enviaremos um código de verificação 📧
                </Text>

                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.labelColor }]}>E-mail</Text>
                  <View style={[styles.inputWrapper, {
                    backgroundColor: colors.inputBg,
                    borderColor: emailFocus ? GREEN : colors.inputBorder,
                  }]}>
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

                {error !== "" && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                  onPress={handleSendCode}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>
                    {loading ? "ENVIANDO..." : "ENVIAR CÓDIGO"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.backRow}>
                  <Text style={[styles.backText, { color: colors.subTextColor }]}>
                    Lembrou a senha?
                  </Text>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backLink}>Entrar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* ══════════════ STEP 2: CÓDIGO ══════════════ */}
            {step === "code" && (
              <>
                <View style={styles.sentIcon}>
                  <IconMailCheck color={GREEN} size={38} />
                </View>

                <Text style={[styles.cardTitle, { color: colors.textColor, textAlign: "center" }]}>
                  Código enviado!
                </Text>
                <Text style={[styles.cardSubtitle, { color: colors.subTextColor, textAlign: "center" }]}>
                  Enviamos um código de 6 dígitos para{"\n"}
                  <Text style={styles.emailHighlight}>{maskEmail(email)}</Text>
                </Text>

                <View style={styles.codeRow}>
                  {code.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={(ref) => { codeRefs.current[i] = ref; }}
                      style={[styles.codeInput, {
                        backgroundColor: colors.inputBg,
                        borderColor: digit ? GREEN : colors.inputBorder,
                        color: colors.textColor,
                      }]}
                      value={digit}
                      onChangeText={(t) => handleCodeChange(t, i)}
                      onKeyPress={(e) => handleCodeKeyPress(e, i)}
                      keyboardType="numeric"
                      maxLength={1}
                      selectTextOnFocus
                    />
                  ))}
                </View>

                {error !== "" && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                  onPress={handleVerifyCode}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>
                    {loading ? "VERIFICANDO..." : "VERIFICAR"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.resendRow}>
                  <Text style={[styles.resendText, { color: colors.subTextColor }]}>
                    Não recebeu?
                  </Text>
                  <TouchableOpacity onPress={handleResendCode} disabled={countdown > 0}>
                    <Text style={[styles.resendLink, countdown > 0 && { opacity: 0.5 }]}>
                      {countdown > 0 ? `Reenviar (${countdown}s)` : "Reenviar"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.timerText, { color: colors.subTextColor }]}>
                  O código expira em 15 minutos
                </Text>
              </>
            )}

            {/* ══════════════ STEP 3: NOVA SENHA ══════════════ */}
            {step === "password" && (
              <>
                <Text style={[styles.cardTitle, { color: colors.textColor }]}>
                  Crie sua nova senha
                </Text>
                <Text style={[styles.cardSubtitle, { color: colors.subTextColor }]}>
                  Escolha uma senha forte para proteger sua conta 🔒
                </Text>

                {/* Nova senha */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.labelColor }]}>Nova senha</Text>
                  <View style={[styles.inputWrapper, {
                    backgroundColor: colors.inputBg,
                    borderColor: newPassFocus ? GREEN : colors.inputBorder,
                  }]}>
                    <IconLock color={newPassFocus ? GREEN : colors.iconColor} />
                    <TextInput
                      style={[styles.input, { color: colors.textColor }]}
                      placeholder="••••••••"
                      placeholderTextColor={colors.subTextColor}
                      secureTextEntry={!showNewPass}
                      value={newPass}
                      onChangeText={setNewPass}
                      onFocus={() => setNewPassFocus(true)}
                      onBlur={() => setNewPassFocus(false)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowNewPass(!showNewPass)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <IconEye color={newPassFocus ? GREEN : colors.iconColor} off={!showNewPass} />
                    </TouchableOpacity>
                  </View>

                  {/* Barra de força */}
                  {newPass.length > 0 && (
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

                {/* Confirmar senha */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.labelColor }]}>Confirmar senha</Text>
                  <View style={[styles.inputWrapper, {
                    backgroundColor: colors.inputBg,
                    borderColor: confirmFocus ? GREEN : colors.inputBorder,
                  }]}>
                    <IconLock color={confirmFocus ? GREEN : colors.iconColor} />
                    <TextInput
                      style={[styles.input, { color: colors.textColor }]}
                      placeholder="••••••••"
                      placeholderTextColor={colors.subTextColor}
                      secureTextEntry={!showConfirmPass}
                      value={confirmPass}
                      onChangeText={setConfirmPass}
                      onFocus={() => setConfirmFocus(true)}
                      onBlur={() => setConfirmFocus(false)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPass(!showConfirmPass)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <IconEye color={confirmFocus ? GREEN : colors.iconColor} off={!showConfirmPass} />
                    </TouchableOpacity>
                  </View>
                </View>

                {error !== "" && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                  onPress={handleResetPassword}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>
                    {loading ? "REDEFININDO..." : "REDEFINIR SENHA"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* ══════════════ STEP 4: SUCESSO ══════════════ */}
            {step === "success" && (
              <View style={styles.successContainer}>
                <View style={styles.successIcon}>
                  <IconShieldCheck color={GREEN} size={46} />
                </View>
                <Text style={[styles.successTitle, { color: colors.textColor }]}>
                  Senha redefinida!
                </Text>
                <Text style={[styles.successSubtitle, { color: colors.subTextColor }]}>
                  Sua senha foi alterada com sucesso.{"\n"}Agora é só entrar com a nova senha 🎉
                </Text>
                <TouchableOpacity
                  style={[styles.primaryBtn, { alignSelf: "stretch" }]}
                  onPress={() => navigation.navigate("Login")}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>VOLTAR PARA LOGIN</Text>
                </TouchableOpacity>
              </View>
            )}

          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
