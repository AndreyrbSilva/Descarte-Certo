import { View, StyleSheet } from "react-native";

export function IconRecycle({ color, size = 20 }: { color: string; size?: number }) {
  const s = size / 20;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* Seta 1 - cima */}
      <View style={[styles.arrow, {
        width: 6 * s, height: 6 * s,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: color,
        borderTopRightRadius: 2 * s,
        top: 1 * s,
        left: 7 * s,
        transform: [{ rotate: "45deg" }],
      }]} />
      {/* Seta 2 - baixo esquerda */}
      <View style={[styles.arrow, {
        width: 6 * s, height: 6 * s,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: color,
        borderTopRightRadius: 2 * s,
        bottom: 1 * s,
        left: 1 * s,
        transform: [{ rotate: "165deg" }],
      }]} />
      {/* Seta 3 - baixo direita */}
      <View style={[styles.arrow, {
        width: 6 * s, height: 6 * s,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: color,
        borderTopRightRadius: 2 * s,
        bottom: 1 * s,
        right: 1 * s,
        transform: [{ rotate: "285deg" }],
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:  { alignItems: "center", justifyContent: "center" },
  arrow: { position: "absolute" },
});
