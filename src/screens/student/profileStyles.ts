import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
const GREEN = "#22c55e";

export const styles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingBottom: 40 },

  // header
  header: {
    paddingTop: 56, paddingBottom: 28,
    alignItems: "center",
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
  },
  avatarWrap: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: "center", justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  avatarImg:   { width: 90, height: 90, borderRadius: 45 },
  avatarText:  { fontSize: 36, fontWeight: "900", color: "#fff" },
  cameraIcon: {
    position: "absolute", bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: GREEN,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#fff",
  },
  userName:  { fontSize: 22, fontWeight: "900", color: "#fff", letterSpacing: -0.5 },
  userTurma: { fontSize: 14, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  levelBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#ffffff25",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    marginTop: 10,
  },
  levelText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  statsRow: {
    flexDirection: "row", gap: 12,
    marginHorizontal: 20, marginTop: 25, marginBottom: 14,
  },
  statCard: {
    flex: 1, borderRadius: 20, padding: 16,
    alignItems: "flex-start",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 10, elevation: 5,
  },
  statNumber: { fontSize: 28, fontWeight: "900", color: "#fff", letterSpacing: -1, marginTop: 6 },
  statLabel:  { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 },

  // cards
  card: {
    marginHorizontal: 20, marginBottom: 14,
    borderRadius: 20, padding: 18,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", marginBottom: 20, letterSpacing: -0.3, textAlign: "center" },

  // ranking
  rankRow:   { flexDirection: "row", justifyContent: "space-around" },
  rankItem:  { alignItems: "center", gap: 4 },
  rankNum:   { fontSize: 26, fontWeight: "900" },
  rankLabel: { fontSize: 12 },

  // filtros de tempo
  filterRow: {
    flexDirection: "row", gap: 8, marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20,
  },
  filterChipText: { fontSize: 12, fontWeight: "700" },

  // histórico
  scanItem: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 10,
  },
  scanIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  scanCategory: { fontSize: 14, fontWeight: "700" },
  scanDate:     { fontSize: 12, marginTop: 1 },
  scanPoints:   { fontSize: 15, fontWeight: "800", marginLeft: "auto" },
  divider:      { height: 1, marginVertical: 2 },

  // expandir/recolher
  expandBtn: {
    marginTop: 12, alignItems: "center", paddingVertical: 8,
  },
  expandBtnText: { fontSize: 13, fontWeight: "700" },

  // logout
  logoutBtn: {
    marginHorizontal: 20, marginTop: 8, marginBottom: 20,
    borderRadius: 14, paddingVertical: 15,
    alignItems: "center", borderWidth: 1.5,
    borderColor: "#ef4444",
  },
  logoutText: { color: "#ef4444", fontWeight: "700", fontSize: 15 },

  avatarOverlay: {
    position: "absolute",
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center", justifyContent: "center",
  },

  xpBarWrap: { width: "75%", alignItems: "center", marginTop: 10, gap: 6 },
  xpBarBg:   { width: "100%", height: 6, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.25)", overflow: "hidden" },
  xpBarFill: { height: 6, borderRadius: 99, backgroundColor: "#fff" },
  xpLabel:   { fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: "600" },
});
