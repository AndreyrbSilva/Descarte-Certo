import { View, StyleSheet } from "react-native";

export function IconUser({ color }: { color: string }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.head, { borderColor: color }]} />
      <View style={[styles.body, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 20, height: 20,
    alignItems: "center", justifyContent: "center", marginRight: 10,
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
