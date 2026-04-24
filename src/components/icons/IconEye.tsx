import { View, StyleSheet } from "react-native";

export function IconEye({ color, off }: { color: string; off?: boolean }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.eyeOuter, { borderColor: color }]}>
        <View style={[styles.eyeInner, { backgroundColor: color }]} />
      </View>
      {off && <View style={[styles.eyeLine, { backgroundColor: color }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 20, height: 20,
    alignItems: "center", justifyContent: "center", marginRight: 10,
  },
  eyeOuter: {
    width: 16, height: 10,
    borderWidth: 1.5, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },
  eyeInner: { width: 5, height: 5, borderRadius: 2.5 },
  eyeLine: {
    position: "absolute",
    width: 18, height: 1.5,
    borderRadius: 1, transform: [{ rotate: "-40deg" }],
  },
});
