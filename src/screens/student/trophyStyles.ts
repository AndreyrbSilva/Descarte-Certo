import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  /* ── Header ────────────────────────────────── */
  header: {
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  headerIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBarWrap: {
    width: "100%",
    marginTop: 8,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "right",
  },

  /* ── Seção de tipo ─────────────────────────── */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionEmoji: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: "auto",
  },

  /* ── Card de troféu ────────────────────────── */
  trophyCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    gap: 12,
  },
  trophyIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  trophyInfo: {
    flex: 1,
    gap: 2,
  },
  trophyTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  trophyDesc: {
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 15,
  },
  trophyRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  trophyDate: {
    fontSize: 10,
    fontWeight: "600",
  },
  trophyProgressMini: {
    fontSize: 10,
    fontWeight: "700",
  },

  /* ── Progress bar mini ─────────────────────── */
  miniTrack: {
    width: 52,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  miniBar: {
    height: "100%",
    borderRadius: 2,
  },

  /* ── Reward badge ──────────────────────────── */
  rewardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
  },

  /* ── Unlocked check ────────────────────────── */
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── Back button ───────────────────────────── */
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backText: {
    fontSize: 17,
    fontWeight: "700",
  },
});
