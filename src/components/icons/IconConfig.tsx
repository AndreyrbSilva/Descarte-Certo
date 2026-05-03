import { Animated, StyleSheet } from "react-native";

export function IconConfig({ color, size = 20 }: { color: Animated.AnimatedInterpolation<string> | string; size?: number }) {
  return (
    <Animated.View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View style={[styles.outer, { borderColor: color as any }]}>
        <Animated.View style={[styles.inner, { borderColor: color as any }]} />
      </Animated.View>
      <Animated.View style={[styles.tooth, styles.top,    { backgroundColor: color as any }]} />
      <Animated.View style={[styles.tooth, styles.bottom, { backgroundColor: color as any }]} />
      <Animated.View style={[styles.tooth, styles.left,   { backgroundColor: color as any }]} />
      <Animated.View style={[styles.tooth, styles.right,  { backgroundColor: color as any }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap:   { width: 20, height: 20, alignItems: "center", justifyContent: "center" },
  outer:  { width: 12, height: 12, borderRadius: 6, borderWidth: 1.5 },
  inner:  { width: 4,  height: 4,  borderRadius: 2, borderWidth: 1.5, alignSelf: "center", marginTop: 2 },
  tooth:  { position: "absolute", width: 2.5, height: 4, borderRadius: 1 },
  top:    { top: 0,    left: 8.5 },
  bottom: { bottom: 0, left: 8.5 },
  left:   { left: 0,   top: 8, width: 4, height: 2.5 },
  right:  { right: 0,  top: 8, width: 4, height: 2.5 },
});
