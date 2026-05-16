import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");
const BALL_SIZE  = 110;
const GREEN      = "#22c55e";

export { BALL_SIZE };

export const styles = StyleSheet.create({
  root:       { flex: 1, alignItems: "center", justifyContent: "center" },
  background: { ...StyleSheet.absoluteFillObject },
  ripple: {
    position: "absolute",
    width: BALL_SIZE + 40, height: BALL_SIZE + 40,
    borderRadius: (BALL_SIZE + 40) / 2,
    borderWidth: 2, borderColor: GREEN,
  },
  ball: {
    width: BALL_SIZE, height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    alignItems: "center", justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 25, elevation: 20,
  },
  logoContainer: {
    width: BALL_SIZE * 0.65, height: BALL_SIZE * 0.65,
    alignItems: "center", justifyContent: "center",
  },
  logo:      { width: "100%", height: "100%" },
  explosion: {
    position: "absolute",
    width: BALL_SIZE, height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
  },
  textBlock: { position: "absolute", alignItems: "center" },
  titleRow:  { flexDirection: "row", alignItems: "baseline" },
  titleGreen: { fontSize: 42, fontWeight: "900", letterSpacing: -1 },
  titleDark:  { fontSize: 42, fontWeight: "300", letterSpacing: -1 },
  tagline: {
    position: "absolute",
    bottom: height * 0.18,
    fontSize: 15, fontWeight: "600", letterSpacing: 4,
  },
});
