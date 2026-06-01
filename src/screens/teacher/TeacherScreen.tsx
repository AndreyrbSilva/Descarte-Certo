import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useAnimatedTeacherColors } from "../../theme/useTeacherColors";
import { useTheme } from "../../context/ThemeContext";
import { useAuthStore } from "../../store/useAuthStore";
import { logout } from "../../services/authService";
import { styles } from "./teacherStyles";

// Hooks
import { useTeacherData } from "./hooks/useTeacherData";
import { useTeacherAnimations } from "./hooks/useTeacherAnimations";

// Componentes
import { TeacherStatsBar } from "./components/TeacherStatsBar";
import { MotivationCard } from "./components/MotivationCard";
import { TeacherPodium } from "./components/TeacherPodium";
import { StudentRankCard } from "./components/StudentRankCard";
import { LogoutModal } from "../student/Config/modals/LogoutModal";
import { IconSun, IconMoonStars, IconLogout } from "../../components/icons";

export function TeacherScreen() {
  const d = useTeacherData();
  const anims = useTeacherAnimations();

  const { isDark: globalIsDark, setTheme } = useTheme();
  const [localIsDark, setLocalIsDark] = useState(globalIsDark);
  const [showLogout, setShowLogout] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const user = useAuthStore((state) => state.user);
  const aColors = useAnimatedTeacherColors(localIsDark);

  useEffect(() => {
    setLocalIsDark(globalIsDark);
  }, [globalIsDark]);

  // Dispara animação de entrada uma vez após carregar os dados
  useEffect(() => {
    if (!d.loading) {
      anims.playEntrance();
    }
  }, [d.loading]);

  function handleToggleTheme() {
    const next = !localIsDark;
    setLocalIsDark(next);
    import("react-native").then(({ DeviceEventEmitter }) => {
      DeviceEventEmitter.emit("onThemeToggle", next);
    });
    setTheme(next ? "dark" : "light");
  }

  async function handleConfirmLogout() {
    try {
      setLogoutLoading(true);
      await logout();
      d.navigation.replace("Login");
    } catch (e) {
      console.warn("Erro ao deslogar:", e);
    } finally {
      setLogoutLoading(false);
      setShowLogout(false);
    }
  }

  return (
    <Animated.View style={[styles.root, { backgroundColor: aColors.bg }]}>
      <StatusBar barStyle={aColors.statusBar} backgroundColor={localIsDark ? "#0f172a" : "#f8fafc"} />

      {d.loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Animated.Text style={[styles.loadingText, { color: aColors.subTextColor }]}>
            Carregando painel do professor...
          </Animated.Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER DINÂMICO */}
          <Animated.View
            style={[
              styles.newHeader,
              {
                opacity: anims.headerOpacity,
                transform: [{ translateY: anims.headerY }],
              },
            ]}
          >
            <View style={styles.headerLeft}>
              <View style={[styles.headerAvatar, { backgroundColor: "#3b82f6" }]}>
                <Text style={styles.headerAvatarText}>
                  {user?.name?.[0]?.toUpperCase() || "T"}
                </Text>
              </View>
              <View style={styles.headerGreeting}>
                <Animated.Text style={[styles.headerGreetingSub, { color: aColors.subTextColor }]}>
                  Olá, Professor(a)
                </Animated.Text>
                <Animated.Text style={[styles.headerGreetingName, { color: aColors.textColor }]} numberOfLines={1}>
                  {user?.name || "Professor"}
                </Animated.Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              {/* Alternador de tema suave */}
              <TouchableOpacity
                style={[styles.headerBtn, { backgroundColor: localIsDark ? "#1e293b" : "#ffffff", borderColor: localIsDark ? "#334155" : "#e2e8f0" }]}
                onPress={handleToggleTheme}
                activeOpacity={0.7}
              >
                {localIsDark ? (
                  <IconSun color="#f59e0b" size={20} />
                ) : (
                  <IconMoonStars color="#64748b" size={20} />
                )}
              </TouchableOpacity>

              {/* Botão deslogar */}
              <TouchableOpacity
                style={[styles.headerBtn, { backgroundColor: localIsDark ? "#1e293b" : "#ffffff", borderColor: localIsDark ? "#334155" : "#e2e8f0" }]}
                onPress={() => setShowLogout(true)}
                activeOpacity={0.7}
              >
                <IconLogout color="#ef4444" size={20} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* CLASSE PILL BADGE */}
          {d.turmaLabel ? (
            <View style={styles.classPillRow}>
              <View
                style={[
                  styles.classPill,
                  {
                    backgroundColor: localIsDark ? "rgba(34, 197, 94, 0.15)" : "#f0fdf4",
                    borderColor: "rgba(34, 197, 94, 0.4)",
                  },
                ]}
              >
                <Text style={styles.classPillText}>
                  📚 Turma {d.turmaLabel}
                </Text>
              </View>
            </View>
          ) : null}

          {/* TAB SWITCHER */}
          <Animated.View style={[styles.tabRow, { backgroundColor: aColors.tabBg }]}>
            {/* Indicador Deslizante (Animated.spring) */}
            <Animated.View
              style={{
                position: "absolute",
                left: d.tabIndicatorLeft,
                width: "50%",
                top: 4,
                bottom: 4,
                borderRadius: 11,
                backgroundColor: aColors.tabActive,
              }}
            />
            {(["turma", "escola"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={styles.tabBtn}
                onPress={() => d.switchTab(t)}
                activeOpacity={0.7}
              >
                <Animated.Text
                  style={[
                    styles.tabText,
                    {
                      color: d.tab === t ? "#ffffff" : aColors.tabInactive,
                    },
                  ]}
                >
                  {t === "turma" ? "Minha Turma" : "Escola"}
                </Animated.Text>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* QUICK STATS BAR */}
          <Animated.View
            style={{
              opacity: anims.statsOpacity,
              transform: [{ translateY: anims.statsY }],
            }}
          >
            <TeacherStatsBar stats={d.stats} isDark={localIsDark} />
          </Animated.View>

          {/* MOTIVATION CARD */}
          <Animated.View
            style={{
              opacity: anims.motivationOpacity,
              transform: [{ scale: anims.motivationScale }],
            }}
          >
            <MotivationCard data={d.motivation} isDark={localIsDark} />
          </Animated.View>

          {/* LISTA & PODIO COM RACHADURAS EM CROSS-FADE */}
          <Animated.View style={{ opacity: d.listOpacity }}>
            {d.data.length === 0 ? (
              <View style={{ alignItems: "center", paddingVertical: 40, paddingHorizontal: 20 }}>
                <Animated.Text style={{ fontSize: 16, fontWeight: "800", color: aColors.textColor, marginBottom: 4 }}>
                  Nenhum aluno no ranking! 🏃‍♂️
                </Animated.Text>
                <Animated.Text style={{ fontSize: 13, color: aColors.subTextColor, textAlign: "center" }}>
                  Aguardando os primeiros registros de reciclagem para classificar a pontuação.
                </Animated.Text>
              </View>
            ) : (
              <>
                {/* RANKING SECTION TITLE */}
                <View style={styles.rankingTitleRow}>
                  <Animated.Text style={[styles.rankingSectionTitle, { color: aColors.subTextColor }]}>
                    🏆 RANKING DA {d.tab === "turma" ? "TURMA" : "ESCOLA"}
                  </Animated.Text>
                </View>

                {/* PÓDIO */}
                <TeacherPodium
                  slots={d.podiumOrder}
                  showTurma={d.tab === "escola"}
                  onPressItem={(userId) =>
                    d.navigation.navigate("PublicProfile", { userId })
                  }
                  isDark={localIsDark}
                />

                {/* LISTA DE CARDS */}
                <View style={styles.listWrap}>
                  {d.rest.map((entry, index) => {
                    const cardAnim = d.cardAnims[index + 3] || d.cardAnims[0];
                    return (
                      <Animated.View
                        key={entry.userId}
                        style={{
                          opacity: cardAnim.opacity,
                          transform: [{ translateY: cardAnim.y }],
                        }}
                      >
                        <StudentRankCard
                          entry={entry}
                          showTurma={d.tab === "escola"}
                          onPress={() =>
                            d.navigation.navigate("PublicProfile", { userId: entry.userId })
                          }
                          isDark={localIsDark}
                        />
                      </Animated.View>
                    );
                  })}
                </View>
              </>
            )}
          </Animated.View>
        </ScrollView>
      )}

      {/* CONFIRMAÇÃO DE SAÍDA */}
      <LogoutModal
        visible={showLogout}
        onConfirm={handleConfirmLogout}
        onClose={() => setShowLogout(false)}
      />
    </Animated.View>
  );
}
export default TeacherScreen;
