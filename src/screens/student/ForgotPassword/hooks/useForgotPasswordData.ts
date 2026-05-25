import { useState, useEffect, useRef } from "react";
import { Animated, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import {
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
} from "../../../../services/authService";

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

export type Step = "email" | "code" | "password" | "success";

export function useForgotPasswordData() {
  const navigation = useNavigation<any>();

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
      Animated.timing(headerAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(cardAnim,    { toValue: 0, duration: 350, useNativeDriver: true }),
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

  const [emailFocus,  setEmailFocus]  = useState(false);
  const [newPassFocus, setNewPassFocus] = useState(false);
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
    if (!email.trim()) { setError("Digite seu e-mail."); return; }
    try {
      setLoading(true); setError("");
      await requestPasswordReset(email.trim());
      setCountdown(60);
      transitionTo("code");
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Erro ao enviar código.");
    } finally { setLoading(false); }
  }

  async function handleResendCode() {
    if (countdown > 0) return;
    try {
      setLoading(true); setError("");
      await requestPasswordReset(email.trim());
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Erro ao reenviar código.");
    } finally { setLoading(false); }
  }

  async function handleVerifyCode() {
    const fullCode = code.join("");
    if (fullCode.length < 6) { setError("Digite o código completo de 6 dígitos."); return; }
    try {
      setLoading(true); setError("");
      await verifyResetCode(email.trim(), fullCode);
      transitionTo("password");
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Código inválido.");
    } finally { setLoading(false); }
  }

  async function handleResetPassword() {
    if (!newPass || !confirmPass) { setError("Preencha ambos os campos de senha."); return; }
    if (newPass !== confirmPass) { setError("As senhas não coincidem."); return; }
    if (strength.level < 3) { setError("Sua senha tá fraquinha! Tente deixar ela mais forte 💪"); return; }
    try {
      setLoading(true); setError("");
      const fullCode = code.join("");
      await resetPassword(email.trim(), fullCode, newPass);
      transitionTo("success");
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Erro ao redefinir senha.");
    } finally { setLoading(false); }
  }

  // ─── code input helpers ─────────────────────────────────────
  function handleCodeChange(text: string, index: number) {
    const digit = text.replace(/[^0-9]/g, "");
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    if (digit && index < 5) codeRefs.current[index + 1]?.focus();
  }

  function handleCodeKeyPress(e: any, index: number) {
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

  const headerTitles: Record<Step, string> = {
    email:    "Recuperar senha",
    code:     "Verificar código",
    password: "Nova senha",
    success:  "Tudo certo!",
  };

  return {
    navigation,
    headerAnim, cardAnim, cardOpacity, fadeAnim, barAnim,
    step, email, setEmail, code, newPass, setNewPass,
    confirmPass, setConfirmPass,
    showNewPass, setShowNewPass, showConfirmPass, setShowConfirmPass,
    loading, error,
    emailFocus, setEmailFocus, newPassFocus, setNewPassFocus,
    confirmFocus, setConfirmFocus,
    countdown, codeRefs,
    strength, isPasswordWeak,
    transitionTo,
    handleSendCode, handleResendCode, handleVerifyCode, handleResetPassword,
    handleCodeChange, handleCodeKeyPress,
    maskEmail, headerTitles,
  };
}
