import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");
const GREEN = "#22c55e";

export const styles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { flexGrow: 1, alignItems: "center", paddingBottom: 40 },

  // header verde
  header: {
    width: "100%",
    height: height * 0.38,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "#ffffff25",
    alignItems: "center", justifyContent: "center",
    marginBottom: 16,
  },
  pointsBadge: {
    backgroundColor: "#ffffff20",
    borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 8,
    marginBottom: 12,
  },
  pointsEarned: { fontSize: 36, fontWeight: "900", color: "#fff", letterSpacing: -1 },
  pointsLabel:  { fontSize: 13, color: "rgba(255,255,255,0.8)", textAlign: "center" },

  // card 
  card: {
    width: "88%",
    borderRadius: 24,
    padding: 24,
    marginTop: -69,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 8,
  },
  cardTitle:   { fontSize: 22, fontWeight: "800", marginBottom: 4, letterSpacing: -0.5 },
  cardSub:     { fontSize: 14, marginBottom: 20 },
  divider:     { height: 1, marginBottom: 20 },
  row:         { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  rowLabel:    { fontSize: 13 },
  rowValue:    { fontSize: 13, fontWeight: "700" },

  // botões
  btnPrimary: {
    backgroundColor: GREEN, borderRadius: 14,
    paddingVertical: 16, alignItems: "center",
    marginTop: 8, marginBottom: 10,
    shadowColor: GREEN, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  btnPrimaryText: { color: "#fff", fontWeight: "800", fontSize: 15, letterSpacing: 1 },
  btnSecondary:   { borderRadius: 14, paddingVertical: 14, alignItems: "center", borderWidth: 1.5 },
  btnSecondaryText: { fontWeight: "700", fontSize: 15 },

  // Foto
  photo: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 4,
  },
});
