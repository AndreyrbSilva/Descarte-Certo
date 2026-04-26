import { StyleSheet, Dimensions } from "react-native";

const ORANGE = "#f97316";
const BLUE   = "#3b82f6";

export const styles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20 },

  // Header
  header:      { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar:      { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", marginRight: 12 },
  avatarText:  { fontSize: 20, fontWeight: "800", color: "#fff" },
  headerInfo:  { flex: 1 },
  headerHello: { fontSize: 13, color: "rgba(255,255,255,0.75)" },
  headerName:  { fontSize: 18, fontWeight: "800", color: "#fff" },
  logoutBtn:   { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },

  // Card base
  card: {
    borderRadius: 20, padding: 18, marginBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },

  // Nível
  levelRow:    { flexDirection: "row", alignItems: "center" },
  levelLabel:  { fontSize: 12, marginBottom: 2 },
  levelName:   { fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
  trophyRow:   { flexDirection: "row", alignItems: "center", marginTop: 6 },
  trophyText:  { fontSize: 12, fontWeight: "600" },
  pointsBlock: { alignItems: "flex-end" },
  pointsNumber:{ fontSize: 36, fontWeight: "900", letterSpacing: -1 },
  pointsLabel: { fontSize: 12, marginTop: -4 },

  // Rankings
  rankRow:  { flexDirection: "row", gap: 12, marginBottom: 14 },
  rankCard: {
    flex: 1, borderRadius: 20, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 10, elevation: 5,
  },
  rankSub: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 6, marginBottom: 2 },
  rankNum: { fontSize: 28, fontWeight: "900", color: "#fff", letterSpacing: -1 },

  // Botão escanear
  scanBtn: {
    borderRadius: 20, paddingVertical: 18,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    shadowColor: "#16a34a", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 14, elevation: 8,
  },
  scanText: { fontSize: 18, fontWeight: "800", color: "#fff", letterSpacing: 0.3 },

  // Missão
  missionHeader:  { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  missionIconWrap:{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 12 },
  missionLabel:   { fontSize: 11, marginBottom: 2 },
  missionText:    { fontSize: 14, fontWeight: "700", lineHeight: 20 },
  progressTrack:  { height: 8, borderRadius: 4, overflow: "hidden" },
  progressBar:    { height: "100%", borderRadius: 4 },
  progressPct:    { fontSize: 11, textAlign: "right", marginTop: 6 },

  // Você sabia
  factCard:     { backgroundColor: BLUE },
  factTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  factTitle:    { fontSize: 14, fontWeight: "800", color: "#fff" },
  factText:     { fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 20 },

  // Último escaneamento
  lastLabel:   { fontSize: 12, marginBottom: 10 },
  lastRow:     { flexDirection: "row", alignItems: "center" },
  lastIconWrap:{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 12 },
  lastCategory:{ fontSize: 15, fontWeight: "700" },
  lastDate:    { fontSize: 12 },
  lastPoints:  { fontSize: 18, fontWeight: "800" },

  // Modal logout
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center", justifyContent: "center", paddingHorizontal: 32,
  },
  modalCard: {
    width: "100%", borderRadius: 24, padding: 24, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  modalIconWrap: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#dcfce7", alignItems: "center",
    justifyContent: "center", marginBottom: 16,
  },
  modalTitle:          { fontSize: 20, fontWeight: "800", marginBottom: 8, letterSpacing: -0.3 },
  modalSub:            { fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 24 },
  modalBtnConfirm:     { width: "100%", paddingVertical: 14, borderRadius: 14, backgroundColor: "#ef4444", alignItems: "center", marginBottom: 10 },
  modalBtnConfirmText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  modalBtnCancel:      { width: "100%", paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, alignItems: "center" },
  modalBtnCancelText:  { fontWeight: "700", fontSize: 15 },
});
