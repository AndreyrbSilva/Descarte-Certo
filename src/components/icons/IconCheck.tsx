import { View, StyleSheet } from "react-native";

export function IconCheck({ color, size = 20 }: { color: string; size?: number }) {
  const s = size / 20;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View style={[styles.left, {
        width: 6 * s, height: 1.5,
        backgroundColor: color,
        top: 11 * s, left: 3 * s,
        transform: [{ rotate: "45deg" }],
      }]} />
      <View style={[styles.right, {
        width: 10 * s, height: 1.5,
        backgroundColor: color,
        top: 9 * s, left: 7 * s,
        transform: [{ rotate: "-55deg" }],
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:  { position: "relative" },
  left:  { position: "absolute" },
  right: { position: "absolute" },
});
