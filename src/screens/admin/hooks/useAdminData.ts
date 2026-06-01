import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../../store/useAuthStore";
import { logout } from "../../../services/authService";
import {
  fetchAdminStats,
  fetchAdminUsers,
  patchUserRole,
  removeUser,
  registerUser,
} from "../../../services/adminService";
import type {
  AdminUser, AdminStats, Role, RoleFilter,
  WeekDay, TurmaRealData,
} from "../admin.types";
import { ROLE_LABELS } from "../admin.types";
import type { AdminDialogState } from "../modals/AdminDialogModal";

export function useAdminData() {
  const navigation = useNavigation<any>();
  const adminUser  = useAuthStore((s) => s.user);

  // ── Core state ────────────────────────────────────────────────────────────
  const [tab,        setTab]        = useState<"dashboard" | "users">("dashboard");
  const [stats,      setStats]      = useState<AdminStats | null>(null);
  const [users,      setUsers]      = useState<AdminUser[]>([]);
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [loading,    setLoading]    = useState(true);

  // ── Modal state ───────────────────────────────────────────────────────────
  const [roleModalUser,        setRoleModalUser]        = useState<AdminUser | null>(null);
  const [selectedUserDetails,  setSelectedUserDetails]  = useState<AdminUser | null>(null);
  const [selectedTurmaDetails, setSelectedTurmaDetails] = useState<string | null>(null);
  const [dialogConfig,         setDialogConfig]         = useState<AdminDialogState | null>(null);

  // ── View mode ─────────────────────────────────────────────────────────────
  const [viewMode,       setViewMode]       = useState<"list" | "grouped">("list");
  const [expandedTurmas, setExpandedTurmas] = useState<Record<string, boolean>>({});

  // ── Create user form state ────────────────────────────────────────────────
  const [createUserModalVisible, setCreateUserModalVisible] = useState(false);
  const [newUserName,      setNewUserName]      = useState("");
  const [newUserEmail,     setNewUserEmail]     = useState("");
  const [newUserMatricula, setNewUserMatricula] = useState("");
  const [newUserPassword,  setNewUserPassword]  = useState("Descarte@2026");
  const [newUserTurma,     setNewUserTurma]     = useState("");
  const [newUserRole,      setNewUserRole]      = useState<Role>("STUDENT");
  const [isCreatingUser,   setIsCreatingUser]   = useState(false);

  // ── Data loading ──────────────────────────────────────────────────────────
  async function loadData() {
    setLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminUsers(),
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch {
      setDialogConfig({
        visible: true,
        type: "error",
        title: "Erro",
        message: "Não foi possível carregar os dados.",
        onConfirm: () => setDialogConfig(null),
      });
    } finally {
      setLoading(false);
    }
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  async function handleLogout() {
    setDialogConfig({
      visible: true,
      type: "logout",
      title: "Sair da conta?",
      message: "Tem certeza que deseja sair do Painel Admin?",
      confirmText: "Sair",
      cancelText: "Cancelar",
      onConfirm: async () => {
        await logout();
        navigation.replace("Login");
      },
      onCancel: () => setDialogConfig(null),
    });
  }

  async function handleChangeRole(user: AdminUser, newRole: Role) {
    if (user.id === adminUser?.id && newRole !== "ADMIN") {
      setDialogConfig({
        visible: true,
        type: "warning",
        title: "Atenção",
        message: "Você não pode remover seu próprio papel de administrador.",
        onConfirm: () => setDialogConfig(null),
      });
      return;
    }
    try {
      await patchUserRole(user.id, newRole);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u));
      if (selectedUserDetails && selectedUserDetails.id === user.id) {
        setSelectedUserDetails({ ...selectedUserDetails, role: newRole });
      }
      setRoleModalUser(null);
    } catch {
      setDialogConfig({
        visible: true,
        type: "error",
        title: "Erro",
        message: "Não foi possível alterar o cargo.",
        onConfirm: () => setDialogConfig(null),
      });
    }
  }

  async function handleDeleteUser(user: AdminUser) {
    if (user.id === adminUser?.id) {
      setDialogConfig({
        visible: true,
        type: "warning",
        title: "Atenção",
        message: "Você não pode deletar sua própria conta.",
        onConfirm: () => setDialogConfig(null),
      });
      return;
    }
    setDialogConfig({
      visible: true,
      type: "warning",
      title: "Remover usuário",
      message: `Tem certeza que deseja remover "${user.name}"? Esta ação é irreversível e excluirá todo o histórico de reciclagem deste aluno.`,
      confirmText: "Remover",
      cancelText: "Cancelar",
      onConfirm: async () => {
        try {
          await removeUser(user.id);
          setUsers((prev) => prev.filter((u) => u.id !== user.id));
          if (stats) setStats({ ...stats, totalUsers: stats.totalUsers - 1 });
          setSelectedUserDetails(null);
        } catch {
          setDialogConfig({
            visible: true,
            type: "error",
            title: "Erro",
            message: "Não foi possível remover o usuário.",
            onConfirm: () => setDialogConfig(null),
          });
        }
      },
      onCancel: () => setDialogConfig(null),
    });
  }

  async function handleCreateUser() {
    if (newUserName.trim().length < 2) {
      setDialogConfig({ visible: true, type: "warning", title: "Validação", message: "Nome completo deve ter pelo menos 2 caracteres.", onConfirm: () => setDialogConfig(null) });
      return;
    }
    if (/\d/.test(newUserName)) {
      setDialogConfig({ visible: true, type: "warning", title: "Validação", message: "Nome completo não pode conter números.", onConfirm: () => setDialogConfig(null) });
      return;
    }
    if (newUserMatricula.trim().length < 6 || !/^\d+$/.test(newUserMatricula)) {
      setDialogConfig({ visible: true, type: "warning", title: "Validação", message: "Matrícula deve conter pelo menos 6 dígitos numéricos.", onConfirm: () => setDialogConfig(null) });
      return;
    }
    if (!newUserEmail.includes("@")) {
      setDialogConfig({ visible: true, type: "warning", title: "Validação", message: "Informe um e-mail válido.", onConfirm: () => setDialogConfig(null) });
      return;
    }
    if (newUserPassword.length < 6) {
      setDialogConfig({ visible: true, type: "warning", title: "Validação", message: "Senha deve ter pelo menos 6 caracteres.", onConfirm: () => setDialogConfig(null) });
      return;
    }
    const normalizedTurma = newUserTurma.trim().toUpperCase().replace(/\s/g, "");
    if (!/^[1-9][A-Z]$/.test(normalizedTurma)) {
      setDialogConfig({ visible: true, type: "warning", title: "Validação", message: "Formato de turma inválido. Use letras e números simples como: 3B, 2A, 1C.", onConfirm: () => setDialogConfig(null) });
      return;
    }

    setIsCreatingUser(true);
    try {
      const { id: newUserId } = await registerUser({
        name:      newUserName.trim(),
        email:     newUserEmail.trim(),
        password:  newUserPassword,
        matricula: newUserMatricula.trim(),
        turma:     normalizedTurma,
      });

      let finalRole: Role = "STUDENT";
      if (newUserRole !== "STUDENT") {
        await patchUserRole(newUserId, newUserRole);
        finalRole = newUserRole;
      }

      const createdUser: AdminUser = {
        id:            newUserId,
        name:          newUserName.trim(),
        email:         newUserEmail.trim(),
        turma:         normalizedTurma,
        role:          finalRole,
        emailVerified: false,
        createdAt:     new Date().toISOString(),
      };

      setUsers((prev) => [...prev, createdUser]);
      if (stats) setStats({ ...stats, totalUsers: stats.totalUsers + 1 });

      setDialogConfig({
        visible: true,
        type: "success",
        title: "Sucesso",
        message: `Usuário "${newUserName}" cadastrado com sucesso como ${ROLE_LABELS[finalRole]}!`,
        onConfirm: () => setDialogConfig(null),
      });

      // Limpa campos
      setNewUserName("");
      setNewUserEmail("");
      setNewUserMatricula("");
      setNewUserPassword("Descarte@2026");
      setNewUserTurma("");
      setNewUserRole("STUDENT");
      setCreateUserModalVisible(false);
    } catch (err: any) {
      const errMsg = err?.response?.data?.error
        ?? "Não foi possível cadastrar o usuário. Verifique se o e-mail ou matrícula já estão registrados.";
      setDialogConfig({
        visible: true,
        type: "error",
        title: "Erro de Cadastro",
        message: errMsg,
        onConfirm: () => setDialogConfig(null),
      });
    } finally {
      setIsCreatingUser(false);
    }
  }

  // ── Computed values ───────────────────────────────────────────────────────
  const filteredUsers = users.filter((u) => {
    const q            = search.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.turma.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const scansCount    = stats?.totalScans ?? 0;
  const carbonOffset  = (scansCount * 0.15).toFixed(1);
  const wasteDiverted = (scansCount * 0.25).toFixed(1);

  // Agrupamento por dia de semana com dados reais (APENAS DA SEMANA ATUAL)
  const now = new Date();
  const currentDay = now.getDay();
  // Se hoje for domingo (0), a segunda-feira da semana foi 6 dias atrás.
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() + diffToMonday);
  startOfThisWeek.setHours(0, 0, 0, 0);

  const allScans = users.flatMap((u) => u.scans ?? []);
  let segCount = 0, terCount = 0, quaCount = 0, quiCount = 0, sexCount = 0;
  
  allScans.forEach((scan) => {
    if (!scan.createdAt) return;
    const scanDate = new Date(scan.createdAt);
    
    // Ignorar scans que ocorreram antes da segunda-feira desta semana
    if (scanDate < startOfThisWeek) return;
    
    const day = scanDate.getDay();
    if      (day === 1) segCount++;
    else if (day === 2) terCount++;
    else if (day === 3) quaCount++;
    else if (day === 4) quiCount++;
    else if (day === 5) sexCount++;
  });
  const maxDailyScans = Math.max(1, segCount, terCount, quaCount, quiCount, sexCount);
  const WEEK_DAYS: WeekDay[] = [
    { label: "Seg", day: "MON", count: segCount, percentage: (segCount / maxDailyScans) * 100 },
    { label: "Ter", day: "TUE", count: terCount, percentage: (terCount / maxDailyScans) * 100 },
    { label: "Qua", day: "WED", count: quaCount, percentage: (quaCount / maxDailyScans) * 100 },
    { label: "Qui", day: "THU", count: quiCount, percentage: (quiCount / maxDailyScans) * 100 },
    { label: "Sex", day: "FRI", count: sexCount, percentage: (sexCount / maxDailyScans) * 100 },
  ];

  // Ranking real de turmas
  const turmasRealData: TurmaRealData[] = (() => {
    const map: Record<string, { scansCount: number; membersCount: number }> = {};
    users.forEach((u) => {
      if (!u.turma) return;
      const key            = u.turma.toUpperCase().trim();
      const userScansCount = u.scans?.length ?? 0;
      if (!map[key]) map[key] = { scansCount: 0, membersCount: 0 };
      map[key].scansCount  += userScansCount;
      map[key].membersCount += 1;
    });
    return Object.entries(map)
      .map(([turma, data]) => ({ turma, ...data }))
      .sort((a, b) => b.scansCount - a.scansCount);
  })();

  return {
    // state
    tab, setTab,
    stats, setStats,
    // Dialog
    dialogConfig, setDialogConfig,
    users, setUsers,
    search, setSearch,
    roleFilter, setRoleFilter,
    loading,
    // modal state
    roleModalUser, setRoleModalUser,
    selectedUserDetails, setSelectedUserDetails,
    selectedTurmaDetails, setSelectedTurmaDetails,
    // view mode
    viewMode, setViewMode,
    expandedTurmas, setExpandedTurmas,
    // create user state
    createUserModalVisible, setCreateUserModalVisible,
    newUserName, setNewUserName,
    newUserEmail, setNewUserEmail,
    newUserMatricula, setNewUserMatricula,
    newUserPassword, setNewUserPassword,
    newUserTurma, setNewUserTurma,
    newUserRole, setNewUserRole,
    isCreatingUser,
    // handlers
    loadData,
    handleLogout,
    handleChangeRole,
    handleDeleteUser,
    handleCreateUser,
    // computed
    filteredUsers,
    carbonOffset,
    wasteDiverted,
    WEEK_DAYS,
    turmasRealData,
  };
}
