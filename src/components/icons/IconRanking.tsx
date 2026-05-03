import { Animated, StyleSheet } from "react-native";

export function IconRanking({ color, size = 20 }: { color: Animated.AnimatedInterpolation<string> | string; size?: number }) {
  return (
    <Animated.View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View style={[styles.bar, styles.mid,   { borderColor: color as any }]} />
      <Animated.View style={[styles.bar, styles.tall,  { borderColor: color as any }]} />
      <Animated.View style={[styles.bar, styles.short, { borderColor: color as any }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap:  { flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 2 },
  bar:   { width: 5, borderWidth: 1.5, borderBottomWidth: 1.5 },
  mid:   { height: 11 },
  tall:  { height: 16 },
  short: { height: 7  },
});
