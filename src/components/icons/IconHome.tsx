import { View, StyleSheet } from "react-native";

export function IconHome({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View style={[styles.roof, { borderBottomColor: color }]} />
      <View style={[styles.door, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "flex-end" },
  roof: {
    width: 0, height: 0,
    borderLeftWidth: 10, borderRightWidth: 10, borderBottomWidth: 8,
    borderLeftColor: "transparent", borderRightColor: "transparent",
    marginBottom: 0,
  },
  door: {
    width: 14, height: 9,
    borderWidth: 1.5,
    borderBottomWidth: 0,
  },
});
