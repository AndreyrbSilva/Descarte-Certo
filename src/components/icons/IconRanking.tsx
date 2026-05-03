import { View, StyleSheet } from "react-native";

export function IconRanking({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View style={[styles.bar, styles.mid,   { borderColor: color }]} />
      <View style={[styles.bar, styles.tall,  { borderColor: color }]} />
      <View style={[styles.bar, styles.short, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 2 },
  bar:  { width: 5, borderWidth: 1.5, borderBottomWidth: 1.5 },
  mid:   { height: 11 },
  tall:  { height: 16 },
  short: { height: 7  },
});
