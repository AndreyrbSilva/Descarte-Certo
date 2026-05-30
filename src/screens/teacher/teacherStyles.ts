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

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  headerDescription: {
    fontSize: 13,
    marginTop: 4,
  },

  // ── Quick Stats Bar ────────────────────────────────────────────────────────
  statsBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  statCard: {
    width: (width - 50) / 2,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
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
    fontWeight: "600",
    marginTop: 1,
  },

  // ── Motivation Card ────────────────────────────────────────────────────────
  motivationContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  motivationCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  motivationEmojiWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(20, 184, 166, 0.15)",
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
    marginBottom: 2,
  },
  motivationText: {
    fontSize: 12,
    lineHeight: 16,
  },

  // ── Streak Overview ────────────────────────────────────────────────────────
  streakContainer: {
    marginBottom: 24,
  },
  streakHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  streakSectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  streakScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  streakChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  streakChipAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  streakChipAvatarText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#fff",
  },
  streakChipName: {
    fontSize: 12,
    fontWeight: "700",
  },
  streakChipDays: {
    fontSize: 11,
    fontWeight: "800",
  },

  // ── Tab Switcher ───────────────────────────────────────────────────────────
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
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
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 11,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "800",
  },

  // ── Podium ─────────────────────────────────────────────────────────────────
  podium: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  podiumItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  podiumName: {
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },
  podiumPoints: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: -4,
  },
  podiumStreakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  podiumStreakText: {
    fontSize: 11,
    fontWeight: "700",
  },
  podiumBase: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  // ── Student Rank Card ──────────────────────────────────────────────────────
  listWrap: {
    paddingHorizontal: 20,
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
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
    gap: 2,
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
    fontWeight: "700",
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
    fontWeight: "700",
  },
});
