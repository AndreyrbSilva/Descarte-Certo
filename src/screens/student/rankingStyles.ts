import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingBottom: 120 },

  header: {
    paddingHorizontal: 20,
    paddingTop:        56,
    paddingBottom:     16,
  },
  headerTitle: {
    fontSize:      24,
    fontWeight:    "900",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize:   13,
    marginTop:  2,
  },

  // tab switcher
  tabRow: {
    flexDirection:     "row",
    marginHorizontal:  20,
    marginBottom:      20,
    borderRadius:      14,
    padding:           4,
  },
  tabBtn: {
    flex:           1,
    paddingVertical: 10,
    alignItems:     "center",
    borderRadius:   11,
  },
  tabText: {
    fontSize:   13,
    fontWeight: "700",
  },

  // pódio
  podium: {
    flexDirection:  "row",
    alignItems:     "flex-end",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom:   24,
    gap:            8,
  },
  podiumItem: {
    flex:       1,
    alignItems: "center",
    gap:        8,
  },
  podiumAvatar: {
    width:        56,
    height:       56,
    borderRadius: 28,
    alignItems:   "center",
    justifyContent: "center",
  },
  podiumAvatarImg: {
    width:        56,
    height:       56,
    borderRadius: 28,
  },
  podiumAvatarText: {
    fontSize:   20,
    fontWeight: "900",
    color:      "#fff",
  },
  podiumCrown: {
    fontSize: 20,
  },
  podiumName: {
    fontSize:      12,
    fontWeight:    "700",
    textAlign:     "center",
    numberOfLines: 1,
  },
  podiumPoints: {
    fontSize:   11,
    fontWeight: "600",
    marginTop:  -7,
  },
  podiumBase: {
    width:        "100%",
    alignItems:   "center",
    justifyContent: "flex-end",
    borderTopLeftRadius:  10,
    borderTopRightRadius: 10,
    paddingVertical: 8,
  },
  podiumPosition: {
    fontSize:   16,
    fontWeight: "900",
    color:      "#fff",
  },

  // lista
  listWrap: {
    paddingHorizontal: 20,
    gap:               10,
  },
  card: {
    flexDirection:  "row",
    alignItems:     "center",
    borderRadius:   16,
    padding:        14,
    gap:            12,
    shadowColor:    "#000",
    shadowOffset:   { width: 0, height: 2 },
    shadowOpacity:  0.05,
    shadowRadius:   8,
    elevation:      2,
  },
  position: {
    fontSize:   15,
    fontWeight: "900",
    width:      24,
    textAlign:  "center",
  },
  avatar: {
    width:        44,
    height:       44,
    borderRadius: 22,
    alignItems:   "center",
    justifyContent: "center",
  },
  avatarImg: {
    width:        44,
    height:       44,
    borderRadius: 22,
  },
  avatarText: {
    fontSize:   16,
    fontWeight: "800",
    color:      "#fff",
  },
  info: {
    flex: 1,
    gap:  2,
  },
  name: {
    fontSize:   14,
    fontWeight: "700",
  },
  streakRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           4,
  },
  streakText: {
    fontSize:   11,
    fontWeight: "600",
  },
  points: {
    fontSize:   15,
    fontWeight: "900",
  },
  pointsLabel: {
    fontSize: 10,
  },

  emptyWrap: {
    alignItems:  "center",
    paddingTop:  60,
    gap:         12,
  },
  emptyText: {
    fontSize:   15,
    fontWeight: "700",
  },
  emptySub: {
    fontSize: 13,
  },
});
