import { View, StyleSheet } from "react-native";

export function IconTrend({ color, size = 20 }: { color: string; size?: number }) {
  const s = size / 20;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* Linha do gráfico - 3 segmentos em diagonal ascendente */}
      <View style={[styles.seg, {
        width: 5 * s, height: 1.5,
        backgroundColor: color,
        bottom: 5 * s, left: 1 * s,
        transform: [{ rotate: "-30deg" }],
      }]} />
      <View style={[styles.seg, {
        width: 5 * s, height: 1.5,
        backgroundColor: color,
        bottom: 8 * s, left: 6 * s,
        transform: [{ rotate: "-30deg" }],
      }]} />
      <View style={[styles.seg, {
        width: 5 * s, height: 1.5,
        backgroundColor: color,
        bottom: 11 * s, left: 11 * s,
        transform: [{ rotate: "-30deg" }],
      }]} />
      {/* Seta no topo */}
      <View style={[styles.arrowH, {
        width: 4 * s, height: 1.5,
        backgroundColor: color,
        top: 2 * s, right: 1 * s,
      }]} />
      <View style={[styles.arrowV, {
        width: 1.5, height: 4 * s,
        backgroundColor: color,
        top: 2 * s, right: 1 * s,
      }]} />
      {/* Eixo X */}
      <View style={[styles.axis, {
        width: 16 * s, height: 1.5,
        backgroundColor: color,
        bottom: 2 * s, left: 1 * s,
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:   { position: "relative", justifyContent: "center", alignItems: "center" },
  seg:    { position: "absolute" },
  arrowH: { position: "absolute" },
  arrowV: { position: "absolute" },
  axis:   { position: "absolute" },
});
