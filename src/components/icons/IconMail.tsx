import { View, StyleSheet } from "react-native";

export function IconMail({ color }: { color: string }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.envelopeBody, { borderColor: color }]}>
        <View style={[styles.envelopeFlap, { borderColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 20, height: 20,
    alignItems: "center", justifyContent: "center", marginRight: 10,
  },
  envelopeBody: {
    width: 16, height: 11,
    borderWidth: 1.5, borderRadius: 2,
    overflow: "hidden", alignItems: "center", justifyContent: "flex-start",
  },
  envelopeFlap: {
    width: 14, height: 7,
    borderBottomWidth: 1.5, borderLeftWidth: 1.5, borderRightWidth: 1.5,
    borderBottomLeftRadius: 6, borderBottomRightRadius: 6,
    marginTop: -3, transform: [{ rotate: "180deg" }],
  },
});
