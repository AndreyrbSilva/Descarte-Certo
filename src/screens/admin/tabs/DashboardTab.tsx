import { TouchableOpacity as RN_TouchableOpacity, Animated, ScrollView } from "react-native";
const { View, Text } = Animated;
const TouchableOpacity = Animated.createAnimatedComponent(RN_TouchableOpacity);
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { useAdminColors } from "../../../theme/useAdminColors";
import type { AdminStats, WeekDay, TurmaRealData } from "../admin.types";
import { StatCard } from "../../../components/admin/StatCard";
import { RoleBadge } from "../../../components/admin/RoleBadge";
import { styles } from "../adminStyles";
import {
  IconUser, IconRecycle, IconStar, IconClasses,
  IconTrend, IconMedal,
} from "../../../components/icons";

interface DashboardTabProps {
  stats:          AdminStats | null;
  WEEK_DAYS:      WeekDay[];
  turmasRealData: TurmaRealData[];
  colors:         ReturnType<typeof useAdminColors>;
  aColors?:       any;
  insets:         ReturnType<typeof useSafeAreaInsets>;
  s0Opacity: Animated.Value; s0Y: Animated.Value;
  s1Opacity: Animated.Value; s1Y: Animated.Value;
  s2Opacity: Animated.Value; s2Y: Animated.Value;
  s3Opacity: Animated.Value; s3Y: Animated.Value;
  listOpacity: Animated.Value; listY: Animated.Value;
  onOpenCreateUser:  () => void;
  onOpenTurmaDetail: (turma: string) => void;
}

export function DashboardTab({
  stats, WEEK_DAYS, turmasRealData, colors, aColors, insets,
  s0Opacity, s0Y, s1Opacity, s1Y, s2Opacity, s2Y, s3Opacity, s3Y,
  listOpacity, listY,
  onOpenCreateUser, onOpenTurmaDetail,
}: DashboardTabProps) {
  const c = aColors || colors;
  return (
    <ScrollView
      contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Grid de Estatísticas ───────────────────────────────────────────── */}
      <Text style={[styles.sectionLabel, { color: c.subTextColor }]}>DADOS GERAIS</Text>
      <View style={styles.statsRow}>
        <StatCard
          icon={<IconUser color="#22c55e" />}
          label="Total Alunos" value={stats?.totalUsers ?? 0} accent="#22c55e"
          colors={c} animOpacity={s0Opacity} animY={s0Y}
        />
        <StatCard
          icon={<IconRecycle color="#f97316" />}
          label="Total Scans" value={stats?.totalScans ?? 0} accent="#f97316"
          colors={c} animOpacity={s1Opacity} animY={s1Y}
        />
      </View>
      <View style={styles.statsRow}>
        <StatCard
          icon={<IconStar color="#3b82f6" />}
          label="Pontos Escolares" value={(stats?.totalPoints ?? 0).toLocaleString("pt-BR")} accent="#3b82f6"
          colors={c} animOpacity={s2Opacity} animY={s2Y}
        />
        <StatCard
          icon={<IconClasses color="#a855f7" size={22} />}
          label="Total Turmas" value={stats?.turmas.length ?? 0} accent="#a855f7"
          colors={c} animOpacity={s3Opacity} animY={s3Y}
        />
      </View>

      {/* ── Ações Rápidas ─────────────────────────────────────────────────── */}
      <Animated.View style={{ opacity: s0Opacity, transform: [{ translateY: s0Y }] }}>
        <Text style={[styles.sectionLabel, { color: c.subTextColor, marginTop: 8 }]}>
          AÇÕES RÁPIDAS
        </Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            onPress={onOpenCreateUser}
            style={[styles.quickActionBtn, { backgroundColor: c.cardBg }]}
            activeOpacity={0.8}
          >
            <View style={[styles.quickActionIconWrap, { backgroundColor: "#22c55e12" }]}>
              <IconUser color="#22c55e" size={18} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.quickActionTitle, { color: c.textColor }]}>Novo Cadastro</Text>
              <Text style={[styles.quickActionDesc,  { color: c.subTextColor }]}>Aluno ou Professor</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Gráfico Semanal ───────────────────────────────────────────────── */}
      <Animated.View style={{ opacity: s1Opacity, transform: [{ translateY: s1Y }] }}>
        <Text style={[styles.sectionLabel, { color: c.subTextColor, marginTop: 8 }]}>
          DESEMPENHO DA SEMANA
        </Text>
        <View style={[styles.card, { backgroundColor: c.cardBg }]}>
          <View style={styles.chartTitleRow}>
            <IconTrend color="#22c55e" size={18} />
            <Text style={[styles.chartTitleText, { color: c.textColor }]}>
              Volume de Coleta Diário
            </Text>
          </View>
          <Text style={[styles.chartSubText, { color: c.subTextColor }]}>
            Média de descartes por dia útil da semana (Seg - Sex).
          </Text>
          <View style={styles.chartBarsContainer}>
            {WEEK_DAYS.map((d, index) => (
              <View key={d.day} style={styles.chartColumn}>
                <Text style={[styles.chartBarValue, { color: c.textColor }]}>{d.count}</Text>
                <View style={[styles.chartBarTrack, { backgroundColor: c.dividerColor }]}>
                  <View style={[
                    styles.chartBarFill,
                    {
                      height: `${d.percentage}%`,
                      backgroundColor: index === 2 ? "#22c55e" : "#22c55e90",
                    },
                  ]} />
                </View>
                <Text style={[styles.chartBarLabel, { color: c.subTextColor }]}>{d.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* ── Ranking de Turmas ─────────────────────────────────────────────── */}
      {turmasRealData.length > 0 && (
        <Animated.View style={{ opacity: listOpacity, transform: [{ translateY: listY }] }}>
          <Text style={[styles.sectionLabel, { color: c.subTextColor, marginTop: 8 }]}>
            RANKING DE TURMAS
          </Text>
          <View style={[styles.card, { backgroundColor: c.cardBg }]}>
            {turmasRealData.map((t, i) => {
              const maxScans = Math.max(1, ...turmasRealData.map((x) => x.scansCount));
              const pct      = (t.scansCount / maxScans) * 100;
              return (
                <View key={t.turma} style={{ marginVertical: 4 }}>
                  <TouchableOpacity
                    onPress={() => onOpenTurmaDetail(t.turma)}
                    activeOpacity={0.7}
                    style={styles.rankItemRow}
                  >
                    {i < 3 ? (
                      <IconMedal type={i === 0 ? "gold" : i === 1 ? "silver" : "bronze"} size={26} />
                    ) : (
                      <View style={styles.rankIconCircle}>
                        <Text style={styles.rankNumberText}>{i + 1}</Text>
                      </View>
                    )}
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={[styles.rankTurmaName, { color: c.textColor }]}>
                        Turma {t.turma}
                      </Text>
                      <Text style={{ fontSize: 11, color: c.subTextColor }}>
                        {t.membersCount} {t.membersCount === 1 ? "aluno" : "alunos"} (Ver alunos ➔)
                      </Text>
                    </View>
                    <Text style={[styles.rankTurmaCount, { color: "#22c55e" }]}>{t.scansCount} Scans</Text>
                  </TouchableOpacity>
                  <View style={[styles.progressTrack, { backgroundColor: c.dividerColor, marginLeft: 34 }]}>
                    <View style={[styles.progressBar, { width: `${pct}%`, backgroundColor: "#22c55e" }]} />
                  </View>
                  {i < turmasRealData.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: c.dividerColor, marginVertical: 8, marginLeft: 34 }]} />
                  )}
                </View>
              );
            })}
          </View>
        </Animated.View>
      )}

      {/* ── Distribuição de Cargos ────────────────────────────────────────── */}
      {stats && stats.roles.length > 0 && (
        <Animated.View style={{ opacity: listOpacity, transform: [{ translateY: listY }] }}>
          <Text style={[styles.sectionLabel, { color: c.subTextColor, marginTop: 8 }]}>
            CARGOS REGISTRADOS
          </Text>
          <View style={[styles.card, { backgroundColor: c.cardBg }]}>
            {stats.roles.map((r, i) => (
              <View key={r.role}>
                <View style={styles.roleDistributionRow}>
                  <RoleBadge role={r.role} colors={c} />
                  <Text style={[styles.rolePercent, { color: c.textColor }]}>
                    {((r.count / (stats.totalUsers || 1)) * 100).toFixed(0)}%
                  </Text>
                  <Text style={[styles.roleCountNum, { color: c.subTextColor }]}>
                    {r.count} {r.count === 1 ? "usuário" : "usuários"}
                  </Text>
                </View>
                {i < stats.roles.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: c.dividerColor, marginVertical: 8 }]} />
                )}
              </View>
            ))}
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
}
