import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
  backdrop: {
    flex:            1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems:      "center",
    justifyContent:  "center",
    padding:         24,
  },
  card: {
    width:        "100%",
    borderRadius: 24,
    padding:      24,
  },
  title: {
    fontSize:      20,
    fontWeight:    "900",
    marginBottom:  8,
    letterSpacing: -0.4,
  },
  sub: {
    fontSize:     13,
    marginBottom: 20,
    lineHeight:   18,
  },
  input: {
    borderWidth:   1.5,
    borderRadius:  12,
    paddingHorizontal: 14,
    paddingVertical:   12,
    fontSize:      15,
  },
  btn: {
    borderRadius:   14,
    paddingVertical: 14,
    alignItems:     "center",
    marginTop:      16,
  },
  btnText: {
    color:      "#fff",
    fontWeight: "800",
    fontSize:   15,
  },
});
