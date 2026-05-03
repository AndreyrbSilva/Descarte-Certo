import { Animated, StyleSheet } from "react-native";

export function IconHome({ color, size = 20 }: { color: Animated.AnimatedInterpolation<string> | string; size?: number }) {
  return (
    <Animated.View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View style={[styles.roof, { borderBottomColor: color as any }]} />
      <Animated.View style={[styles.door, { borderColor: color as any }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "flex-end" },
  roof: {
    width: 0, height: 0,
    borderLeftWidth: 10, borderRightWidth: 10, borderBottomWidth: 8,
    borderLeftColor: "transparent", borderRightColor: "transparent",
  },
  door: {
    width: 14, height: 9,
    borderWidth: 1.5,
    borderBottomWidth: 0,
  },
});
