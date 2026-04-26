import { View, StyleSheet } from "react-native";

export function IconTrophy({ color, size = 20 }: { color: string; size?: number }) {
  const s = size / 20;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* Copa */}
      <View style={[styles.cup, {
        width: 12 * s, height: 9 * s,
        borderRadius: 3 * s,
        borderWidth: 1.5,
        borderColor: color,
      }]} />
      {/* Alças */}
      <View style={[styles.handleLeft, {
        width: 3 * s, height: 5 * s,
        borderTopLeftRadius: 3 * s,
        borderBottomLeftRadius: 3 * s,
        borderWidth: 1.5,
        borderRightWidth: 0,
        borderColor: color,
        top: 2 * s, left: 1 * s,
      }]} />
      <View style={[styles.handleRight, {
        width: 3 * s, height: 5 * s,
        borderTopRightRadius: 3 * s,
        borderBottomRightRadius: 3 * s,
        borderWidth: 1.5,
        borderLeftWidth: 0,
        borderColor: color,
        top: 2 * s, right: 1 * s,
      }]} />
      {/* Haste */}
      <View style={[styles.stem, {
        width: 2 * s, height: 3 * s,
        backgroundColor: color,
        top: 10 * s,
      }]} />
      {/* Base */}
      <View style={[styles.base, {
        width: 10 * s, height: 2 * s,
        borderRadius: 1 * s,
        backgroundColor: color,
        top: 13 * s,
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:        { alignItems: "center", justifyContent: "flex-start" },
  cup:         { },
  handleLeft:  { position: "absolute" },
  handleRight: { position: "absolute" },
  stem:        { position: "absolute" },
  base:        { position: "absolute" },
});
