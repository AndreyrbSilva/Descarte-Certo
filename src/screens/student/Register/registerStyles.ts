import { StyleSheet, Dimensions } from "react-native";
import { GREEN } from "../../../theme/colors";

const { height } = Dimensions.get("window");
export const HEADER_HEIGHT = height * 0.22;

export const styles = StyleSheet.create({
  root:     { flexGrow: 1 },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },
  headerContent: { alignItems: "center" },
  backBtn: {
    position: "absolute",
    left: 24,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 30,
    color: "#ffffff",
    fontWeight: "300",
    marginTop: -10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 3,
    color: "rgba(255,255,255,0.65)",
    marginTop: 4,
  },
  card: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
    flex: 1,
    marginTop: -20,
  },
  cardTitle:    { fontSize: 26, fontWeight: "800", letterSpacing: -0.5, marginBottom: 4 },
  cardSubtitle: { fontSize: 14, marginBottom: 28 },
  fieldGroup:   { marginBottom: 16 },
  fieldLabel: {
    fontSize: 12, fontWeight: "600",
    letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase",
  },
  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  input:       { flex: 1, fontSize: 15, padding: 0 },
  registerBtn: {
    backgroundColor: GREEN,
    borderRadius: 14, paddingVertical: 16,
    alignItems: "center", marginTop: 8,
    shadowColor: GREEN, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  registerBtnText: {
    color: "#ffffff", fontSize: 15,
    fontWeight: "800", letterSpacing: 2,
  },
  loginRow:    { flexDirection: "row", justifyContent: "center", marginTop: 24, gap: 4 },
  loginText:   { fontSize: 13 },
  loginLink:   { fontSize: 13, fontWeight: "700", color: GREEN },
  strengthTrack: {
    height: 6,
    backgroundColor: "#555",
    borderRadius: 3,
    overflow: "hidden",
  },
  strengthBar: {
    height: "100%",
    borderRadius: 3,
  },
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  strengthHint: {
    fontSize: 11,
    color: "#94a3b8",
  },
});
