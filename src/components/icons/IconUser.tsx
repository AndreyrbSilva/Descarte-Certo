import { Animated, StyleSheet } from "react-native";

export function IconUser({ color, size = 20 }: { color: Animated.AnimatedInterpolation<string> | string; size?: number }) {
  return (
    <Animated.View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View style={[styles.head, { borderColor: color as any }]} />
      <Animated.View style={[styles.body, { borderColor: color as any }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 20, height: 20,
    alignItems: "center", justifyContent: "center",
  },
  head: {
    width: 10, height: 10,
    borderRadius: 5, borderWidth: 1.5,
  },
  body: {
    width: 14, height: 7,
    borderTopLeftRadius: 7, borderTopRightRadius: 7,
    borderWidth: 1.5, marginTop: 1,
  },
});
