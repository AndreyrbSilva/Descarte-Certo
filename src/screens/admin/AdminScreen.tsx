import {
  View, Text, ActivityIndicator,
  TouchableOpacity, Animated,
} from "react-native";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAdminColors, useAnimatedAdminColors } from "../../theme/useAdminColors";
import { useTheme }       from "../../context/ThemeContext";
import { FocusAwareStatusBar } from "../../components/layout/FocusAwareStatusBar";
import { IconLogout, IconSun, IconMoonStars } from "../../components/icons";

import { useAdminData }       from "./hooks/useAdminData";
import { useAdminAnimations } from "./hooks/useAdminAnimations";
import { useAdminExport }     from "./hooks/useAdminExport";

import { DashboardTab }        from "./tabs/DashboardTab";
import { UsersTab }            from "./tabs/UsersTab";
import { UserDetailModal }     from "./modals/UserDetailModal";
import { ClassDetailModal }    from "./modals/ClassDetailModal";
import { ChangeRoleModal }     from "./modals/ChangeRoleModal";
import { CreateUserModal }     from "./modals/CreateUserModal";
import { ExportProgressModal } from "./modals/ExportProgressModal";

import { styles } from "./adminStyles";

export function AdminScreen() {
  const colors          = useAdminColors();
  const aColors         = useAnimatedAdminColors();
  const insets          = useSafeAreaInsets();
  const { isDark, setTheme } = useTheme();

  const data     = useAdminData();
  const anim     = useAdminAnimations();
  const exporter = useAdminExport(data.stats, data.users);

  const sunOpacity = aColors.animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const moonOpacity = aColors.animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  useEffect(() => {
    anim.startEntranceAnimation();
    data.loadData();
  }, []);

  // ── Tab switch: slide indicator FIRST, then swap state after fade ────────
  function handleTabSwitch(nextTab: "dashboard" | "users") {
    if (nextTab === data.tab) return;
    // Slide indicator on native thread (instant, smooth)
    anim.animateTabIndicator(nextTab);
    // Fade content, swap state at midpoint, fade back in
    anim.crossFadeContent(() => {
      data.setTab(nextTab);
    });
  }

  // ── Filter switch ─────────────────────────────────────────────────────────
  function handleRoleFilterChange(filter: typeof data.roleFilter) {
    if (filter === data.roleFilter) return;
    anim.crossFadeFilterContent(() => {
      data.setRoleFilter(filter);
      setTimeout(() => anim.animateCardEntrance(40), 20);
    });
  }

  // ── View mode switch ──────────────────────────────────────────────────────
  function handleViewModeChange(mode: "list" | "grouped") {
    if (mode === data.viewMode) return;
    anim.animateViewModeIndicator(mode);
    anim.crossFadeFilterContent(() => {
      data.setViewMode(mode);
      setTimeout(() => anim.animateCardEntrance(40), 20);
    });
  }

  return (
    <Animated.View style={[styles.root, { backgroundColor: aColors.bg }]}>
      <FocusAwareStatusBar animated={true} barStyle={colors.statusBar} backgroundColor={colors.bg} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Animated.View style={{ opacity: anim.headerAnim }}>
        <Animated.View style={[styles.header, {
          backgroundColor: aColors.headerBg,
          paddingTop:      insets.top + 16,
        }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.adminAvatar, { backgroundColor: "#ef4444" }]}>
            <Text style={styles.avatarText}>AD</Text>
          </View>
          <View style={styles.headerInfo}>
            <Animated.Text style={[styles.headerHello, { color: aColors.subTextColor }]} numberOfLines={1}>
              Controle Escolar
            </Animated.Text>
            <Animated.Text style={[styles.headerName, { color: aColors.textColor }]} numberOfLines={1}>
              Painel Admin
            </Animated.Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Animated.View
            style={[styles.themeBtn, { backgroundColor: aColors.bg }]}
          >
            <TouchableOpacity
              onPress={() => setTheme(isDark ? "light" : "dark")}
              style={[{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }]}
              activeOpacity={0.8}
            >
              <Animated.View style={{ position: "absolute", opacity: sunOpacity }}>
                <IconSun color="#eab308" size={20} />
              </Animated.View>
              <Animated.View style={{ position: "absolute", opacity: moonOpacity }}>
                <IconMoonStars color="#3b82f6" size={20} />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity onPress={data.handleLogout} style={styles.logoutBtn} activeOpacity={0.8}>
            <IconLogout color="#ef4444" size={22} />
          </TouchableOpacity>
        </View>
        </Animated.View>
      </Animated.View>

      {/* ── Tab bar — translateX nativo, zero stutter ─────────────────────── */}
      <View style={styles.tabContainer}>
        <Animated.View
          style={[styles.tabBar, { backgroundColor: aColors.cardBg }]}
          onLayout={(e) => anim.setTabBarWidth(e.nativeEvent.layout.width)}
        >
          {/* Indicator pill — positioned with translateX (native thread) */}
          <Animated.View
            style={{
              position:        "absolute",
              left:            4,
              width:           "50%",
              top:             4,
              bottom:          4,
              borderRadius:    18,
              backgroundColor: "#22c55e",
              transform:       [{ translateX: anim.tabAnim }],
            }}
          />
          {(["dashboard", "users"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn]}
              onPress={() => handleTabSwitch(t)}
              activeOpacity={0.8}
            >
              <Animated.Text style={[
                styles.tabLabel,
                {
                  color: data.tab === t ? "#ffffff" : aColors.subTextColor,
                  fontWeight: "800",
                },
              ]}>
                {t === "dashboard" ? "Dashboard" : "Usuários"}
              </Animated.Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>

      {/* ── Conteúdo (fade simples, nativo) ──────────────────────────────── */}
      <Animated.View style={{ flex: 1, opacity: anim.contentOpacity }}>
        {data.loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#22c55e" />
            <Animated.Text style={[styles.loadingText, { color: aColors.subTextColor }]}>Carregando dados...</Animated.Text>
          </View>
        ) : data.tab === "dashboard" ? (
          <DashboardTab
            stats={data.stats}
            WEEK_DAYS={data.WEEK_DAYS}
            turmasRealData={data.turmasRealData}
            colors={colors}
            aColors={aColors}
            insets={insets}
            s0Opacity={anim.s0Opacity} s0Y={anim.s0Y}
            s1Opacity={anim.s1Opacity} s1Y={anim.s1Y}
            s2Opacity={anim.s2Opacity} s2Y={anim.s2Y}
            s3Opacity={anim.s3Opacity} s3Y={anim.s3Y}
            listOpacity={anim.listOpacity} listY={anim.listY}
            onOpenCreateUser={() => data.setCreateUserModalVisible(true)}
            onOpenTurmaDetail={data.setSelectedTurmaDetails}
          />
        ) : (
          <UsersTab
            filteredUsers={data.filteredUsers}
            search={data.search}         setSearch={data.setSearch}
            roleFilter={data.roleFilter} setRoleFilter={handleRoleFilterChange}
            viewMode={data.viewMode}     setViewMode={handleViewModeChange}
            expandedTurmas={data.expandedTurmas}
            setExpandedTurmas={data.setExpandedTurmas}
            colors={colors}
            aColors={aColors}
            insets={insets}
            listOpacity={anim.listOpacity}
            listY={anim.listY}
            viewModeAnim={anim.viewModeAnim}
            setViewModeWidth={anim.setViewModeWidth}
            filterContentOpacity={anim.filterContentOpacity}
            cardAnims={anim.cardAnims}
            animateCardEntrance={anim.animateCardEntrance}
            onSelectUser={data.setSelectedUserDetails}
          />
        )}
      </Animated.View>

      {/* ── Modais ──────────────────────────────────────────────────────────── */}
      <UserDetailModal
        user={data.selectedUserDetails}
        colors={colors}
        onClose={() => data.setSelectedUserDetails(null)}
        onChangeRole={(user) => data.setRoleModalUser(user)}
        onDeleteUser={data.handleDeleteUser}
      />

      <ClassDetailModal
        turmaName={data.selectedTurmaDetails}
        users={data.users}
        colors={colors}
        onClose={() => data.setSelectedTurmaDetails(null)}
        onSelectUser={(user) => {
          data.setSelectedUserDetails(user);
          data.setSelectedTurmaDetails(null);
        }}
      />

      <ChangeRoleModal
        user={data.roleModalUser}
        colors={colors}
        onClose={() => data.setRoleModalUser(null)}
        onChangeRole={data.handleChangeRole}
      />

      <CreateUserModal
        visible={data.createUserModalVisible}
        colors={colors}
        onClose={() => data.setCreateUserModalVisible(false)}
        newUserName={data.newUserName}           setNewUserName={data.setNewUserName}
        newUserEmail={data.newUserEmail}         setNewUserEmail={data.setNewUserEmail}
        newUserMatricula={data.newUserMatricula} setNewUserMatricula={data.setNewUserMatricula}
        newUserPassword={data.newUserPassword}   setNewUserPassword={data.setNewUserPassword}
        newUserTurma={data.newUserTurma}         setNewUserTurma={data.setNewUserTurma}
        newUserRole={data.newUserRole}           setNewUserRole={data.setNewUserRole}
        isCreatingUser={data.isCreatingUser}
        onSubmit={data.handleCreateUser}
      />

      <ExportProgressModal
        visible={exporter.isExporting}
        exportProgress={exporter.exportProgress}
        exportStepText={exporter.exportStepText}
        colors={colors}
      />
    </Animated.View>
  );
}
