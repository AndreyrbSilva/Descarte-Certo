import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Header ───────────────────────────────────────────────────────────────────
  header: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 20,
    paddingBottom:     16,
  },
  headerLeft:    { flexDirection: "row", alignItems: "center", gap: 12, flex: 1, marginRight: 12 },
  adminAvatar:   { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  avatarText:    { fontSize: 18, fontWeight: "800", color: "#fff" },
  headerInfo:    { flex: 1 },
  headerHello:   { fontSize: 12, fontWeight: "500" },
  headerName:    { fontSize: 18, fontWeight: "800" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  themeBtn:      { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  logoutBtn:     { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },

  // ── Tab bar ───────────────────────────────────────────────────────────────────
  tabContainer: { paddingHorizontal: 20, paddingTop: 16, marginBottom: 12 },
  tabBar: {
    flexDirection: "row",
    borderRadius:  20,
    padding:       4,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  tabBtn:   { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 18 },
  tabLabel: { fontSize: 13 },

  // ── Loading ───────────────────────────────────────────────────────────────────
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: { fontSize: 14, fontWeight: "600" },

  // ── Scroll / cards ────────────────────────────────────────────────────────────
  scroll: { paddingHorizontal: 20, paddingTop: 10 },
  card: {
    borderRadius: 20, padding: 18, marginBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  sectionLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6, marginBottom: 8, marginLeft: 2 },
  divider:      { height: 1 },

  // ── Stats grid ────────────────────────────────────────────────────────────────
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1, borderRadius: 20, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  statHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconWrap:      { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  statValue:     { fontSize: 20, fontWeight: "900", letterSpacing: -0.5, flex: 1, marginLeft: 8, textAlign: "right" },
  statLabel:     { fontSize: 11, fontWeight: "700", marginTop: 10 },

  // ── Ações rápidas ─────────────────────────────────────────────────────────────
  quickActionsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  quickActionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center",
    borderRadius: 20, padding: 14, gap: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  quickActionIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  quickActionTitle:    { fontSize: 14, fontWeight: "800" },
  quickActionDesc:     { fontSize: 11, marginTop: 1 },

  // ── Gráfico semanal ───────────────────────────────────────────────────────────
  chartTitleRow:      { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  chartTitleText:     { fontSize: 15, fontWeight: "800" },
  chartSubText:       { fontSize: 12, marginBottom: 18 },
  chartBarsContainer: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "flex-end", height: 120, paddingHorizontal: 10,
  },
  chartColumn:   { alignItems: "center", width: "16%" },
  chartBarValue: { fontSize: 10, fontWeight: "800", marginBottom: 6 },
  chartBarTrack: { width: 14, height: 80, borderRadius: 7, overflow: "hidden", justifyContent: "flex-end" },
  chartBarFill:  { width: "100%", borderRadius: 7 },
  chartBarLabel: { fontSize: 11, fontWeight: "700", marginTop: 8 },

  // ── Ranking turmas ────────────────────────────────────────────────────────────
  rankItemRow:    { flexDirection: "row", alignItems: "center", gap: 10 },
  rankIconCircle: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  rankNumberText: { fontSize: 12, fontWeight: "800", color: "#64748b" },
  rankTurmaName:  { fontSize: 14, fontWeight: "700", flex: 1 },
  rankTurmaCount: { fontSize: 13, fontWeight: "800" },
  progressTrack:  { height: 8, borderRadius: 4, overflow: "hidden", marginTop: 6 },
  progressBar:    { height: "100%", borderRadius: 4 },

  // ── Role distribution ─────────────────────────────────────────────────────────
  roleDistributionRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  rolePercent:         { fontSize: 14, fontWeight: "800", width: 40, textAlign: "right" },
  roleCountNum:        { fontSize: 12, fontWeight: "600", flex: 1 },

  // ── Badge ─────────────────────────────────────────────────────────────────────
  badge:     { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.2 },

  // ── Search ────────────────────────────────────────────────────────────────────
  searchWrap: { paddingHorizontal: 20, paddingTop: 10 },
  searchInput: {
    height: 48, borderRadius: 16, borderWidth: 1,
    paddingHorizontal: 16, fontSize: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
  },

  // ── Chips de filtro ───────────────────────────────────────────────────────────
  chipsContainer: { paddingVertical: 10 },
  chipsScroll:    { paddingHorizontal: 20, gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  chipText: { fontSize: 12, fontWeight: "700" },

  // ── User card ─────────────────────────────────────────────────────────────────
  userCard: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 20, padding: 14, marginBottom: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  avatarInitialWrap: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  userInitial:       { fontSize: 18, fontWeight: "800", color: "#22c55e" },
  userNameRow:       { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  userName:          { fontSize: 14, fontWeight: "800", flex: 1 },
  userEmail:         { fontSize: 11, marginBottom: 6 },
  userMeta:          { flexDirection: "row", alignItems: "center", gap: 10 },
  userMetaText:      { fontSize: 11, fontWeight: "700" },
  arrowRight:        { fontSize: 14, fontWeight: "700", paddingHorizontal: 4 },

  // ── Empty state ───────────────────────────────────────────────────────────────
  emptyWrap: { padding: 40, alignItems: "center" },
  emptyText: { fontSize: 13, fontWeight: "600" },

  // ── Modal base ────────────────────────────────────────────────────────────────
  modalBackdrop:       { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "flex-end" },
  modalCard:           { width: "100%", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, elevation: 20, maxHeight: "90%" },
  modalTitle:          { fontSize: 18, fontWeight: "800" },
  modalSub:            { fontSize: 13, marginTop: 4 },
  modalHeaderCloseRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  closeModalBtn:       { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  roleOption: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 14, borderRadius: 16, borderWidth: 1.5, marginBottom: 10,
  },
  roleOptionText:  { fontSize: 14 },
  modalCancel:     { alignItems: "center", marginTop: 8, paddingVertical: 12 },
  modalCancelText: { fontSize: 14, fontWeight: "700" },

  // ── Ficha Ecológica ───────────────────────────────────────────────────────────
  fichaHeader:           { alignItems: "center", marginVertical: 10 },
  fichaAvatar:           { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  fichaAvatarText:       { fontSize: 28, fontWeight: "900", color: "#22c55e" },
  fichaName:             { fontSize: 18, fontWeight: "800" },
  fichaEmail:            { fontSize: 12, marginTop: 2 },
  fichaStatsRow:         { flexDirection: "row", gap: 10, marginVertical: 16 },
  fichaStatItem:         { flex: 1, padding: 12, borderRadius: 16, alignItems: "center" },
  fichaStatNum:          { fontSize: 16, fontWeight: "900" },
  fichaStatLabel:        { fontSize: 11, fontWeight: "700", marginTop: 2 },
  fichaSectionLabel:     { fontSize: 14, fontWeight: "800", marginBottom: 8 },
  residuosGrid:          { padding: 12, borderRadius: 20, borderWidth: 1, borderColor: "transparent" },
  residuoTextRow:        { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  residuoLabel:          { fontSize: 12, fontWeight: "800" },
  residuoPct:            { fontSize: 12, fontWeight: "700" },
  fichaActionsContainer: { flexDirection: "row", gap: 12, marginTop: 24, marginBottom: 8 },
  fichaBtn:              { flex: 1, height: 44, borderRadius: 14, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },

  // ── Modal de cadastro ─────────────────────────────────────────────────────────
  inputLabel:         { fontSize: 11, fontWeight: "800", letterSpacing: 0.3, marginTop: 14, marginBottom: 6 },
  modalInput:         { height: 48, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, fontSize: 13, marginBottom: 4 },
  roleSelectorRow:    { flexDirection: "row", gap: 8, marginVertical: 4 },
  roleSelectChip:     { flex: 1, height: 38, borderRadius: 12, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  roleSelectChipText: { fontSize: 11 },
  saveBtn:            { height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  saveBtnText:        { color: "#fff", fontSize: 14, fontWeight: "800" },

  // ── Modal de exportação ───────────────────────────────────────────────────────
  exportBackdrop:      { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },
  exportCard:          { width: "80%", borderRadius: 24, padding: 24, alignItems: "center", elevation: 12 },
  exportTitle:         { fontSize: 16, fontWeight: "800" },
  exportStepText:      { fontSize: 12, marginTop: 4, textAlign: "center" },
  exportProgressTrack: { height: 6, width: "100%", borderRadius: 3, overflow: "hidden" },
  exportProgressBar:   { height: "100%" },
  exportProgressText:  { fontSize: 14 },

  // ── Alternador de visualização ────────────────────────────────────────────────
  viewModeToggleContainer: {
    flexDirection: "row", padding: 4, borderRadius: 16, borderWidth: 1,
    marginHorizontal: 20, marginTop: 6, marginBottom: 14, gap: 4,
  },
  viewModeBtn:     { flex: 1, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  viewModeBtnText: { fontSize: 12, fontWeight: "800" },

  // ── Cards agrupados por turma ─────────────────────────────────────────────────
  groupedCard: {
    borderRadius: 20, borderWidth: 1, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  groupedHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderBottomWidth: 1, paddingBottom: 10, marginBottom: 10,
  },
  groupedHeaderLeft:  { flexDirection: "row", alignItems: "center", gap: 6 },
  groupedHeaderTitle: { fontSize: 15, fontWeight: "800" },
  groupedHeaderCount: { fontSize: 11, fontWeight: "700" },
  groupedUserRow:     { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  avatarInitialWrapSmall: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  userInitialSmall:   { fontSize: 15, fontWeight: "800", color: "#22c55e" },
  userNameSmall:      { fontSize: 13, fontWeight: "800" },
});
