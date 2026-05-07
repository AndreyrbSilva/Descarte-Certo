import { useEffect, useRef, useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Animated, StatusBar, Modal, TextInput,
  ActivityIndicator, Image, StyleSheet,
} from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

import { useConfigColors } from "../../hooks/useConfigColors";
import { useAuthStore }    from "../../store/useAuthStore";
import { styles }          from "./configStyles";
import {
  sendVerifyCode, verifyEmail,
  changeEmail, confirmChangeEmail,
  changePassword,
  setup2FA, verify2FA, disable2FA,
  fetchMe, logout,
} from "../../services/authService";

const GREEN = "#22c55e";

// ─── modal genérico de código ─────────────────────────────────────────────────
function CodeModal({ visible, title, subtitle, onConfirm, onClose, loading }: {
  visible:   boolean;
  title:     string;
  subtitle:  string;
  onConfirm: (code: string) => void;
  onClose:   () => void;
  loading:   boolean;
}) {
  const colors = useConfigColors();
  const [code, setCode] = useState("");

  useEffect(() => { if (!visible) setCode(""); }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.backdrop}>
        <View style={[modalStyles.card, { backgroundColor: colors.cardBg }]}>
          <Text style={[modalStyles.title, { color: colors.textColor }]}>{title}</Text>
          <Text style={[modalStyles.sub,   { color: colors.subTextColor }]}>{subtitle}</Text>
          <TextInput
            style={[modalStyles.input, { borderColor: colors.dividerColor, color: colors.textColor }]}
            placeholder="000000"
            placeholderTextColor={colors.subTextColor}
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
            autoFocus
          />
          <TouchableOpacity
            style={[modalStyles.btn, { backgroundColor: GREEN, opacity: loading ? 0.7 : 1 }]}
            onPress={() => onConfirm(code)}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={modalStyles.btnText}>Confirmar</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
            <Text style={{ color: colors.subTextColor, fontSize: 13, textAlign: "center" }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── modal de input genérico ──────────────────────────────────────────────────
function InputModal({ visible, title, subtitle, placeholder, onConfirm, onClose, loading, secureText, extraField }: {
  visible:     boolean;
  title:       string;
  subtitle:    string;
  placeholder: string;
  onConfirm:   (value: string, extra?: string) => void;
  onClose:     () => void;
  loading:     boolean;
  secureText?: boolean;
  extraField?: { placeholder: string; label: string };
}) {
  const colors = useConfigColors();
  const [value, setValue]   = useState("");
  const [extra, setExtra]   = useState("");

  useEffect(() => { if (!visible) { setValue(""); setExtra(""); } }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.backdrop}>
        <View style={[modalStyles.card, { backgroundColor: colors.cardBg }]}>
          <Text style={[modalStyles.title, { color: colors.textColor }]}>{title}</Text>
          <Text style={[modalStyles.sub,   { color: colors.subTextColor }]}>{subtitle}</Text>
          <TextInput
            style={[modalStyles.input, { borderColor: colors.dividerColor, color: colors.textColor }]}
            placeholder={placeholder}
            placeholderTextColor={colors.subTextColor}
            secureTextEntry={secureText}
            value={value}
            onChangeText={setValue}
            autoFocus
          />
          {extraField && (
            <TextInput
              style={[modalStyles.input, { borderColor: colors.dividerColor, color: colors.textColor, marginTop: 10 }]}
              placeholder={extraField.placeholder}
              placeholderTextColor={colors.subTextColor}
              secureTextEntry
              value={extra}
              onChangeText={setExtra}
            />
          )}
          <TouchableOpacity
            style={[modalStyles.btn, { backgroundColor: GREEN, opacity: loading ? 0.7 : 1 }]}
            onPress={() => onConfirm(value, extra || undefined)}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={modalStyles.btnText}>Confirmar</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
            <Text style={{ color: colors.subTextColor, fontSize: 13, textAlign: "center" }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── modal QR Code 2FA ────────────────────────────────────────────────────────
function QRModal({ visible, qrCode, secret, onConfirm, onClose, loading }: {
  visible:   boolean;
  qrCode:    string;
  secret:    string;
  onConfirm: (code: string) => void;
  onClose:   () => void;
  loading:   boolean;
}) {
  const colors = useConfigColors();
  const [code, setCode] = useState("");

  useEffect(() => { if (!visible) setCode(""); }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.backdrop}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
          <View style={[modalStyles.card, { backgroundColor: colors.cardBg }]}>
            <Text style={[modalStyles.title, { color: colors.textColor }]}>
              Ativar autenticação de dois fatores
            </Text>
            <Text style={[modalStyles.sub, { color: colors.subTextColor }]}>
              Escaneie o QR Code abaixo com o Google Authenticator ou similar.
            </Text>

            {qrCode ? (
              <Image
                source={{ uri: qrCode }}
                style={{ width: 180, height: 180, alignSelf: "center", marginVertical: 16 }}
              />
            ) : (
              <ActivityIndicator color={GREEN} style={{ marginVertical: 24 }} />
            )}

            <Text style={[{ fontSize: 11, textAlign: "center", marginBottom: 16 }, { color: colors.subTextColor }]}>
              Ou insira manualmente: {"\n"}
              <Text style={{ fontWeight: "800", letterSpacing: 2, color: colors.textColor }}>{secret}</Text>
            </Text>

            <TextInput
              style={[modalStyles.input, { borderColor: colors.dividerColor, color: colors.textColor }]}
              placeholder="Código do aplicativo"
              placeholderTextColor={colors.subTextColor}
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />

            <TouchableOpacity
              style={[modalStyles.btn, { backgroundColor: GREEN, opacity: loading ? 0.7 : 1 }]}
              onPress={() => onConfirm(code)}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={modalStyles.btnText}>Verificar e ativar</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
              <Text style={{ color: colors.subTextColor, fontSize: 13, textAlign: "center" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── item de lista ────────────────────────────────────────────────────────────
function Item({ icon, label, sub, onPress, iconBg, danger }: {
  icon:   string;
  label:  string;
  sub?:   string;
  onPress: () => void;
  iconBg: string;
  danger?: boolean;
}) {
  const colors = useConfigColors();
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.itemIconWrap, { backgroundColor: iconBg }]}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={styles.itemText}>
        <Text style={[styles.itemLabel, { color: danger ? colors.dangerColor : colors.textColor }]}>
          {label}
        </Text>
        {sub && <Text style={[styles.itemSub, { color: colors.subTextColor }]}>{sub}</Text>}
      </View>
      <Text style={[styles.chevron, { color: colors.subTextColor }]}>›</Text>
    </TouchableOpacity>
  );
}

// ─── tela principal ───────────────────────────────────────────────────────────
export function ConfigScreen() {
  const navigation   = useNavigation<any>();
  const colors       = useConfigColors();
  const user         = useAuthStore((s) => s.user);
  const setUser      = useAuthStore((s) => s.setUser);
  const headerOpacity = useRef(new Animated.Value(0)).current;

  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // modais
type ModalType =
  | "verify-code"
  | "change-email"
  | "change-email-code"
  | "change-password"
  | "2fa-qr"
  | "2fa-disable"
  | null;

const [modal, setModal] = useState<ModalType>(null);

  const [qrCode,  setQrCode]  = useState("");
  const [secret,  setSecret]  = useState("");
  const [pending2FAEmail, setPending2FAEmail] = useState("");

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
  async function handleChangePassword(currentPassword: string, extra?: string) {
    setLoading(true);
    try {
      // extra = newPassword aqui — passamos os dois via campos separados
      // mas nosso InputModal só tem dois campos, então:
      // value = senhaAtual, extra = novaSenha
      await changePassword(currentPassword, extra ?? "");
      setModal(null);
      feedback("Senha alterada com sucesso!");
    } catch (e: any) {
      feedback(e.response?.data?.error ?? "Erro ao alterar senha.", true);
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
  async function handleLogout() {
    await logout();
    navigation.replace("Login");
  }

  const emailVerified    = user?.emailVerified    ?? false;
  const twoFactorEnabled = user?.twoFactorEnabled ?? false;

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <Text style={[styles.headerTitle, { color: colors.textColor }]}>Configurações</Text>
          <Text style={[styles.headerSub,   { color: colors.subTextColor }]}>
            Gerencie sua conta
          </Text>
        </Animated.View>

        {/* FEEDBACK */}
        {(error || success) && (
          <View style={{
            marginHorizontal: 20, marginBottom: 16,
            borderRadius: 12, padding: 14,
            backgroundColor: error ? "#fee2e2" : "#dcfce7",
          }}>
            <Text style={{ color: error ? "#ef4444" : "#16a34a", fontWeight: "700", fontSize: 13 }}>
              {error || success}
            </Text>
          </View>
        )}

        {/* EMAIL CARD */}
        <View style={[styles.emailCard, { backgroundColor: colors.cardBg }]}>
          <View style={styles.emailRow}>
            <View style={styles.emailInfo}>
              <Text style={[styles.emailLabel, { color: colors.subTextColor }]}>E-mail da conta</Text>
              <Text style={[styles.emailValue, { color: colors.textColor }]}>{user?.email ?? "..."}</Text>
            </View>
            <View style={[styles.verifiedBadge, {
              backgroundColor: emailVerified ? "#dcfce7" : "#fef9c3",
            }]}>
              <Text style={{ fontSize: 12 }}>{emailVerified ? "✓" : "!"}</Text>
              <Text style={[styles.verifiedText, {
                color: emailVerified ? "#16a34a" : "#ca8a04",
              }]}>
                {emailVerified ? "Confirmado" : "Pendente"}
              </Text>
            </View>
          </View>
        </View>

        {/* SEÇÃO EMAIL */}
        <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>E-mail</Text>
        <View style={[styles.section, { backgroundColor: colors.cardBg }]}>
          {!emailVerified && (
            <>
              <Item
                icon="📨"
                label="Confirmar e-mail"
                sub="Verifique sua caixa de entrada"
                iconBg="#fef9c3"
                onPress={handleSendVerify}
              />
              <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />
            </>
          )}
          <Item
            icon="✏️"
            label="Alterar e-mail"
            sub={twoFactorEnabled ? "Requer código do autenticador" : undefined}
            iconBg="#eff6ff"
            onPress={() => setModal("change-email")}
          />
        </View>

        {/* SEÇÃO SEGURANÇA */}
        <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>Segurança</Text>
        <View style={[styles.section, { backgroundColor: colors.cardBg }]}>
          <Item
            icon="🔑"
            label="Alterar senha"
            sub={twoFactorEnabled ? "Requer código do autenticador" : undefined}
            iconBg="#f5f3ff"
            onPress={() => setModal("change-password")}
          />
          <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />
          <Item
            icon={twoFactorEnabled ? "🛡️" : "🔓"}
            label={twoFactorEnabled ? "2FA ativo" : "Ativar autenticação 2FA"}
            sub={twoFactorEnabled ? "Toque para desativar" : "Proteja sua conta com TOTP"}
            iconBg={twoFactorEnabled ? "#dcfce7" : "#f0fdf4"}
            onPress={twoFactorEnabled ? () => setModal("2fa-disable") : handleSetup2FA}
          />
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* MODAIS */}
      <CodeModal
        visible={modal === "verify-code"}
        title="Confirmar e-mail"
        subtitle="Digite o código que enviamos para o seu e-mail."
        onConfirm={handleVerifyEmail}
        onClose={() => setModal(null)}
        loading={loading}
      />

      <InputModal
        visible={modal === "change-email"}
        title="Alterar e-mail"
        subtitle={twoFactorEnabled
          ? "Informe o novo e-mail e o código do autenticador."
          : "Informe o novo e-mail. Enviaremos um código de confirmação."}
        placeholder="Novo e-mail"
        extraField={twoFactorEnabled ? { placeholder: "Código do autenticador", label: "TOTP" } : undefined}
        onConfirm={(newEmail, totpCode) => handleChangeEmail(newEmail, totpCode)}
        onClose={() => setModal(null)}
        loading={loading}
      />

      <CodeModal
        visible={modal === "change-email-code"}
        title="Confirmar novo e-mail"
        subtitle={`Digite o código enviado para ${pending2FAEmail}.`}
        onConfirm={handleConfirmChangeEmail}
        onClose={() => setModal(null)}
        loading={loading}
      />

      <InputModal
        visible={modal === "change-password"}
        title="Alterar senha"
        subtitle={twoFactorEnabled
          ? "Informe a senha atual e a nova senha. O código do autenticador será solicitado."
          : "Informe a senha atual e a nova senha."}
        placeholder="Senha atual"
        extraField={{ placeholder: "Nova senha", label: "Nova senha" }}
        secureText
        onConfirm={(current, newPass) => handleChangePassword(current, newPass)}
        onClose={() => setModal(null)}
        loading={loading}
      />

      <QRModal
        visible={modal === "2fa-qr"}
        qrCode={qrCode}
        secret={secret}
        onConfirm={handleVerify2FA}
        onClose={() => setModal(null)}
        loading={loading}
      />

      <CodeModal
        visible={modal === "2fa-disable"}
        title="Desativar 2FA"
        subtitle="Digite o código do seu aplicativo autenticador para desativar."
        onConfirm={handleDisable2FA}
        onClose={() => setModal(null)}
        loading={loading}
      />
    </View>
  );
}

const modalStyles = StyleSheet.create({
  backdrop: {
    flex:            1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems:      "center",
    justifyContent:  "center",
    padding:         24,
  },
  card: {
    width:        "100%",
    borderRadius: 24,
    padding:      24,
  },
  title: {
    fontSize:      20,
    fontWeight:    "900",
    marginBottom:  8,
    letterSpacing: -0.4,
  },
  sub: {
    fontSize:     13,
    marginBottom: 20,
    lineHeight:   18,
  },
  input: {
    borderWidth:   1.5,
    borderRadius:  12,
    paddingHorizontal: 14,
    paddingVertical:   12,
    fontSize:      15,
  },
  btn: {
    borderRadius:   14,
    paddingVertical: 14,
    alignItems:     "center",
    marginTop:      16,
  },
  btnText: {
    color:      "#fff",
    fontWeight: "800",
    fontSize:   15,
  },
});
