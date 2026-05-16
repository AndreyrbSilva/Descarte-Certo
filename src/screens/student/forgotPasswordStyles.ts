import { StyleSheet, Dimensions } from "react-native";
import { GREEN } from "../../theme/colors";

const { height } = Dimensions.get("window");
export const HEADER_HEIGHT = height * 0.22;

export const styles = StyleSheet.create({
  root: { flexGrow: 1 },
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
  cardSubtitle: { fontSize: 14, marginBottom: 28, lineHeight: 20 },
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

  // Botão principal
  primaryBtn: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
  },

  // Ícone de e-mail enviado
  sentIcon: {
    alignSelf: "center",
    marginBottom: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },

  // Código (6 dígitos)
  codeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  codeInput: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
  },

  // Reenviar código
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 4,
  },
  resendText: { fontSize: 13 },
  resendLink: { fontSize: 13, fontWeight: "700", color: GREEN },

  // Erro
  errorText: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 8,
    fontSize: 13,
  },

  // Sucesso final
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },

  // Barra de força
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

  // Voltar para login
  backRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    gap: 4,
  },
  backText: { fontSize: 13 },
  backLink: { fontSize: 13, fontWeight: "700", color: GREEN },

  // E-mail destacado
  emailHighlight: {
    fontWeight: "700",
    color: GREEN,
  },

  // Expiração
  timerText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
});
