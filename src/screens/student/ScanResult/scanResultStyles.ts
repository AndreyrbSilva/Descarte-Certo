import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");
const GREEN = "#22c55e";

export const styles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { flexGrow: 1, alignItems: "center", paddingBottom: 40 },

  // ── Header celebratório ────────────────────────────────
  header: {
    width: "100%",
    height: height * 0.40,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    overflow: "hidden",
  },
  celebrationText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "#ffffff25",
    alignItems: "center", justifyContent: "center",
    marginBottom: 16,
  },
  pointsBadge: {
    backgroundColor: "#ffffff20",
    borderRadius: 24,
    paddingHorizontal: 24, paddingVertical: 10,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pointsEarned: {
    fontSize: 38,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
  },
  pointsLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    fontWeight: "600",
  },

  // ── Confetti particles ────────────────────────────────
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    pointerEvents: "none",
  },
  confettiParticle: {
    position: "absolute",
    borderRadius: 3,
  },

  // ── Card principal ─────────────────────────────────────
  card: {
    width: "88%",
    borderRadius: 24,
    padding: 24,
    marginTop: -60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  divider: { height: 1, marginVertical: 16 },

  // ── Foto ───────────────────────────────────────────────
  photo: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 4,
  },

  // ── Seção Streak ─────────────────────────────────────
  streakSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  streakIconWrap: {
    width: 48, height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  streakRight: { flex: 1 },
  streakTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },
  streakMessage: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  streakBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  streakBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  streakNext: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "500",
  },

  // ── Seção Nível / XP ────────────────────────────────
  xpSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  xpHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  xpLevelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  xpLevelName: {
    fontSize: 15,
    fontWeight: "800",
  },
  xpPointsText: {
    fontSize: 12,
    fontWeight: "600",
  },
  xpBarBg: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  xpNextLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
  },

  // ── Seção Descarte ─────────────────────────────────
  binSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  binSectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  binIconWrap: {
    width: 64, height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  binLabel: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  binMaterial: {
    fontSize: 13,
    fontWeight: "600",
  },

  // ── Seção Curiosidade ──────────────────────────────
  curiositySection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  curiosityIconWrap: {
    width: 40, height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  curiosityTitle: {
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  curiosityText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },

  // ── Info rows (Categoria / Pontos / Total) ─────────
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rowLabel: { fontSize: 13 },
  rowValue: { fontSize: 13, fontWeight: "700" },

  // ── Botões ─────────────────────────────────────────
  btnPrimary: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  btnSecondary: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  btnSecondaryText: { fontWeight: "700", fontSize: 15 },
  btnTertiary: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  btnTertiaryText: { fontWeight: "600", fontSize: 14 },
});
