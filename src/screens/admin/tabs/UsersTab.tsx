import {
  TextInput as RN_TextInput, TouchableOpacity as RN_TouchableOpacity,
  Animated,
} from "react-native";
const { View, Text, FlatList } = Animated;
const TextInput = Animated.createAnimatedComponent(RN_TextInput);
const TouchableOpacity = Animated.createAnimatedComponent(RN_TouchableOpacity);
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { useAdminColors } from "../../../theme/useAdminColors";
import type { AdminUser, RoleFilter, Role } from "../admin.types";
import { ROLE_LABELS } from "../admin.types";
import { RoleBadge } from "../../../components/admin/RoleBadge";
import { styles } from "../adminStyles";
import { IconHash } from "../../../components/icons";

interface UsersTabProps {
  filteredUsers:    AdminUser[];
  search:           string;
  setSearch:        (s: string) => void;
  roleFilter:       RoleFilter;
  setRoleFilter:    (f: RoleFilter) => void;
  viewMode:         "list" | "grouped";
  setViewMode:      (m: "list" | "grouped") => void;
  expandedTurmas:   Record<string, boolean>;
  setExpandedTurmas: (fn: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  colors:           ReturnType<typeof useAdminColors>;
  aColors?:         any;
  insets:           ReturnType<typeof useSafeAreaInsets>;
  listOpacity:      Animated.Value;
  listY:            Animated.Value;
  onSelectUser:     (user: AdminUser) => void;
}

export function UsersTab({
  filteredUsers, search, setSearch, roleFilter, setRoleFilter,
  viewMode, setViewMode, expandedTurmas, setExpandedTurmas,
  colors, aColors, insets, listOpacity, listY, onSelectUser,
}: UsersTabProps) {
  const c = aColors || colors;
  const FILTERS: { key: RoleFilter; label: string }[] = [
    { key: "ALL",     label: "Todos"    },
    { key: "STUDENT", label: ROLE_LABELS["STUDENT"] },
    { key: "TEACHER", label: ROLE_LABELS["TEACHER"] },
    { key: "ADMIN",   label: ROLE_LABELS["ADMIN"]   },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* ── Busca ─────────────────────────────────────────────────────────── */}
      <Animated.View style={[styles.searchWrap, { opacity: listOpacity }]}>
        <TextInput
          style={[styles.searchInput, {
            backgroundColor: c.inputBg,
            borderColor:     c.inputBorder,
            color:           c.textColor,
          }]}
          placeholder="Buscar aluno, turma ou e-mail..."
          placeholderTextColor={c.subTextColor}
          value={search}
          onChangeText={setSearch}
        />
      </Animated.View>

      {/* ── Chips de filtro ────────────────────────────────────────────────── */}
      <Animated.View style={[styles.chipsContainer, { opacity: listOpacity }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {FILTERS.map(({ key, label }) => {
            const active = roleFilter === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.chip, { backgroundColor: active ? "#22c55e" : c.cardBg }]}
                onPress={() => setRoleFilter(key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, { color: active ? "#ffffff" : c.textColor }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* ── Toggle de visualização ─────────────────────────────────────────── */}
      <Animated.View style={{ opacity: listOpacity }}>
        <Animated.View style={[
          styles.viewModeToggleContainer,
          { backgroundColor: c.cardBg, borderColor: c.dividerColor },
        ]}>
        {(["list", "grouped"] as const).map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[styles.viewModeBtn, viewMode === mode && { backgroundColor: "#22c55e" }]}
            onPress={() => setViewMode(mode)}
            activeOpacity={0.8}
          >
            <Text style={[styles.viewModeBtnText, { color: viewMode === mode ? "#ffffff" : c.textColor }]}>
              {mode === "list" ? "Lista Unificada" : "Agrupar por Turma"}
            </Text>
          </TouchableOpacity>
        ))}
        </Animated.View>
      </Animated.View>

      {/* ── Conteúdo: agrupado ou lista ────────────────────────────────────── */}
      {viewMode === "grouped" ? (
        <GroupedView
          filteredUsers={filteredUsers}
          colors={colors} aColors={aColors} insets={insets}
          listOpacity={listOpacity} listY={listY}
          expandedTurmas={expandedTurmas}
          setExpandedTurmas={setExpandedTurmas}
          onSelectUser={onSelectUser}
        />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(u) => u.id}
          contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: user }) => (
            <Animated.View style={{ opacity: listOpacity, transform: [{ translateY: listY }] }}>
              <TouchableOpacity
                style={[styles.userCard, { backgroundColor: c.cardBg }]}
                onPress={() => onSelectUser(user)}
                activeOpacity={0.8}
              >
                <View style={[styles.avatarInitialWrap, { backgroundColor: "#22c55e12" }]}>
                  <Text style={styles.userInitial}>{user.name[0].toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.userNameRow}>
                    <Text style={[styles.userName, { color: c.textColor }]} numberOfLines={1}>
                      {user.name}
                    </Text>
                  </View>
                  <Text style={[styles.userEmail, { color: c.subTextColor }]} numberOfLines={1}>
                    {user.email}
                  </Text>
                  <View style={styles.userMeta}>
                    <RoleBadge role={user.role} colors={c} />
                    <Text style={[styles.userMetaText, { color: c.subTextColor }]}>
                      Turma: {user.turma || "N/A"}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.arrowRight, { color: c.subTextColor }]}>➔</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={[styles.emptyText, { color: c.subTextColor }]}>
                Nenhum usuário correspondente encontrado.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// ── Sub-view: agrupada por turma (acordeão) ───────────────────────────────────

interface GroupedViewProps {
  filteredUsers:     AdminUser[];
  colors:            ReturnType<typeof useAdminColors>;
  aColors?:          any;
  insets:            ReturnType<typeof useSafeAreaInsets>;
  listOpacity:       Animated.Value;
  listY:             Animated.Value;
  expandedTurmas:    Record<string, boolean>;
  setExpandedTurmas: (fn: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  onSelectUser:      (user: AdminUser) => void;
}

function GroupedView({
  filteredUsers, colors, aColors, insets, listOpacity, listY,
  expandedTurmas, setExpandedTurmas, onSelectUser,
}: GroupedViewProps) {
  const c = aColors || colors;
  const groupedByTurma = (() => {
    const groups: Record<string, AdminUser[]> = {};
    filteredUsers.forEach((u) => {
      const key = u.turma ? u.turma.toUpperCase().trim() : "SEM TURMA";
      if (!groups[key]) groups[key] = [];
      groups[key].push(u);
    });
    return Object.entries(groups).sort(([a], [b]) => {
      if (a === "SEM TURMA") return 1;
      if (b === "SEM TURMA") return -1;
      return a.localeCompare(b);
    });
  })();

  if (groupedByTurma.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={[styles.emptyText, { color: c.subTextColor }]}>
          Nenhum usuário correspondente encontrado.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {groupedByTurma.map(([turmaName, members]) => {
        const isExpanded = !!expandedTurmas[turmaName];
        return (
          <Animated.View
            key={turmaName}
            style={{ opacity: listOpacity, transform: [{ translateY: listY }], marginBottom: 16 }}
          >
            <View style={[styles.groupedCard, { backgroundColor: c.cardBg, borderColor: c.dividerColor }]}>
              {/* Cabeçalho sanfona */}
              <TouchableOpacity
                style={[
                  styles.groupedHeader,
                  {
                    borderBottomColor: c.dividerColor,
                    borderBottomWidth: isExpanded ? 1 : 0,
                    paddingBottom:     isExpanded ? 10 : 0,
                    marginBottom:      isExpanded ? 10 : 0,
                  },
                ]}
                onPress={() => setExpandedTurmas((prev) => ({ ...prev, [turmaName]: !prev[turmaName] }))}
                activeOpacity={0.7}
              >
                <View style={styles.groupedHeaderLeft}>
                  <IconHash color="#22c55e" size={16} />
                  <Text style={[styles.groupedHeaderTitle, { color: c.textColor }]}>
                    Turma {turmaName}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Text style={[styles.groupedHeaderCount, { color: c.subTextColor }]}>
                    {members.length} {members.length === 1 ? "integrante" : "integrantes"}
                  </Text>
                  <Text style={{ fontSize: 11, color: "#22c55e", fontWeight: "700" }}>
                    {isExpanded ? "▲" : "▼"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Integrantes */}
              {isExpanded && members.map((user, idx) => (
                <View key={user.id}>
                  <TouchableOpacity
                    style={styles.groupedUserRow}
                    onPress={() => onSelectUser(user)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.avatarInitialWrapSmall, { backgroundColor: "#22c55e12" }]}>
                      <Text style={styles.userInitialSmall}>{user.name[0].toUpperCase()}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.userNameSmall, { color: c.textColor }]} numberOfLines={1}>
                        {user.name}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                        <RoleBadge role={user.role} colors={c} />
                        <Text style={{ fontSize: 11, color: c.subTextColor, marginLeft: 8 }}>
                          {user.scans?.length ?? 0} Scans • {user.points?.total ?? 0} pts
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.arrowRight, { color: c.subTextColor }]}>➔</Text>
                  </TouchableOpacity>
                  {idx < members.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: c.dividerColor }]} />
                  )}
                </View>
              ))}
            </View>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}
