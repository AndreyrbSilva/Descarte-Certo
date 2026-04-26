import { View, StyleSheet } from "react-native";

export function IconLogout({ color, size = 20 }: { color: string; size?: number }) {
  const s = size / 20;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* Porta - três lados (sem a direita) */}
      <View style={[styles.door, {
        width: 9 * s, height: 14 * s,
        borderWidth: 1.5,
        borderRightWidth: 0,
        borderColor: color,
        borderTopLeftRadius: 1.5 * s,
        borderBottomLeftRadius: 1.5 * s,
        left: 1 * s,
        top: 3 * s,
      }]} />
      {/* Seta apontando pra direita */}
      <View style={[styles.arrowBody, {
        width: 8 * s, height: 1.5,
        backgroundColor: color,
        right: 1 * s,
        top: 9.5 * s,
      }]} />
      {/* Ponta superior da seta */}
      <View style={[styles.arrowTip, {
        width: 4 * s, height: 1.5,
        backgroundColor: color,
        right: 1 * s,
        top: 7 * s,
        transform: [{ rotate: "45deg" }],
      }]} />
      {/* Ponta inferior da seta */}
      <View style={[styles.arrowTip, {
        width: 4 * s, height: 1.5,
        backgroundColor: color,
        right: 1 * s,
        top: 12 * s,
        transform: [{ rotate: "-45deg" }],
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:      { alignItems: "center", justifyContent: "center" },
  door:      { position: "absolute" },
  arrowBody: { position: "absolute" },
  arrowTip:  { position: "absolute" },
});
