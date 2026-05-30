import React, { useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useTeacherColors } from "../../theme/useTeacherColors";
import { styles } from "./teacherStyles";

// Hooks
import { useTeacherData } from "./hooks/useTeacherData";
import { useTeacherAnimations } from "./hooks/useTeacherAnimations";

// Componentes
import { TeacherStatsBar } from "./components/TeacherStatsBar";
import { MotivationCard } from "./components/MotivationCard";
import { StreakOverview } from "./components/StreakOverview";
import { TeacherPodium } from "./components/TeacherPodium";
import { StudentRankCard } from "./components/StudentRankCard";

export function TeacherScreen() {
  const d = useTeacherData();
  const anims = useTeacherAnimations();
  const colors = useTeacherColors();

  // Dispara animação de entrada uma vez após carregar os dados
  useEffect(() => {
    if (!d.loading) {
      anims.playEntrance();
    }
  }, [d.loading]);

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      {d.loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.textColor} />
          <Text style={[styles.loadingText, { color: colors.subTextColor }]}>
            Carregando painel do professor...
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER (Com animação de entrada) */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: anims.headerOpacity,
                transform: [{ translateY: anims.headerY }],
              },
            ]}
          >
            <Text style={[styles.headerSubtitle, { color: colors.textColor }]}>
              Painel do Docente
            </Text>
            <Text style={[styles.headerTitle, { color: colors.textColor }]}>
              Olá, Professor!
            </Text>
            <Text style={[styles.headerDescription, { color: colors.subTextColor }]}>
              Acompanhe e motive o engajamento de reciclagem dos seus alunos.
            </Text>
          </Animated.View>

          {/* QUICK STATS BAR (Com animação de entrada) */}
          <Animated.View
            style={{
              opacity: anims.statsOpacity,
              transform: [{ translateY: anims.statsY }],
            }}
          >
            <TeacherStatsBar stats={d.stats} />
          </Animated.View>

          {/* MOTIVATION CARD (Com animação de entrada) */}
          <Animated.View
            style={{
              opacity: anims.motivationOpacity,
              transform: [{ scale: anims.motivationScale }],
            }}
          >
            <MotivationCard data={d.motivation} />
          </Animated.View>

          {/* STREAK OVERVIEW (Com animação de entrada) */}
          <Animated.View style={{ opacity: anims.streakOpacity }}>
            <StreakOverview chips={d.streakChips} />
          </Animated.View>

          {/* TAB SWITCHER */}
          <View style={[styles.tabRow, { backgroundColor: colors.tabBg }]}>
            {/* Indicador Deslizante (Animated.spring) */}
            <Animated.View
              style={{
                position: "absolute",
                left: d.tabIndicatorLeft,
                width: "50%",
                top: 4,
                bottom: 4,
                borderRadius: 11,
                backgroundColor: colors.tabActive,
              }}
            />
            {(["turma", "escola"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={styles.tabBtn}
                onPress={() => d.switchTab(t)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: d.tab === t ? "#ffffff" : colors.tabInactive,
                    },
                  ]}
                >
                  {t === "turma" ? "Minha Turma" : "Escola"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* LISTA & PODIO (Com animação de cross-fade e fade-in stagger dos cards) */}
          <Animated.View style={{ opacity: d.listOpacity }}>
            {d.data.length === 0 ? (
              <View style={{ alignItems: "center", paddingVertical: 40, paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: colors.textColor, marginBottom: 4 }}>
                  Nenhum aluno no ranking! 🏃‍♂️
                </Text>
                <Text style={{ fontSize: 13, color: colors.subTextColor, textAlign: "center" }}>
                  Aguardando os primeiros registros de reciclagem para classificar a pontuação.
                </Text>
              </View>
            ) : (
              <>
                {/* PÓDIO */}
                <TeacherPodium
                  slots={d.podiumOrder}
                  showTurma={d.tab === "escola"}
                  onPressItem={(userId) =>
                    d.navigation.navigate("PublicProfile", { userId })
                  }
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
    </View>
  );
}
export default TeacherScreen;
