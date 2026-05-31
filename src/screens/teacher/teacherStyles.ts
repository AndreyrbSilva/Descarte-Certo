import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // ── Main Screen ────────────────────────────────────────────────────────────
  root: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 100,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },

  // ── New Header ─────────────────────────────────────────────────────────────
  newHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  headerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerAvatarText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#ffffff",
  },
  headerGreeting: {
    flex: 1,
    justifyContent: "center",
  },
  headerGreetingSub: {
    fontSize: 12,
    fontWeight: "700",
  },
  headerGreetingName: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginTop: -2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  // ── Class Pill ─────────────────────────────────────────────────────────────
  classPillRow: {
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: "row",
  },
  classPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 99,
    borderWidth: 1,
  },
  classPillText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#22c55e",
  },

  // ── Tab Switcher ───────────────────────────────────────────────────────────
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 14,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 11,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "800",
  },

  // ── Quick Stats Bar ────────────────────────────────────────────────────────
  statsBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },

  // ── Motivation Card ────────────────────────────────────────────────────────
  motivationContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  motivationCard: {
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  motivationEmojiWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  motivationEmoji: {
    fontSize: 24,
  },
  motivationContent: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 3,
  },
  motivationText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },

  // ── Ranking Title ──────────────────────────────────────────────────────────
  rankingTitleRow: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  rankingSectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },

  // ── Podium ─────────────────────────────────────────────────────────────────
  podium: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  podiumItem: {
    flex: 1,
    alignItems: "center",
  },
  podiumAvatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  podiumName: {
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
  podiumPoints: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: -2,
  },
  podiumStreakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  podiumStreakText: {
    fontSize: 11,
    fontWeight: "800",
  },
  podiumBase: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  // ── Student Rank Card ──────────────────────────────────────────────────────
  listWrap: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  position: {
    fontSize: 15,
    fontWeight: "900",
    width: 24,
    textAlign: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: "800",
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  streakText: {
    fontSize: 11,
    fontWeight: "800",
  },
  pointsCol: {
    alignItems: "flex-end",
  },
  points: {
    fontSize: 16,
    fontWeight: "900",
  },
  pointsLabel: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 1,
  },
});
