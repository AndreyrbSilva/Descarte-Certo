import { View, StyleSheet } from "react-native";

export function IconLock({ color }: { color: string }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.lockBody, { borderColor: color }]}>
        <View style={[styles.lockHole, { backgroundColor: color }]} />
      </View>
      <View style={[styles.lockShackle, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 20, height: 20,
    alignItems: "center", justifyContent: "center", marginRight: 10,
  },
  lockBody: {
    width: 14, height: 10,
    borderWidth: 1.5, borderRadius: 3,
    alignItems: "center", justifyContent: "center", marginTop: 4,
  },
  lockHole: { width: 4, height: 4, borderRadius: 2 },
  lockShackle: {
    position: "absolute", top: 0,
    width: 8, height: 8,
    borderTopWidth: 1.5, borderLeftWidth: 1.5, borderRightWidth: 1.5,
    borderTopLeftRadius: 4, borderTopRightRadius: 4,
  },
});
