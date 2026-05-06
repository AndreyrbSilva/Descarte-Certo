import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 56 },

  header:      { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar:      { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", overflow: "hidden",},
  avatarText:  { fontSize: 20, fontWeight: "800", color: "#fff" },
  headerInfo:  { flex: 1 },
  headerHello: { fontSize: 13 },
  headerName:  { fontSize: 18, fontWeight: "800" },

  card: {
    borderRadius: 20, padding: 18, marginBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },

  pointsRow:      { flexDirection: "row", alignItems: "center", gap: 12 },
  pointsIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  pointsTitle:    { fontSize: 15, fontWeight: "800", letterSpacing: -0.3 },
  pointsSub:      { fontSize: 12, marginTop: 2, lineHeight: 16 },
  pointsNumBlock: { alignItems: "flex-end" },
  pointsNumber:   { fontSize: 32, fontWeight: "900", letterSpacing: -1 },
  pointsLabel:    { fontSize: 11, marginTop: -2 },

  divider: { height: 1, marginVertical: 12 },

  rankingLinkRow: { flexDirection: "row", alignItems: "center" },
  rankingLink:    { flexDirection: "row", alignItems: "center", marginLeft: "auto" },
  rankingLinkText:{ fontSize: 12, fontWeight: "600", flex: 1 },
  rankingLinkBtn: { fontSize: 13, fontWeight: "700" },

  scanBtn: {
    borderRadius: 20, paddingVertical: 18,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    shadowColor: "#22c55e", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 14, elevation: 8,
    marginBottom: 14,
  },
  scanText: { fontSize: 18, fontWeight: "800", color: "#fff", letterSpacing: 0.3 },

  missionHeader:   { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },
  missionIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  missionLabel:    { fontSize: 11, marginBottom: 2 },
  missionText:     { fontSize: 14, fontWeight: "700", lineHeight: 20 },
  progressTrack:   { height: 8, borderRadius: 4, overflow: "hidden" },
  progressBar:     { height: "100%" as any, borderRadius: 4 },
  progressFooter:  { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  progressPct:     { fontSize: 11 },

  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  cardTitleText:{ fontSize: 16, fontWeight: "800", letterSpacing: -0.3 },
  rankItem:     { flexDirection: "row", alignItems: "center", paddingVertical: 4, gap: 10 },
  rankIconWrap: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  rankItemLabel:{ fontSize: 14, flex: 1 },
  rankItemNum:  { fontSize: 18, fontWeight: "900" },

  rowCards:  { flexDirection: "row", gap: 12, marginBottom: 14 },
  halfCard:  {
    flex: 1, borderRadius: 20, padding: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  factCard: {},
  factTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  factContent: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingRight: 80 },
  factTitle:   { fontSize: 14, fontWeight: "800", marginBottom: 4 },
  factText:    { fontSize: 13, lineHeight: 18 },
  planetImg:   { position: "absolute", bottom: -10, right: -10, width: 90, height: 90 },
  lastTitle:   { fontSize: 13, marginBottom: 10 },
  lastRow:     { flexDirection: "row", alignItems: "center", gap: 12 },
  lastIconWrap:{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  lastCategory:{ fontSize: 15, fontWeight: "700" },
  lastDate:    { fontSize: 12, marginTop: 2 },
  lastPoints:  { fontSize: 18, fontWeight: "800" },
});
