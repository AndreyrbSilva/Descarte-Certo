import { View, StyleSheet } from "react-native";

export function IconFlip({ color, size = 20 }: { color: string; size?: number }) {
  const s = size / 20;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* seta superior esquerda */}
      <View style={[styles.arc, {
        width: 14 * s, height: 7 * s,
        borderTopWidth: 1.5, borderLeftWidth: 1.5, borderRightWidth: 1.5,
        borderColor: color,
        borderTopLeftRadius: 7 * s, borderTopRightRadius: 7 * s,
        top: 2 * s, left: 3 * s,
      }]} />
      {/* ponta seta direita */}
      <View style={[styles.tip, {
        width: 4 * s, height: 1.5,
        backgroundColor: color,
        top: 1.5 * s, right: 1 * s,
        transform: [{ rotate: "45deg" }],
      }]} />
      <View style={[styles.tip, {
        width: 4 * s, height: 1.5,
        backgroundColor: color,
        top: 4.5 * s, right: 1 * s,
        transform: [{ rotate: "-45deg" }],
      }]} />
      {/* linha inferior */}
      <View style={[styles.line, {
        width: 14 * s, height: 7 * s,
        borderBottomWidth: 1.5, borderLeftWidth: 1.5, borderRightWidth: 1.5,
        borderColor: color,
        borderBottomLeftRadius: 7 * s, borderBottomRightRadius: 7 * s,
        top: 11 * s, left: 3 * s,
      }]} />
      {/* ponta seta esquerda */}
      <View style={[styles.tip, {
        width: 4 * s, height: 1.5,
        backgroundColor: color,
        top: 14 * s, left: 1 * s,
        transform: [{ rotate: "45deg" }],
      }]} />
      <View style={[styles.tip, {
        width: 4 * s, height: 1.5,
        backgroundColor: color,
        top: 17 * s, left: 1 * s,
        transform: [{ rotate: "-45deg" }],
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "relative" },
  arc:  { position: "absolute" },
  line: { position: "absolute" },
  tip:  { position: "absolute" },
});
