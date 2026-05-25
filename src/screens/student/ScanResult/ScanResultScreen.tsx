import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Animated, StatusBar, Image,
} from "react-native";

import { useScanResultColors } from "../../../theme/useScanResultColors";
import { styles }              from "./scanResultStyles";
import { IconTrophy, IconRecycle } from "../../../components/icons";
import { AchievementUnlockedModal } from "../../../components/modals/AchievementUnlockedModal";
import type { NewAchievement } from "../../../services/achievementService";

import {
  useScanResultData,
  CATEGORY_LABEL, CATEGORY_TIP, CATEGORY_BIN,
} from "./hooks/useScanResultData";

const GREEN = "#22c55e";

// ── Componente para exibir troféus em fila ───────────────
function AchievementQueue({ achievements }: { achievements: NewAchievement[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(achievements.length > 0);

  const current = achievements[index] ?? null;

  function handleClose() {
    const next = index + 1;
    if (next < achievements.length) {
      setIndex(next);
      setTimeout(() => setVisible(true), 300);
    } else {
      setVisible(false);
    }
  }

  if (!current) return null;

  return (
    <AchievementUnlockedModal
      achievement={current}
      visible={visible}
      onClose={handleClose}
    />
  );
}

export function ScanResultScreen() {
  const colors = useScanResultColors();
  const d      = useScanResultData();

  if (d.error) {
    return (
      <View style={[styles.root, {
        backgroundColor: colors.cardBg,
        alignItems: "center", justifyContent: "center", padding: 32,
      }]}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>😕</Text>
        <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 8, color: colors.textColor }}>
          Algo deu errado
        </Text>
        <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 32, color: colors.subTextColor }}>
          {d.error}
        </Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => d.navigation.goBack()}>
          <Text style={styles.btnPrimaryText}>TENTAR NOVAMENTE</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.cardBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* HEADER VERDE */}
        <Animated.View style={[styles.header, { opacity: d.headerAnim }]}>
          <View style={styles.iconWrap}>
            <IconRecycle color="#fff" size={36} />
          </View>
          <Animated.View style={[styles.pointsBadge, {
            transform: [{ scale: d.pointsScale }],
            opacity:   d.pointsOpacity,
          }]}>
            <Text style={styles.pointsEarned}>+{d.result?.pointsEarned ?? 0}</Text>
          </Animated.View>
          <Text style={styles.pointsLabel}>pontos ganhos!</Text>
        </Animated.View>

        {/* CARD RESULTADO */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity:   d.cardOpacity,
          transform: [{ translateY: d.cardAnim }],
        }]}>
          <Text style={[styles.cardTitle, { color: colors.textColor }]}>
            Boa, é um {CATEGORY_LABEL[d.result?.category] ?? "Resíduo"}!
          </Text>

          {d.photoUri ? (
            <Image source={{ uri: d.photoUri }} style={styles.photo} resizeMode="cover" />
          ) : (
            <Text style={{ color: "red" }}>sem foto</Text>
          )}

          <Text style={[styles.cardSub, { color: colors.subTextColor, marginTop: 12 }]}>
            {CATEGORY_TIP[d.result?.category] ?? "Continue reciclando!"}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />

          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.subTextColor }]}>Categoria</Text>
            <Text style={[styles.rowValue, { color: colors.textColor }]}>
              {CATEGORY_LABEL[d.result?.category] ?? "--"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.subTextColor }]}>Certeza</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.rowValue, { color: d.barColor }]}>
                {Math.round(d.confValue * 100)}%
              </Text>
              <View style={[styles.confidenceBar, { backgroundColor: colors.dividerColor }]}>
                <Animated.View
                  style={[
                    styles.confidenceBarFill,
                    {
                      backgroundColor: d.barColor,
                      width: d.confidenceAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.subTextColor }]}>Pontos ganhos</Text>
            <Text style={[styles.rowValue, { color: GREEN }]}>+{d.result?.pointsEarned ?? 0}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.subTextColor }]}>Total acumulado</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <IconTrophy color={GREEN} size={14} />
              <Text style={[styles.rowValue, { color: GREEN }]}>{d.result?.totalPoints ?? 0} pts</Text>
            </View>
          </View>
          {CATEGORY_BIN[d.result?.category] && (
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: colors.subTextColor }]}>Descartar em</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{
                  width: 12, height: 12, borderRadius: 6,
                  backgroundColor: CATEGORY_BIN[d.result?.category]?.color,
                }} />
                <Text style={[styles.rowValue, { color: colors.textColor }]}>
                  {CATEGORY_BIN[d.result?.category]?.label}
                </Text>
              </View>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />

          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => d.navigation.navigate("Tabs", { screen: "Scanner" })}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>ESCANEAR MAIS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnSecondary, { borderColor: colors.dividerColor }]}
            onPress={d.goHome}
            activeOpacity={0.7}
          >
            <Text style={[styles.btnSecondaryText, { color: colors.textColor }]}>
              Ir para o início
            </Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>

      {/* ACHIEVEMENT MODAL — mostra troféus desbloqueados sequencialmente */}
      <AchievementQueue achievements={d.result?.newAchievements ?? []} />
    </View>
  );
}
