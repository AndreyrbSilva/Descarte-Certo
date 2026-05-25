import { useEffect, useState } from "react";
import {
  View, Text, TouchableOpacity,
  Animated, StatusBar,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as NavigationBar from "expo-navigation-bar";

import { useConfigColors, useAnimatedConfigColors } from "../../../theme/useConfigColors";
import { useTheme } from "../../../context/ThemeContext";
import { styles }   from "./configStyles";
import {
  IconMailCheck, IconMailEdit,
  IconResetPass, IconShield, IconSecureLock,
} from "../../../components/icons";

import { useConfigData }  from "./hooks/useConfigData";
import { ThemeToggle }    from "./components/ThemeToggle";
import { ConfigItem }     from "./components/ConfigItem";
import { CodeModal }      from "./modals/CodeModal";
import { InputModal }     from "./modals/InputModal";
import { QRModal }        from "./modals/QRModal";
import { LogoutModal }    from "./modals/LogoutModal";

export function ConfigScreen() {
  const { isDark: globalIsDark, setTheme } = useTheme();
  const [localIsDark, setLocalIsDark] = useState(globalIsDark);

  useEffect(() => {
    setLocalIsDark(globalIsDark);
  }, [globalIsDark]);

  const colors  = useConfigColors(localIsDark);
  const aColors = useAnimatedConfigColors(localIsDark);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(colors.bg);
    NavigationBar.setButtonStyleAsync(localIsDark ? "light" : "dark");
  }, [colors.bg, localIsDark]);

  const data = useConfigData(colors);

  function handleToggleTheme() {
    const next = !localIsDark;
    setLocalIsDark(next);
    import("react-native").then(({ DeviceEventEmitter }) => {
      DeviceEventEmitter.emit("onThemeToggle", next);
    });
    setTimeout(() => {
      setTheme(next ? "dark" : "light");
    }, 400);
  }

  return (
    <Animated.View style={[styles.root, { backgroundColor: aColors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <Animated.View style={[styles.header, { opacity: data.headerOpacity }]}>
          <Animated.Text style={[styles.headerTitle, { color: aColors.textColor }]}>Configurações</Animated.Text>
          <Animated.Text style={[styles.headerSub,   { color: aColors.subTextColor }]}>
            Gerencie sua conta
          </Animated.Text>
        </Animated.View>

        {/* FEEDBACK */}
        {(data.error || data.success) && (
          <View style={{
            marginHorizontal: 20, marginBottom: 16,
            borderRadius: 12, padding: 14,
            backgroundColor: data.error ? "#fee2e2" : "#dcfce7",
          }}>
            <Text style={{ color: data.error ? "#ef4444" : "#16a34a", fontWeight: "700", fontSize: 13 }}>
              {data.error || data.success}
            </Text>
          </View>
        )}

        {/* EMAIL CARD */}
        <Animated.View style={[styles.emailCard, { backgroundColor: aColors.cardBg }]}>
          <View style={styles.emailRow}>
            <View style={styles.emailInfo}>
              <Animated.Text style={[styles.emailLabel, { color: aColors.subTextColor }]}>E-mail da conta</Animated.Text>
              <Animated.Text style={[styles.emailValue, { color: aColors.textColor }]}>{data.user?.email ?? "..."}</Animated.Text>
            </View>
            <View style={[styles.verifiedBadge, {
              backgroundColor: data.emailVerified ? "#dcfce7" : "#fef9c3",
            }]}>
              <Text style={{ fontSize: 12 }}>{data.emailVerified ? "✓" : "!"}</Text>
              <Text style={[styles.verifiedText, {
                color: data.emailVerified ? "#16a34a" : "#ca8a04",
              }]}>
                {data.emailVerified ? "Confirmado" : "Pendente"}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* TEMA */}
        <Animated.Text style={[styles.sectionLabel, { color: aColors.sectionLabel }]}>Aparência</Animated.Text>
        <Animated.View style={[styles.section, { backgroundColor: aColors.cardBg, marginBottom: 18 }]}>
          <ThemeToggle isDark={localIsDark} onToggle={handleToggleTheme} aColors={aColors} />
        </Animated.View>

        {/* SEÇÃO EMAIL */}
        <Animated.Text style={[styles.sectionLabel, { color: aColors.sectionLabel }]}>E-mail</Animated.Text>
        <Animated.View style={[styles.section, { backgroundColor: aColors.cardBg }]}>
          {!data.emailVerified && (
            <>
              <ConfigItem
                icon={<IconMailCheck color="#ca8a04" size={25} />}
                label="Confirmar e-mail"
                sub="Verifique sua caixa de entrada"
                onPress={data.handleSendVerify}
                aColors={aColors}
              />
              <Animated.View style={[styles.divider, { backgroundColor: aColors.dividerColor }]} />
            </>
          )}
          <ConfigItem
            icon={<IconMailEdit color="#3b82f6" size={25} />}
            label="Alterar e-mail"
            sub={data.twoFactorEnabled ? "Requer código do autenticador" : undefined}
            onPress={() => data.setModal("change-email")}
            aColors={aColors}
          />
        </Animated.View>

        {/* SEÇÃO SEGURANÇA */}
        <Animated.Text style={[styles.sectionLabel, { color: aColors.sectionLabel }]}>Segurança</Animated.Text>
        <Animated.View style={[styles.section, { backgroundColor: aColors.cardBg }]}>
          <ConfigItem
            icon={<IconResetPass color="#7c3aed" size={25} />}
            label="Alterar senha"
            sub={data.twoFactorEnabled ? "Requer código do autenticador" : undefined}
            onPress={() => data.setModal("change-password")}
            aColors={aColors}
          />
          <Animated.View style={[styles.divider, { backgroundColor: aColors.dividerColor }]} />
          <ConfigItem
            icon={data.twoFactorEnabled ? <IconShield color="#16a34a" size={22} /> : <IconSecureLock color="#22c55e" size={22} />}
            label={data.twoFactorEnabled ? "2FA ativo" : "Ativar autenticação 2FA"}
            sub={data.twoFactorEnabled ? "Toque para desativar" : "Proteja sua conta com TOTP"}
            onPress={data.twoFactorEnabled ? () => data.setModal("2fa-disable") : data.handleSetup2FA}
            aColors={aColors}
          />
        </Animated.View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => data.setShowLogout(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* MODAIS */}
      <CodeModal
        visible={data.modal === "verify-code"}
        title="Confirmar e-mail"
        subtitle="Digite o código que enviamos para o seu e-mail."
        onConfirm={data.handleVerifyEmail}
        onClose={() => data.setModal(null)}
        loading={data.loading}
      />

      <InputModal
        visible={data.modal === "change-email"}
        title="Alterar e-mail"
        subtitle={data.twoFactorEnabled
          ? "Informe o novo e-mail e o código do autenticador."
          : "Informe o novo e-mail."}
        placeholder="Novo e-mail"
        showTotp={data.twoFactorEnabled}
        onConfirm={(newEmail, _, totp) => data.handleChangeEmail(newEmail, totp)}
        onClose={() => data.setModal(null)}
        loading={data.loading}
      />

      <CodeModal
        visible={data.modal === "change-email-code"}
        title="Confirmar novo e-mail"
        subtitle={`Digite o código enviado para ${data.pending2FAEmail}.`}
        onConfirm={data.handleConfirmChangeEmail}
        onClose={() => data.setModal(null)}
        loading={data.loading}
      />

      <InputModal
        visible={data.modal === "change-password"}
        title="Alterar senha"
        subtitle={data.twoFactorEnabled
          ? "Informe a senha atual, a nova senha e o código do autenticador."
          : "Informe a senha atual e a nova senha."}
        placeholder="Senha atual"
        extraField={{ placeholder: "Nova senha", label: "Nova senha" }}
        secureText
        showTotp={data.twoFactorEnabled}
        onConfirm={(current, newPass, totp) => data.handleChangePassword(current, newPass, totp)}
        onClose={() => data.setModal(null)}
        loading={data.loading}
      />

      <QRModal
        visible={data.modal === "2fa-qr"}
        qrCode={data.qrCode}
        secret={data.secret}
        onConfirm={data.handleVerify2FA}
        onClose={() => data.setModal(null)}
        loading={data.loading}
      />

      <CodeModal
        visible={data.modal === "2fa-disable"}
        title="Desativar 2FA"
        subtitle="Digite o código do seu aplicativo autenticador para desativar."
        onConfirm={data.handleDisable2FA}
        onClose={() => data.setModal(null)}
        loading={data.loading}
      />

      <LogoutModal
        visible={data.showLogout}
        onConfirm={data.confirmLogout}
        onClose={() => data.setShowLogout(false)}
      />
    </Animated.View>
  );
}
