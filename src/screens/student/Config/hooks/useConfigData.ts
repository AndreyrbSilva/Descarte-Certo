import { useState, useCallback, useRef } from "react";
import { Animated } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import * as SecureStore from "expo-secure-store";

import { useAuthStore } from "../../../../store/useAuthStore";
import {
  sendVerifyCode, verifyEmail,
  changeEmail, confirmChangeEmail,
  changePassword,
  setup2FA, verify2FA, disable2FA,
  fetchMe, logout,
} from "../../../../services/authService";

export type ModalType =
  | "verify-code"
  | "change-email"
  | "change-email-code"
  | "change-password"
  | "2fa-qr"
  | "2fa-disable"
  | null;

export function useConfigData(colors: { bg: string }) {
  const navigation = useNavigation<any>();
  const user       = useAuthStore((s) => s.user);
  const setUser    = useAuthStore((s) => s.setUser);

  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const [modal, setModal] = useState<ModalType>(null);
  const [qrCode,  setQrCode]  = useState("");
  const [secret,  setSecret]  = useState("");
  const [pending2FAEmail, setPending2FAEmail] = useState("");

  const headerOpacity = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      NavigationBar.setBackgroundColorAsync(colors.bg);
      NavigationBar.setButtonStyleAsync("dark");

      Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();

      // sincroniza dados atuais
      fetchMe().then((u) => {
        setUser({
          email:            u.email,
          emailVerified:    u.emailVerified,
          twoFactorEnabled: u.twoFactorEnabled,
        });
      }).catch(() => {});
    }, [])
  );

  function feedback(msg: string, isError = false) {
    if (isError) setError(msg);
    else setSuccess(msg);
    setTimeout(() => { setError(""); setSuccess(""); }, 3500);
  }

  // ── email: enviar código de verificação
  async function handleSendVerify() {
    setLoading(true);
    try {
      await sendVerifyCode();
      setModal("verify-code");
    } catch (e: any) {
      feedback(e.response?.data?.error ?? "Erro ao enviar código.", true);
    } finally { setLoading(false); }
  }

  // ── email: confirmar verificação
  async function handleVerifyEmail(code: string) {
    setLoading(true);
    try {
      await verifyEmail(code);
      setUser({ emailVerified: true });
      await SecureStore.setItemAsync("user", JSON.stringify({ ...user, emailVerified: true }));
      setModal(null);
      feedback("E-mail confirmado com sucesso!");
    } catch (e: any) {
      feedback(e.response?.data?.error ?? "Código inválido.", true);
    } finally { setLoading(false); }
  }

  // ── email: iniciar alteração
  async function handleChangeEmail(newEmail: string, totpCode?: string) {
    setLoading(true);
    try {
      await changeEmail(newEmail, totpCode);
      setPending2FAEmail(newEmail);
      setModal("change-email-code");
    } catch (e: any) {
      feedback(e.response?.data?.error ?? "Erro ao alterar e-mail.", true);
    } finally { setLoading(false); }
  }

  // ── email: confirmar alteração
  async function handleConfirmChangeEmail(code: string) {
    setLoading(true);
    try {
      await confirmChangeEmail(code);
      setUser({ email: pending2FAEmail, emailVerified: true });
      await SecureStore.setItemAsync("user", JSON.stringify({ ...user, email: pending2FAEmail, emailVerified: true }));
      setModal(null);
      feedback("E-mail alterado com sucesso!");
    } catch (e: any) {
      feedback(e.response?.data?.error ?? "Código inválido.", true);
    } finally { setLoading(false); }
  }

  // ── senha: alterar
  async function handleChangePassword(currentPassword: string, newPass?: string, totpCode?: string) {
    setLoading(true);
    try {
      await changePassword(currentPassword, newPass ?? "", totpCode);
      setModal(null);
      feedback("Senha alterada com sucesso!");
    } catch (e: any) {
      throw e;
    } finally { setLoading(false); }
  }

  // ── 2FA: configurar
  async function handleSetup2FA() {
    setLoading(true);
    try {
      const data = await setup2FA();
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setModal("2fa-qr");
    } catch (e: any) {
      feedback(e.response?.data?.error ?? "Erro ao configurar 2FA.", true);
    } finally { setLoading(false); }
  }

  // ── 2FA: confirmar ativação
  async function handleVerify2FA(code: string) {
    setLoading(true);
    try {
      await verify2FA(code);
      setUser({ twoFactorEnabled: true });
      await SecureStore.setItemAsync("user", JSON.stringify({ ...user, twoFactorEnabled: true }));
      setModal(null);
      feedback("2FA ativado com sucesso!");
    } catch (e: any) {
      feedback(e.response?.data?.error ?? "Código inválido.", true);
    } finally { setLoading(false); }
  }

  // ── 2FA: desativar
  async function handleDisable2FA(code: string) {
    setLoading(true);
    try {
      await disable2FA(code);
      setUser({ twoFactorEnabled: false });
      await SecureStore.setItemAsync("user", JSON.stringify({ ...user, twoFactorEnabled: false }));
      setModal(null);
      feedback("2FA desativado.");
    } catch (e: any) {
      feedback(e.response?.data?.error ?? "Código inválido.", true);
    } finally { setLoading(false); }
  }

  // ── logout
  async function confirmLogout() {
    setShowLogout(false);
    await logout();
    navigation.replace("Login");
  }

  const emailVerified    = user?.emailVerified    ?? false;
  const twoFactorEnabled = user?.twoFactorEnabled ?? false;

  return {
    user,
    error,
    success,
    loading,
    showLogout,
    setShowLogout,
    modal,
    setModal,
    qrCode,
    secret,
    pending2FAEmail,
    headerOpacity,
    emailVerified,
    twoFactorEnabled,
    handleSendVerify,
    handleVerifyEmail,
    handleChangeEmail,
    handleConfirmChangeEmail,
    handleChangePassword,
    handleSetup2FA,
    handleVerify2FA,
    handleDisable2FA,
    confirmLogout,
  };
}
