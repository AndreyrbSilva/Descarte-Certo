import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const FRAME_SIZE = width * 0.72;

export { FRAME_SIZE };

export const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: "#000" },
  camera:  { flex: 1 },

  // overlay escuro ao redor do frame
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },

  topBar: {
    position: "absolute",
    top: 52, left: 0, right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  topTitle:   { fontSize: 16, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  topSub:     { fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 },

  backBtn: {
    width: 50, height: 50, borderRadius: 30,
    backgroundColor: "#ffffff20",
    alignItems: "center", justifyContent: "center",
  },

  // frame de mira
  frame: {
    width: FRAME_SIZE, height: FRAME_SIZE,
    position: "relative",
    alignItems: "center", justifyContent: "center",
  },
  corner: { position: "absolute", width: 24, height: 24 },
  cornerTL: { top: 0,    left: 0,    borderTopWidth: 3,    borderLeftWidth: 3  },
  cornerTR: { top: 0,    right: 0,   borderTopWidth: 3,    borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0,    borderBottomWidth: 3, borderLeftWidth: 3  },
  cornerBR: { bottom: 0, right: 0,   borderBottomWidth: 3, borderRightWidth: 3 },

  scanLine: {
    position: "absolute",
    top: 0,
    width: FRAME_SIZE - 4,
    height: 2,
    backgroundColor: "#22c55e",
    opacity: 0.8,
  },

  frameHint: {
    position: "absolute",
    bottom: -36,
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },

  // botões inferiores
  bottomBar: {
    position: "absolute",
    bottom: 48, left: 0, right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 32,
  },
  sideBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "#ffffff20",
    borderWidth: 1, borderColor: "#ffffff30",
    alignItems: "center", justifyContent: "center",
  },
  captureBtn: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: "#22c55e",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#22c55e", shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7, shadowRadius: 16, elevation: 12,
  },
  captureBtnInner: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center",
  },
  loadingText: { color: "#fff", fontSize: 14, fontWeight: "600", marginTop: 16 },
});
