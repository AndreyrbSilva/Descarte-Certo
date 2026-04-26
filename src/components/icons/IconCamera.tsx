import { View, StyleSheet } from "react-native";

export function IconCamera({ color, size = 20 }: { color: string; size?: number }) {
  const s = size / 20;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* Corpo da câmera */}
      <View style={[styles.body, {
        width: 16 * s, height: 11 * s,
        borderRadius: 3 * s,
        borderWidth: 1.5,
        borderColor: color,
        bottom: 1 * s,
      }]} />
      {/* Lente */}
      <View style={[styles.lens, {
        width: 6 * s, height: 6 * s,
        borderRadius: 3 * s,
        borderWidth: 1.5,
        borderColor: color,
        bottom: 3.5 * s,
      }]} />
      {/* Flash / topo */}
      <View style={[styles.bump, {
        width: 5 * s, height: 2.5 * s,
        borderTopLeftRadius: 2 * s,
        borderTopRightRadius: 2 * s,
        borderWidth: 1.5,
        borderBottomWidth: 0,
        borderColor: color,
        bottom: 12 * s,
        left: 4 * s,
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  body: { position: "absolute" },
  lens: { position: "absolute" },
  bump: { position: "absolute" },
});
