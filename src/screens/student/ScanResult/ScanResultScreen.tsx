import { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Animated, StatusBar, Image,
} from "react-native";

import { useScanResultColors }    from "../../../theme/useScanResultColors";
import { getStreakColors }         from "../../../theme/streakColors";
import { styles }                  from "./scanResultStyles";
import {
  IconRecycle, IconFlame, IconStar, IconBulb,
  IconCamera, IconHome, IconRanking,
  IconBin, IconCelebrate,
}                                  from "../../../components/icons";
import { AchievementUnlockedModal } from "../../../components/modals/AchievementUnlockedModal";
import type { NewAchievement }      from "../../../services/achievementService";

import {
  useScanResultData,
  CATEGORY_LABEL, CATEGORY_BIN,
} from "./hooks/useScanResultData";

const GREEN = "#22c55e";

// ── Confetti component ────────────────────────────────────
function ConfettiEffect({ anim }: { anim: Animated.Value }) {
  const particles = useMemo(() => {
    const colors = ["#22c55e", "#3b82f6", "#eab308", "#ef4444", "#a855f7", "#ec4899", "#06b6d4"];
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 4 + Math.random() * 6,
      color: colors[i % colors.length],
      delay: Math.random() * 400,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <View style={styles.confettiContainer}>
      {particles.map((p) => (
        <Animated.View
          key={p.id}
          style={[
            styles.confettiParticle,
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.6,
              backgroundColor: p.color,
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 350 + p.delay * 0.5],
                  }),
                },
                { rotate: `${p.rotation}deg` },
              ],
              opacity: anim.interpolate({
                inputRange: [0, 0.2, 0.8, 1],
                outputRange: [0, 1, 1, 0],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
}

// ── Achievement queue (mantido do original) ───────────────
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

// ── Tela principal ────────────────────────────────────────
export function ScanResultScreen() {
  const colors = useScanResultColors();
  const d      = useScanResultData();

  // ── Error state ─────────────────────────────────────
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

  const streakColors = getStreakColors(d.newStreak);
  const bin          = CATEGORY_BIN[d.result?.category];
  const streakProgress = d.nextStreakThreshold
    ? d.newStreak / d.nextStreakThreshold
    : 1;

  return (
    <View style={[styles.root, { backgroundColor: colors.cardBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── HEADER CELEBRATÓRIO ──────────────────────── */}
        <Animated.View style={[styles.header, { opacity: d.headerAnim }]}>
          <ConfettiEffect anim={d.confettiAnim} />

          <Animated.Text style={[styles.celebrationText, {
            transform: [{ scale: d.celebrationAnim }],
          }]}>
            {d.celebration}
          </Animated.Text>

          <View style={styles.iconWrap}>
            <IconCelebrate color="#fff" size={36} />
          </View>

          <Animated.View style={[styles.pointsBadge, {
            transform: [{ scale: d.pointsScale }],
            opacity:   d.pointsOpacity,
          }]}>
            <IconStar color="#fbbf24" size={22} />
            <Text style={styles.pointsEarned}>+{d.result?.pointsEarned ?? 0}</Text>
          </Animated.View>

          <Text style={styles.pointsLabel}>pontos ganhos!</Text>
        </Animated.View>

        {/* ── CARD PRINCIPAL ───────────────────────────── */}
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
          ) : null}

          {/* ── Pontos info ───────────────────────── */}
          <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />

          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.subTextColor }]}>Categoria</Text>
            <Text style={[styles.rowValue, { color: colors.textColor }]}>
              {CATEGORY_LABEL[d.result?.category] ?? "--"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.subTextColor }]}>Pontos ganhos</Text>
            <Text style={[styles.rowValue, { color: GREEN }]}>+{d.result?.pointsEarned ?? 0}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.subTextColor }]}>Total acumulado</Text>
            <Text style={[styles.rowValue, { color: GREEN }]}>{d.result?.totalPoints ?? 0} pts</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />

          {/* ── STREAK ────────────────────────────── */}
          <Animated.View style={[styles.streakSection, {
            backgroundColor: colors.streakBg,
            transform: [{ scale: d.streakAnim }],
          }]}>
            <View style={[styles.streakIconWrap, { backgroundColor: colors.streakIconBg }]}>
              <IconFlame
                outer={streakColors.outer}
                innerStart={streakColors.innerStart}
                innerEnd={streakColors.innerEnd}
                size={28}
              />
            </View>
            <View style={styles.streakRight}>
              <Text style={[styles.streakTitle, { color: colors.textColor }]}>
                {d.newStreak} {d.newStreak === 1 ? "dia" : "dias"} de sequência
              </Text>
              <Text style={[styles.streakMessage, { color: streakColors.outer }]}>
                {d.streakMessage}
              </Text>
              <View style={[styles.streakBarBg, { backgroundColor: colors.streakBarBg }]}>
                <View style={[
                  styles.streakBarFill,
                  {
                    backgroundColor: streakColors.outer,
                    width: `${Math.min(streakProgress * 100, 100)}%`,
                  },
                ]} />
              </View>
              {d.nextStreakThreshold && (
                <Text style={[styles.streakNext, { color: colors.subTextColor }]}>
                  Próximo nível: {d.nextStreakThreshold} dias
                </Text>
              )}
            </View>
          </Animated.View>

          {/* ── XP / NÍVEL ────────────────────────── */}
          {d.levelInfo && (
            <View style={[styles.xpSection, { backgroundColor: colors.xpBg }]}>
              <View style={styles.xpHeader}>
                <View style={styles.xpLevelRow}>
                  <IconStar color={GREEN} size={18} />
                  <Text style={[styles.xpLevelName, { color: colors.textColor }]}>
                    {d.levelInfo.currentName}
                  </Text>
                </View>
                {d.levelInfo.pointsToNext && (
                  <Text style={[styles.xpPointsText, { color: colors.subTextColor }]}>
                    {d.levelInfo.pointsInLevel}/{d.levelInfo.pointsToNext} pts
                  </Text>
                )}
              </View>
              <View style={[styles.xpBarBg, { backgroundColor: colors.xpBarBg }]}>
                <Animated.View style={[
                  styles.xpBarFill,
                  { backgroundColor: colors.xpBarFill, width: d.xpWidth },
                ]} />
              </View>
              {d.levelInfo.nextName ? (
                <Text style={[styles.xpNextLabel, { color: colors.subTextColor }]}>
                  Faltam {(d.levelInfo.pointsToNext ?? 0) - d.levelInfo.pointsInLevel} pts para {d.levelInfo.nextName}
                </Text>
              ) : (
                <Text style={[styles.xpNextLabel, { color: GREEN }]}>
                  Nível máximo alcançado!
                </Text>
              )}
            </View>
          )}

          {/* ── DESCARTE ──────────────────────────── */}
          {bin && (
            <View style={[styles.binSection, { backgroundColor: colors.binBg }]}>
              <Text style={[styles.binSectionTitle, { color: colors.subTextColor }]}>
                Onde descartar?
              </Text>
              <View style={[styles.binIconWrap, { backgroundColor: bin.color + "20" }]}>
                <IconBin color={bin.color} size={32} />
              </View>
              <Text style={[styles.binLabel, { color: bin.color }]}>
                {bin.label}
              </Text>
              <Text style={[styles.binMaterial, { color: colors.subTextColor }]}>
                {bin.material}
              </Text>
            </View>
          )}

          {/* ── CURIOSIDADE ───────────────────────── */}
          <View style={[styles.curiositySection, { backgroundColor: colors.curiosityBg }]}>
            <View style={[styles.curiosityIconWrap, { backgroundColor: colors.curiosityIconBg }]}>
              <IconBulb color={colors.curiosityAccent} size={22} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.curiosityTitle, { color: colors.curiosityAccent }]}>
                Você sabia?
              </Text>
              <Text style={[styles.curiosityText, { color: colors.textColor }]}>
                {d.curiosity}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />

          {/* ── BOTÕES GAMIFICADOS ─────────────────── */}
          <Animated.View style={{ transform: [{ scale: d.btnPulse }] }}>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={d.goScan}
              activeOpacity={0.85}
            >
              <IconCamera color="#fff" size={18} />
              <Text style={styles.btnPrimaryText}>ESCANEAR OUTRO ITEM</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={[styles.btnSecondary, { borderColor: colors.dividerColor }]}
            onPress={d.goRanking}
            activeOpacity={0.7}
          >
            <IconRanking color={GREEN} size={18} />
            <Text style={[styles.btnSecondaryText, { color: colors.textColor }]}>
              Ver meu ranking
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnTertiary}
            onPress={d.goHome}
            activeOpacity={0.7}
          >
            <IconHome color={colors.subTextColor} size={16} />
            <Text style={[styles.btnTertiaryText, { color: colors.subTextColor }]}>
              Voltar pro início
            </Text>
          </TouchableOpacity>

        </Animated.View>

      </ScrollView>

      {/* ACHIEVEMENT MODAL — mostra troféus desbloqueados sequencialmente */}
      <AchievementQueue achievements={d.result?.newAchievements ?? []} />
    </View>
  );
}
