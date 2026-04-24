import { View, StyleSheet } from "react-native";

export function IconBook({ color }: { color: string }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.cover, { borderColor: color }]}>
        <View style={[styles.line, { backgroundColor: color }]} />
        <View style={[styles.line, { backgroundColor: color, marginTop: 2 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 20, height: 20,
    alignItems: "center", justifyContent: "center", marginRight: 10,
  },
  cover: {
    width: 14, height: 14,
    borderWidth: 1.5, borderRadius: 2,
  },
  line: {
    width: 8, height: 1.5,
    marginTop: 3, marginLeft: 2,
  },
});
