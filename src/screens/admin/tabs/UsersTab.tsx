import { useEffect, useRef, useCallback } from "react";
import {
  TextInput as RN_TextInput, TouchableOpacity as RN_TouchableOpacity,
  Animated, Easing,
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
  // New animation props
  viewModeAnim:         Animated.Value;
  setViewModeWidth:     (w: number) => void;
  filterContentOpacity: Animated.Value;
  cardAnims:            { opacity: Animated.Value; y: Animated.Value }[];
  animateCardEntrance:  (count: number) => void;
  onSelectUser:     (user: AdminUser) => void;
}

export function UsersTab({
  filteredUsers, search, setSearch, roleFilter, setRoleFilter,
  viewMode, setViewMode, expandedTurmas, setExpandedTurmas,
  colors, aColors, insets, listOpacity, listY,
  viewModeAnim, setViewModeWidth, filterContentOpacity, cardAnims, animateCardEntrance,
  onSelectUser,
}: UsersTabProps) {
  const c = aColors || colors;
  const FILTERS: { key: RoleFilter; label: string }[] = [
    { key: "ALL",     label: "Todos"    },
    { key: "STUDENT", label: ROLE_LABELS["STUDENT"] },
    { key: "TEACHER", label: ROLE_LABELS["TEACHER"] },
    { key: "ADMIN",   label: ROLE_LABELS["ADMIN"]   },
  ];

  // Trigger card entrance animation when the tab mounts or filtered data changes
  useEffect(() => {
    animateCardEntrance(filteredUsers.length);
  }, []);

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
        <Animated.View
          style={[
            styles.viewModeToggleContainer,
            { backgroundColor: c.cardBg, borderColor: c.dividerColor },
          ]}
          onLayout={(e) => setViewModeWidth(e.nativeEvent.layout.width)}
        >
          <Animated.View
            style={{
              position:        "absolute",
              left:            4,
              width:           "50%",
              top:             4,
              bottom:          4,
              borderRadius:    12,
              backgroundColor: "#22c55e",
              transform:       [{ translateX: viewModeAnim }],
            }}
          />
        {(["list", "grouped"] as const).map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[styles.viewModeBtn]}
            onPress={() => setViewMode(mode)}
            activeOpacity={0.8}
          >
            <Animated.Text style={[styles.viewModeBtnText, { color: viewMode === mode ? "#ffffff" : c.textColor }]}>
              {mode === "list" ? "Lista Unificada" : "Agrupar por Turma"}
            </Animated.Text>
          </TouchableOpacity>
        ))}
        </Animated.View>
      </Animated.View>

      {/* ── Conteúdo: agrupado ou lista (com animação de crossfade) ─────── */}
      <Animated.View style={{
        flex: 1,
        opacity: filterContentOpacity,
      }}>
        {viewMode === "grouped" ? (
          <GroupedView
            filteredUsers={filteredUsers}
            colors={colors} aColors={aColors} insets={insets}
            cardAnims={cardAnims}
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
            renderItem={({ item: user, index }) => {
              const cardAnim = cardAnims[index] || cardAnims[cardAnims.length - 1];
              return (
                <Animated.View style={{
                  opacity: cardAnim.opacity,
                  transform: [{ translateY: cardAnim.y }],
                }}>
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
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={[styles.emptyText, { color: c.subTextColor }]}>
                  Nenhum usuário correspondente encontrado.
                </Text>
              </View>
            }
          />
        )}
      </Animated.View>
    </View>
  );
}

// ── Sub-view: agrupada por turma (acordeão animado) ───────────────────────────

interface GroupedViewProps {
  filteredUsers:     AdminUser[];
  colors:            ReturnType<typeof useAdminColors>;
  aColors?:          any;
  insets:            ReturnType<typeof useSafeAreaInsets>;
  cardAnims:         { opacity: Animated.Value; y: Animated.Value }[];
  expandedTurmas:    Record<string, boolean>;
  setExpandedTurmas: (fn: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  onSelectUser:      (user: AdminUser) => void;
}

function GroupedView({
  filteredUsers, colors, aColors, insets,
  cardAnims, expandedTurmas, setExpandedTurmas, onSelectUser,
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
      {groupedByTurma.map(([turmaName, members], groupIndex) => {
        const isExpanded = !!expandedTurmas[turmaName];
        const cardAnim = cardAnims[groupIndex] || cardAnims[cardAnims.length - 1];
        return (
          <AnimatedTurmaCard
            key={turmaName}
            turmaName={turmaName}
            members={members}
            isExpanded={isExpanded}
            cardAnim={cardAnim}
            colors={c}
            onToggle={() => {
              setExpandedTurmas((prev) => ({ ...prev, [turmaName]: !prev[turmaName] }));
            }}
            onSelectUser={onSelectUser}
          />
        );
      })}
    </ScrollView>
  );
}

// ── Accordion card animado por turma ──────────────────────────────────────────

const MEMBER_ROW_HEIGHT = 58;

interface AnimatedTurmaCardProps {
  turmaName:    string;
  members:      AdminUser[];
  isExpanded:   boolean;
  cardAnim:     { opacity: Animated.Value; y: Animated.Value };
  colors:       any;
  onToggle:     () => void;
  onSelectUser: (user: AdminUser) => void;
}

function AnimatedTurmaCard({
  turmaName, members, isExpanded, cardAnim, colors: c,
  onToggle, onSelectUser,
}: AnimatedTurmaCardProps) {
  // ── Animated height for smooth open/close ────────────────────────────────
  const heightAnim = useRef(new Animated.Value(0)).current;

  // Per-member animated values (staggered fade-in + slide)
  const memberAnims = useRef(
    members.map(() => ({
      opacity: new Animated.Value(0),
      y:       new Animated.Value(12),
    }))
  ).current;

  // Chevron rotation
  const chevronAnim = useRef(new Animated.Value(0)).current;

  // ── Chevron rotation animation ──────────────────────────────────────────
  useEffect(() => {
    Animated.timing(chevronAnim, {
      toValue:         isExpanded ? 1 : 0,
      duration:        200,
      easing:          Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  // ── Height + stagger animation ──────────────────────────────────────────
  useEffect(() => {
    if (isExpanded) {
      const targetHeight = members.length * MEMBER_ROW_HEIGHT + 12;

      // Reset member anims
      memberAnims.forEach((a) => {
        a.opacity.setValue(0);
        a.y.setValue(12);
      });

      // Animate height open — timing puro, sem spring na JS thread
      Animated.timing(heightAnim, {
        toValue:         targetHeight,
        duration:        280,
        easing:          Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();

      // Stagger member rows immediately (no setTimeout)
      memberAnims.forEach((a, i) => {
        Animated.parallel([
          Animated.timing(a.opacity, {
            toValue:         1,
            duration:        220,
            delay:           i * 35,
            useNativeDriver: true,
          }),
          Animated.timing(a.y, {
            toValue:         0,
            duration:        220,
            delay:           i * 35,
            easing:          Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      // Animate height closed smoothly
      Animated.timing(heightAnim, {
        toValue:         0,
        duration:        200,
        easing:          Easing.in(Easing.quad),
        useNativeDriver: false,
      }).start();
    }
  }, [isExpanded]);

  // Ensure memberAnims array stays in sync with members count
  useEffect(() => {
    while (memberAnims.length < members.length) {
      memberAnims.push({ opacity: new Animated.Value(0), y: new Animated.Value(12) });
    }
  }, [members.length]);

  const chevronRotate = chevronAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  // Smoothly animated header border/padding
  const headerBorderWidth = heightAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const headerPadding = heightAnim.interpolate({
    inputRange:  [0, 12],
    outputRange: [0, 10],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        opacity:   cardAnim.opacity,
        transform: [{ translateY: cardAnim.y }],
        marginBottom: 16,
      }}
    >
      <View style={[styles.groupedCard, { backgroundColor: c.cardBg, borderColor: c.dividerColor }]}>
        {/* Cabeçalho sanfona */}
        <TouchableOpacity
          onPress={onToggle}
          activeOpacity={0.7}
        >
          <Animated.View style={[
            styles.groupedHeader,
            {
              borderBottomColor: c.dividerColor,
              borderBottomWidth: headerBorderWidth,
              paddingBottom:     headerPadding,
              marginBottom:      headerPadding,
            },
          ]}>
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
              <Animated.Text style={{
                fontSize: 11, color: "#22c55e", fontWeight: "700",
                transform: [{ rotate: chevronRotate }],
              }}>
                ▼
              </Animated.Text>
            </View>
          </Animated.View>
        </TouchableOpacity>

        {/* Integrantes — container com altura animada suavemente */}
        <Animated.View style={{ maxHeight: heightAnim, overflow: "hidden" }}>
          {members.map((user, idx) => {
            const anim = memberAnims[idx] || { opacity: new Animated.Value(1), y: new Animated.Value(0) };
            return (
              <Animated.View
                key={user.id}
                style={{
                  opacity:   anim.opacity,
                  transform: [{ translateY: anim.y }],
                }}
              >
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
              </Animated.View>
            );
          })}
        </Animated.View>
      </View>
    </Animated.View>
  );
}
