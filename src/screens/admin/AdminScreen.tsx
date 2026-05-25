import {
  View, Text, StatusBar, ActivityIndicator,
  TouchableOpacity, Animated,
} from "react-native";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAdminColors } from "../../theme/useAdminColors";
import { useTheme }       from "../../context/ThemeContext";
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
  const insets          = useSafeAreaInsets();
  const { isDark, setTheme } = useTheme();

  const data     = useAdminData();
  const anim     = useAdminAnimations();
  const exporter = useAdminExport(data.stats, data.users);

  useEffect(() => {
    anim.startEntranceAnimation();
    data.loadData();
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Animated.View style={[styles.header, {
        backgroundColor: colors.headerBg,
        paddingTop:      insets.top + 16,
        opacity:         anim.headerAnim,
      }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.adminAvatar, { backgroundColor: "#ef4444" }]}>
            <Text style={styles.avatarText}>AD</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerHello, { color: colors.subTextColor }]} numberOfLines={1}>
              Controle Escolar
            </Text>
            <Text style={[styles.headerName, { color: colors.textColor }]} numberOfLines={1}>
              Painel Admin
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setTheme(isDark ? "light" : "dark")}
            style={[styles.themeBtn, { backgroundColor: colors.bg }]}
            activeOpacity={0.8}
          >
            {isDark
              ? <IconSun color="#eab308" size={20} />
              : <IconMoonStars color="#3b82f6" size={20} />
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={data.handleLogout} style={styles.logoutBtn} activeOpacity={0.8}>
            <IconLogout color="#ef4444" size={22} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Tab bar ─────────────────────────────────────────────────────────── */}
      <View style={styles.tabContainer}>
        <View style={[styles.tabBar, { backgroundColor: colors.cardBg }]}>
          {(["dashboard", "users"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, data.tab === t && { backgroundColor: "#22c55e" }]}
              onPress={() => data.setTab(t)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.tabLabel,
                { color: data.tab === t ? "#ffffff" : colors.subTextColor, fontWeight: "800" },
              ]}>
                {t === "dashboard" ? "Dashboard" : "Usuários"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Conteúdo ────────────────────────────────────────────────────────── */}
      {data.loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={[styles.loadingText, { color: colors.subTextColor }]}>Carregando dados...</Text>
        </View>
      ) : data.tab === "dashboard" ? (
        <DashboardTab
          stats={data.stats}
          WEEK_DAYS={data.WEEK_DAYS}
          turmasRealData={data.turmasRealData}
          colors={colors}
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
          roleFilter={data.roleFilter} setRoleFilter={data.setRoleFilter}
          viewMode={data.viewMode}     setViewMode={data.setViewMode}
          expandedTurmas={data.expandedTurmas}
          setExpandedTurmas={data.setExpandedTurmas}
          colors={colors}
          insets={insets}
          listOpacity={anim.listOpacity}
          listY={anim.listY}
          onSelectUser={data.setSelectedUserDetails}
        />
      )}

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
    </View>
  );
}
