import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingBottom: 40 },

  header: {
    paddingHorizontal: 20,
    paddingTop:        56,
    paddingBottom:     24,
  },
  headerTitle: {
    fontSize:      24,
    fontWeight:    "900",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize:  13,
    marginTop: 2,
  },

  // email info no topo
  emailCard: {
    marginHorizontal: 20,
    marginBottom:     20,
    borderRadius:     20,
    padding:          18,
    shadowColor:      "#000",
    shadowOffset:     { width: 0, height: 2 },
    shadowOpacity:    0.06,
    shadowRadius:     10,
    elevation:        3,
  },
  emailRow: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            10,
  },
  emailInfo: { flex: 1 },
  emailLabel: {
    fontSize:   11,
    fontWeight: "600",
    marginBottom: 2,
  },
  emailValue: {
    fontSize:   14,
    fontWeight: "700",
  },
  verifiedBadge: {
    flexDirection:    "row",
    alignItems:       "center",
    gap:              4,
    paddingHorizontal: 10,
    paddingVertical:  5,
    borderRadius:     20,
  },
  verifiedText: {
    fontSize:   11,
    fontWeight: "800",
  },

  // seção
  sectionLabel: {
    fontSize:          11,
    fontWeight:        "700",
    letterSpacing:     0.8,
    textTransform:     "uppercase",
    marginBottom:      8,
    marginTop:         4,
    paddingHorizontal: 20,
  },
  section: {
    marginHorizontal: 20,
    marginBottom:     20,
    borderRadius:     20,
    overflow:         "hidden",
    shadowColor:      "#000",
    shadowOffset:     { width: 0, height: 2 },
    shadowOpacity:    0.06,
    shadowRadius:     10,
    elevation:        3,
  },

  // item de lista
  item: {
    flexDirection:  "row",
    alignItems:     "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap:            14,
  },
  itemIconWrap: {
    width:          38,
    height:         38,
    borderRadius:   19,
    alignItems:     "center",
    justifyContent: "center",
  },
  itemText: { flex: 1 },
  itemLabel: {
    fontSize:   15,
    fontWeight: "700",
  },
  itemSub: {
    fontSize:  12,
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    opacity:  0.4,
  },
  divider: {
    height:           1,
    marginHorizontal: 18,
  },

  // logout
  logoutBtn: {
    marginHorizontal: 20,
    marginTop:        8,
    marginBottom:     20,
    borderRadius:     16,
    paddingVertical:  15,
    alignItems:       "center",
    borderWidth:      1.5,
    borderColor:      "#ef4444",
  },
  logoutText: {
    color:      "#ef4444",
    fontWeight: "700",
    fontSize:   15,
  },
});
