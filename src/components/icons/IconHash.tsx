import { View, Text, StyleSheet } from "react-native";

export function IconHash({ color }: { color: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.symbol, { color }]}>#</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 20, height: 20,
    alignItems: "center", justifyContent: "center", marginRight: 10,
  },
  symbol: {
    fontSize: 14, fontWeight: "700", lineHeight: 16,
  },
});
