import { StyleSheet, Dimensions } from "react-native";
import { GREEN } from "../../../theme/colors";

const { height } = Dimensions.get("window");
export const HEADER_HEIGHT = height * 0.28;

export const styles = StyleSheet.create({
  root: { flexGrow: 1 },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: GREEN,
    alignItems: "center", justifyContent: "center", paddingBottom: 10,
  },
  logoArea:   { alignItems: "center" },
  appNameRow: { flexDirection: "row", alignItems: "baseline" },
  appNameDark: {
    fontSize: 30, fontWeight: "900",
    color: "#052e16", letterSpacing: -0.5,
  },
  appNameWhite: {
    fontSize: 30, fontWeight: "300",
    color: "#ffffff", letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 9, fontWeight: "600",
    letterSpacing: 3.5, color: "rgba(255,255,255,0.65)", marginTop: 6,
  },
  card: {
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: 28, paddingTop: 32, paddingBottom: 40,
    flex: 1, marginTop: -20,
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
  input: { flex: 1, fontSize: 15, padding: 0 },
  rememberRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginBottom: 28, marginTop: 4,
  },
  rememberLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  switch:       { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] },
  rememberText: { fontSize: 13 },
  forgotText:   { fontSize: 13, fontWeight: "600", color: GREEN },
  loginBtn: {
    backgroundColor: GREEN, borderRadius: 14,
    paddingVertical: 16, alignItems: "center",
    shadowColor: GREEN, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  loginBtnText: { color: "#ffffff", fontSize: 15, fontWeight: "800", letterSpacing: 2 },
  divider:      { flexDirection: "row", alignItems: "center", marginVertical: 22, gap: 10 },
  dividerLine:  { flex: 1, height: 1 },
  dividerText:  { fontSize: 13 },
  registerBtn:  { borderWidth: 1.5, borderRadius: 14, paddingVertical: 15, alignItems: "center" },
  registerBtnText: { fontSize: 15, fontWeight: "700", letterSpacing: 0.5 },
  successBanner: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#dcfce7",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#22c55e",
    flexDirection: "row",
    alignItems: "center",
  },
  successBannerText: {
    color: "#15803d",
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
  },
});
