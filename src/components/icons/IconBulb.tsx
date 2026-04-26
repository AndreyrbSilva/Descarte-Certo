import { View, StyleSheet } from "react-native";

export function IconBulb({ color, size = 20 }: { color: string; size?: number }) {
  const s = size / 20;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* Bulbo */}
      <View style={[styles.bulb, {
        width: 10 * s, height: 10 * s,
        borderRadius: 5 * s,
        borderWidth: 1.5,
        borderColor: color,
        top: 1 * s,
      }]} />
      {/* Base da lâmpada - parte 1 */}
      <View style={[styles.base1, {
        width: 8 * s, height: 2 * s,
        borderWidth: 1.5,
        borderTopWidth: 0,
        borderColor: color,
        top: 10 * s,
      }]} />
      {/* Base da lâmpada - parte 2 */}
      <View style={[styles.base2, {
        width: 6 * s, height: 2 * s,
        borderWidth: 1.5,
        borderTopWidth: 0,
        borderBottomLeftRadius: 2 * s,
        borderBottomRightRadius: 2 * s,
        borderColor: color,
        top: 12 * s,
      }]} />
      {/* Filamento */}
      <View style={[styles.filament, {
        width: 4 * s, height: 1.5,
        backgroundColor: color,
        top: 7 * s,
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:     { alignItems: "center", justifyContent: "flex-start" },
  bulb:     { position: "absolute" },
  base1:    { position: "absolute" },
  base2:    { position: "absolute" },
  filament: { position: "absolute" },
});
