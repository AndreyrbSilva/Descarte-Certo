import { View, StyleSheet } from "react-native";

export function IconTarget({ color, size = 20 }: { color: string; size?: number }) {
  const s = size / 20;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* Círculo externo */}
      <View style={[styles.ring, {
        width: 18 * s, height: 18 * s,
        borderRadius: 9 * s,
        borderWidth: 1.5,
        borderColor: color,
      }]} />
      {/* Círculo médio */}
      <View style={[styles.ring, {
        width: 12 * s, height: 12 * s,
        borderRadius: 6 * s,
        borderWidth: 1.5,
        borderColor: color,
      }]} />
      {/* Centro */}
      <View style={[styles.ring, {
        width: 4 * s, height: 4 * s,
        borderRadius: 2 * s,
        backgroundColor: color,
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  ring: { position: "absolute" },
});
