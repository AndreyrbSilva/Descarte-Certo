import { View, StyleSheet } from "react-native";

export function IconFlash({ color, size = 20 }: { color: string; size?: number }) {
  const s = size / 20;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* corpo do raio */}
      <View style={[styles.top, {
        width: 8 * s, height: 1.5,
        backgroundColor: color,
        top: 3 * s, left: 6 * s,
        transform: [{ rotate: "-45deg" }],
      }]} />
      <View style={[styles.mid, {
        width: 10 * s, height: 1.5,
        backgroundColor: color,
        top: 9 * s, left: 4 * s,
        transform: [{ rotate: "-45deg" }],
      }]} />
      <View style={[styles.bot, {
        width: 8 * s, height: 1.5,
        backgroundColor: color,
        top: 15 * s, left: 5 * s,
        transform: [{ rotate: "-45deg" }],
      }]} />
      {/* linha vertical conectando */}
      <View style={[styles.vert, {
        width: 1.5, height: 8 * s,
        backgroundColor: color,
        top: 5 * s, left: 9 * s,
        transform: [{ rotate: "20deg" }],
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "relative" },
  top:  { position: "absolute" },
  mid:  { position: "absolute" },
  bot:  { position: "absolute" },
  vert: { position: "absolute" },
});
