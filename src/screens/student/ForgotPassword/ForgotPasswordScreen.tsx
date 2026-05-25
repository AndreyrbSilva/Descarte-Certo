import {
  View, Text, TextInput, TouchableOpacity,
  Animated, KeyboardAvoidingView, Platform,
  ScrollView,
} from "react-native";

import { GREEN }          from "../../../theme/colors";
import { IconMail, IconLock, IconEye, IconMailCheck, IconShieldCheck } from "../../../components/icons";
import { useThemeColors } from "../../../theme/useThemeColors";
import { styles }         from "./forgotPasswordStyles";

import { useForgotPasswordData } from "./hooks/useForgotPasswordData";

export function ForgotPasswordScreen() {
  const colors = useThemeColors();
  const d      = useForgotPasswordData();

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
        <Animated.View style={[styles.header, { opacity: d.headerAnim }]}>
          {d.step !== "success" && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => {
                if (d.step === "email") d.navigation.goBack();
                else if (d.step === "code") d.transitionTo("email");
                else if (d.step === "password") d.transitionTo("code");
              }}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          )}
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{d.headerTitles[d.step]}</Text>
            <Text style={styles.headerSub}>DESCARTE CERTO</Text>
          </View>
        </Animated.View>

        {/* CARD */}
        <Animated.View
          style={[styles.card, {
            backgroundColor: colors.cardBg,
            opacity: d.cardOpacity,
            transform: [{ translateY: d.cardAnim }],
          }]}
        >
          <Animated.View style={{ opacity: d.fadeAnim }}>
            {/* ══════════════ STEP 1: E-MAIL ══════════════ */}
            {d.step === "email" && (
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
                    borderColor: d.emailFocus ? GREEN : colors.inputBorder,
                  }]}>
                    <IconMail color={d.emailFocus ? GREEN : colors.iconColor} />
                    <TextInput
                      style={[styles.input, { color: colors.textColor }]}
                      placeholder="seu@email.com"
                      placeholderTextColor={colors.subTextColor}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={d.email}
                      onChangeText={d.setEmail}
                      onFocus={() => d.setEmailFocus(true)}
                      onBlur={() => d.setEmailFocus(false)}
                    />
                  </View>
                </View>

                {d.error !== "" && <Text style={styles.errorText}>{d.error}</Text>}

                <TouchableOpacity
                  style={[styles.primaryBtn, d.loading && { opacity: 0.7 }]}
                  onPress={d.handleSendCode}
                  disabled={d.loading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>
                    {d.loading ? "ENVIANDO..." : "ENVIAR CÓDIGO"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.backRow}>
                  <Text style={[styles.backText, { color: colors.subTextColor }]}>
                    Lembrou a senha?
                  </Text>
                  <TouchableOpacity onPress={() => d.navigation.goBack()}>
                    <Text style={styles.backLink}>Entrar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* ══════════════ STEP 2: CÓDIGO ══════════════ */}
            {d.step === "code" && (
              <>
                <View style={styles.sentIcon}>
                  <IconMailCheck color={GREEN} size={38} />
                </View>

                <Text style={[styles.cardTitle, { color: colors.textColor, textAlign: "center" }]}>
                  Código enviado!
                </Text>
                <Text style={[styles.cardSubtitle, { color: colors.subTextColor, textAlign: "center" }]}>
                  Enviamos um código de 6 dígitos para{"\n"}
                  <Text style={styles.emailHighlight}>{d.maskEmail(d.email)}</Text>
                </Text>

                <View style={styles.codeRow}>
                  {d.code.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={(ref) => { d.codeRefs.current[i] = ref; }}
                      style={[styles.codeInput, {
                        backgroundColor: colors.inputBg,
                        borderColor: digit ? GREEN : colors.inputBorder,
                        color: colors.textColor,
                      }]}
                      value={digit}
                      onChangeText={(t) => d.handleCodeChange(t, i)}
                      onKeyPress={(e) => d.handleCodeKeyPress(e, i)}
                      keyboardType="numeric"
                      maxLength={1}
                      selectTextOnFocus
                    />
                  ))}
                </View>

                {d.error !== "" && <Text style={styles.errorText}>{d.error}</Text>}

                <TouchableOpacity
                  style={[styles.primaryBtn, d.loading && { opacity: 0.7 }]}
                  onPress={d.handleVerifyCode}
                  disabled={d.loading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>
                    {d.loading ? "VERIFICANDO..." : "VERIFICAR"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.resendRow}>
                  <Text style={[styles.resendText, { color: colors.subTextColor }]}>
                    Não recebeu?
                  </Text>
                  <TouchableOpacity onPress={d.handleResendCode} disabled={d.countdown > 0}>
                    <Text style={[styles.resendLink, d.countdown > 0 && { opacity: 0.5 }]}>
                      {d.countdown > 0 ? `Reenviar (${d.countdown}s)` : "Reenviar"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.timerText, { color: colors.subTextColor }]}>
                  O código expira em 15 minutos
                </Text>
              </>
            )}

            {/* ══════════════ STEP 3: NOVA SENHA ══════════════ */}
            {d.step === "password" && (
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
                    borderColor: d.newPassFocus ? GREEN : colors.inputBorder,
                  }]}>
                    <IconLock color={d.newPassFocus ? GREEN : colors.iconColor} />
                    <TextInput
                      style={[styles.input, { color: colors.textColor }]}
                      placeholder="••••••••"
                      placeholderTextColor={colors.subTextColor}
                      secureTextEntry={!d.showNewPass}
                      value={d.newPass}
                      onChangeText={d.setNewPass}
                      onFocus={() => d.setNewPassFocus(true)}
                      onBlur={() => d.setNewPassFocus(false)}
                    />
                    <TouchableOpacity
                      onPress={() => d.setShowNewPass(!d.showNewPass)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <IconEye color={d.newPassFocus ? GREEN : colors.iconColor} off={!d.showNewPass} />
                    </TouchableOpacity>
                  </View>

                  {/* Barra de força */}
                  {d.newPass.length > 0 && (
                    <View style={{ marginTop: 10 }}>
                      <View style={styles.strengthTrack}>
                        <Animated.View style={[styles.strengthBar, {
                          width: d.barAnim.interpolate({
                            inputRange:  [0, 1],
                            outputRange: ["0%", "100%"],
                          }),
                          backgroundColor: d.strength.color,
                        }]} />
                      </View>
                      <View style={styles.strengthRow}>
                        <Text style={[styles.strengthLabel, { color: d.strength.color }]}>
                          {d.strength.emoji}  {d.strength.label}
                        </Text>
                        {d.isPasswordWeak && (
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
                    borderColor: d.confirmFocus ? GREEN : colors.inputBorder,
                  }]}>
                    <IconLock color={d.confirmFocus ? GREEN : colors.iconColor} />
                    <TextInput
                      style={[styles.input, { color: colors.textColor }]}
                      placeholder="••••••••"
                      placeholderTextColor={colors.subTextColor}
                      secureTextEntry={!d.showConfirmPass}
                      value={d.confirmPass}
                      onChangeText={d.setConfirmPass}
                      onFocus={() => d.setConfirmFocus(true)}
                      onBlur={() => d.setConfirmFocus(false)}
                    />
                    <TouchableOpacity
                      onPress={() => d.setShowConfirmPass(!d.showConfirmPass)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <IconEye color={d.confirmFocus ? GREEN : colors.iconColor} off={!d.showConfirmPass} />
                    </TouchableOpacity>
                  </View>
                </View>

                {d.error !== "" && <Text style={styles.errorText}>{d.error}</Text>}

                <TouchableOpacity
                  style={[styles.primaryBtn, d.loading && { opacity: 0.7 }]}
                  onPress={d.handleResetPassword}
                  disabled={d.loading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>
                    {d.loading ? "REDEFININDO..." : "REDEFINIR SENHA"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* ══════════════ STEP 4: SUCESSO ══════════════ */}
            {d.step === "success" && (
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
                  onPress={() => d.navigation.navigate("Login")}
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
