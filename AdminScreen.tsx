import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Animated, Alert, ActivityIndicator,
  TextInput, Modal, FlatList, Platform,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useRef, useEffect, useState, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system/legacy";

import { logout } from "../../services/authService";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";
import { useAdminColors } from "../../theme/useAdminColors";
import { useTheme } from "../../context/ThemeContext";
import {
  IconUser, IconLogout, IconShield, IconStar,
  IconRecycle, IconHash, IconTrend, IconMedal,
  IconBulb, IconSun, IconMoonStars,
} from "../../components/icons";

// ── Types ────────────────────────────────────────────────────────────────────

type Role = "STUDENT" | "TEACHER" | "ADMIN";
type RoleFilter = "ALL" | Role;

interface AdminUser {
  id: string;
  name: string;
  email: string;
  turma: string;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
  scans?: {
    id: string;
    category: string;
    points: number;
  }[];
  points?: {
    total: number;
  };
}

interface AdminStats {
  totalUsers: number;
  totalScans: number;
  totalPoints: number;
  turmas: { turma: string; count: number }[];
  roles: { role: Role; count: number }[];
}

const ROLE_LABELS: Record<Role, string> = {
  STUDENT: "Aluno",
  TEACHER: "Professor",
  ADMIN:   "Admin",
};

const ROLES: Role[] = ["STUDENT", "TEACHER", "ADMIN"];

// ── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, accent, colors, animOpacity, animY,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
  colors: ReturnType<typeof useAdminColors>;
  animOpacity: Animated.Value;
  animY: Animated.Value;
}) {
  return (
    <Animated.View style={{
      opacity: animOpacity,
      transform: [{ translateY: animY }],
      flex: 1,
    }}>
      <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
        <View style={styles.statHeaderRow}>
          <View style={[styles.iconWrap, { backgroundColor: accent + "15" }]}>
            {icon}
          </View>
          <Text style={[styles.statValue, { color: colors.textColor }]} numberOfLines={1}>
            {value}
          </Text>
        </View>
        <Text style={[styles.statLabel, { color: colors.subTextColor }]}>{label}</Text>
      </View>
    </Animated.View>
  );
}

function RoleBadge({ role, colors }: { role: Role; colors: ReturnType<typeof useAdminColors> }) {
  const map = {
    STUDENT: colors.badgeStudent,
    TEACHER: colors.badgeTeacher,
    ADMIN:   colors.badgeAdmin,
  };
  const badge = map[role];
  return (
    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
      <Text style={[styles.badgeText, { color: badge.text }]}>{ROLE_LABELS[role]}</Text>
    </View>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────

export function AdminScreen() {
  const navigation = useNavigation<any>();
  const colors     = useAdminColors();
  const insets     = useSafeAreaInsets();
  const adminUser  = useAuthStore((s) => s.user);
  const { isDark, setTheme } = useTheme();

  const [tab,         setTab]        = useState<"dashboard" | "users">("dashboard");
  const [stats,       setStats]      = useState<AdminStats | null>(null);
  const [users,       setUsers]      = useState<AdminUser[]>([]);
  const [search,      setSearch]     = useState("");
  const [roleFilter,  setRoleFilter] = useState<RoleFilter>("ALL");
  const [loading,     setLoading]    = useState(true);

  // Modais de Ações
  const [roleModalUser, setRoleModalUser] = useState<AdminUser | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<AdminUser | null>(null);
  const [selectedTurmaDetails, setSelectedTurmaDetails] = useState<string | null>(null);

  // Modo de visualização dos usuários (Lista ou Agrupado por Turma)
  const [viewMode, setViewMode] = useState<"list" | "grouped">("list");
  const [expandedTurmas, setExpandedTurmas] = useState<Record<string, boolean>>({});

  // Modal Novo Cadastro (Ideia 3)
  const [createUserModalVisible, setCreateUserModalVisible] = useState(false);
  const [newUserName, setNewUserName]           = useState("");
  const [newUserEmail, setNewUserEmail]         = useState("");
  const [newUserMatricula, setNewUserMatricula] = useState("");
  const [newUserPassword, setNewUserPassword]   = useState("Descarte@2026"); // Padrão média força
  const [newUserTurma, setNewUserTurma]         = useState("");
  const [newUserRole, setNewUserRole]           = useState<Role>("STUDENT");
  const [isCreatingUser, setIsCreatingUser]     = useState(false);

  // Exportação de PDF (Ideia 3)
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStepText, setExportStepText] = useState("");
  const exportProgressAnim = useRef(new Animated.Value(0)).current;

  // entrance animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const s0Opacity  = useRef(new Animated.Value(0)).current;
  const s0Y        = useRef(new Animated.Value(24)).current;
  const s1Opacity  = useRef(new Animated.Value(0)).current;
  const s1Y        = useRef(new Animated.Value(24)).current;
  const s2Opacity  = useRef(new Animated.Value(0)).current;
  const s2Y        = useRef(new Animated.Value(24)).current;
  const s3Opacity  = useRef(new Animated.Value(0)).current;
  const s3Y        = useRef(new Animated.Value(24)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;
  const listY       = useRef(new Animated.Value(24)).current;

  const slide = useCallback((o: Animated.Value, y: Animated.Value) =>
    Animated.parallel([
      Animated.timing(o, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.timing(y, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]), []);

  useEffect(() => {
    Animated.stagger(60, [
      Animated.timing(headerAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      slide(s0Opacity, s0Y),
      slide(s1Opacity, s1Y),
      slide(s2Opacity, s2Y),
      slide(s3Opacity, s3Y),
      slide(listOpacity, listY),
    ]).start();

    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair", style: "destructive",
          onPress: async () => {
            await logout();
            navigation.replace("Login");
          },
        },
      ]
    );
  }

  // Ação de exportar relatório em PDF (Ideia 3)
  function handleExportReport() {
    setIsExporting(true);
    setExportProgress(0);
    setExportStepText("Carregando registros de reciclagem...");
    exportProgressAnim.setValue(0);

    Animated.timing(exportProgressAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();

    const listener = exportProgressAnim.addListener(({ value }) => {
      const progress = Math.round(value * 100);
      setExportProgress(progress);

      if (progress < 25) {
        setExportStepText("Carregando registros de reciclagem...");
      } else if (progress < 50) {
        setExportStepText("Analisando desempenho ecológico...");
      } else if (progress < 75) {
        setExportStepText("Gerando gráficos analíticos...");
      } else if (progress < 98) {
        setExportStepText("Finalizando documento...");
      } else {
        setExportStepText("Exportação concluída!");
      }
    });

    const totalUsers = stats?.totalUsers ?? users.length;
    const totalScans = stats?.totalScans ?? 0;
    const totalPoints = stats?.totalPoints ?? 0;
    const turmasData = stats?.turmas ?? [];

    const currentDate = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Descarte Certo - Relatório de Sustentabilidade</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 40px; }
    .container { max-width: 900px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 32px; }
    .title { font-size: 26px; color: #22c55e; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
    .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; font-weight: 500; }
    .date-badge { background: #f1f5f9; padding: 8px 14px; border-radius: 12px; font-size: 12px; font-weight: 600; color: #475569; border: 1px solid #e2e8f0; }
    .stats-grid { display: flex; gap: 20px; margin-bottom: 32px; }
    .stat-card { flex: 1; background: #f8fafc; padding: 22px; border-radius: 18px; text-align: center; border: 1px solid #e2e8f0; position: relative; overflow: hidden; }
    .stat-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #22c55e; }
    .stat-card.scans::before { background: #3b82f6; }
    .stat-card.points::before { background: #eab308; }
    .stat-value { font-size: 28px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
    .stat-label { font-size: 11px; color: #64748b; font-weight: 700; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .section-title { font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 36px; margin-bottom: 16px; border-left: 4px solid #22c55e; padding-left: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    th { background: #f8fafc; text-align: left; padding: 14px 16px; font-size: 12px; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid #e2e8f0; color: #334155; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #f8fafc; }
    .badge { display: inline-block; padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-student { background: #22c55e12; color: #166534; }
    .badge-teacher { background: #3b82f612; color: #1e40af; }
    .badge-admin { background: #ef444412; color: #991b1b; }
    .footer { text-align: center; margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="title">Descarte Certo</h1>
        <div class="subtitle">Relatório de Impacto de Sustentabilidade Escolar</div>
      </div>
      <div class="date-badge">Gerado em: ${currentDate}</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${totalUsers}</div>
        <div class="stat-label">Usuários Ativos</div>
      </div>
      <div class="stat-card scans">
        <div class="stat-value">${totalScans}</div>
        <div class="stat-label">Descartes Registrados</div>
      </div>
      <div class="stat-card points">
        <div class="stat-value">${totalPoints}</div>
        <div class="stat-label">Pontuação Total</div>
      </div>
    </div>

    <h2 class="section-title">Desempenho por Turma</h2>
    <table>
      <thead>
        <tr>
          <th>Turma</th>
          <th>Integrantes Ativos</th>
        </tr>
      </thead>
      <tbody>
        ${turmasData.map(t => `
          <tr>
            <td><strong>Turma ${t.turma}</strong></td>
            <td>${t.count} integrante(s)</td>
          </tr>
        `).join("") || '<tr><td colspan="2" style="text-align: center; color: #64748b; padding: 20px;">Nenhuma turma registrada no momento.</td></tr>'}
      </tbody>
    </table>

    <h2 class="section-title">Quadro de Usuários Cadastrados</h2>
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Turma</th>
          <th>Cargo</th>
          <th>Matrícula</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(u => `
          <tr>
            <td><strong>${u.name}</strong></td>
            <td>${u.email}</td>
            <td>${u.turma || "Sem turma"}</td>
            <td><span class="badge badge-${u.role.toLowerCase()}">${u.role === "STUDENT" ? "Aluno" : u.role === "TEACHER" ? "Professor" : "Admin"}</span></td>
            <td><code>${u.matricula || "N/A"}</code></td>
          </tr>
        `).join("") || '<tr><td colspan="5" style="text-align: center; color: #64748b; padding: 20px;">Nenhum usuário cadastrado.</td></tr>'}
      </tbody>
    </table>

    <div class="footer">
      <strong>Descarte Certo</strong> &copy; ${new Date().getFullYear()} - Sistema Inteligente de Descarte Sustentável.
    </div>
  </div>
</body>
</html>`;

    setTimeout(async () => {
      exportProgressAnim.removeListener(listener);
      setIsExporting(false);

      try {
        if (Platform.OS === "web") {
          // Download do HTML visual no navegador
          const blob = new Blob([htmlContent], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Descarte_Certo_Relatorio_Sustentabilidade_${new Date().getFullYear()}.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          Alert.alert(
            "Sucesso",
            "Relatório escolar visual gerado e baixado com sucesso no seu navegador!"
          );
        } else {
          // Gravação no FileSystem nativo do dispositivo
          const fileUri = FileSystem.documentDirectory + "Descarte_Certo_Relatorio_Sustentabilidade.html";
          await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
            encoding: "utf8",
          });

          Alert.alert(
            "Sucesso",
            `Relatório gerado com sucesso localmente!\n\nCaminho: ${fileUri}`
          );
        }
      } catch (err: any) {
        console.error("Erro ao salvar arquivo:", err);
        Alert.alert("Erro", "Ocorreu um erro ao salvar o relatório no dispositivo.");
      }
    }, 2800);
  }

  // Criação rápida de usuário integrado à API real (Ideia 3)
  async function handleCreateUser() {
    // Validações locais conforme Zod do backend
    if (newUserName.trim().length < 2) {
      Alert.alert("Validação", "Nome completo deve ter pelo menos 2 caracteres.");
      return;
    }
    if (/\d/.test(newUserName)) {
      Alert.alert("Validação", "Nome completo não pode conter números.");
      return;
    }
    if (newUserMatricula.trim().length < 6 || !/^\d+$/.test(newUserMatricula)) {
      Alert.alert("Validação", "Matrícula deve conter pelo menos 6 dígitos numéricos.");
      return;
    }
    if (!newUserEmail.includes("@")) {
      Alert.alert("Validação", "Informe um e-mail válido.");
      return;
    }
    if (newUserPassword.length < 6) {
      Alert.alert("Validação", "Senha deve ter pelo menos 6 caracteres.");
      return;
    }
    // validação formato da turma ex: 3B
    const normalizedTurma = newUserTurma.trim().toUpperCase().replace(/\s/g, "");
    if (!/^[1-9][A-Z]$/.test(normalizedTurma)) {
      Alert.alert("Validação", "Formato de turma inválido. Use letras e números simples como: 3B, 2A, 1C.");
      return;
    }

    setIsCreatingUser(true);
    try {
      // 1. Cadastra usuário na rota pública /auth/register
      const registerRes = await api.post("/auth/register", {
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        password: newUserPassword,
        matricula: newUserMatricula.trim(),
        turma: normalizedTurma,
      });

      const newUserId = registerRes.data.id;

      // 2. Se a Role for diferente de STUDENT, faz o PATCH para atualizar o cargo
      let finalRole: Role = "STUDENT";
      if (newUserRole !== "STUDENT") {
        await api.patch(`/admin/users/${newUserId}/role`, { role: newUserRole });
        finalRole = newUserRole;
      }

      // 3. Atualiza estado local
      const createdUser: AdminUser = {
        id: newUserId,
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        turma: normalizedTurma,
        role: finalRole,
        emailVerified: false,
        createdAt: new Date().toISOString(),
      };

      setUsers((prev) => [...prev, createdUser]);
      if (stats) setStats({ ...stats, totalUsers: stats.totalUsers + 1 });

      Alert.alert("Sucesso", `Usuário "${newUserName}" cadastrado com sucesso como ${ROLE_LABELS[finalRole]}!`);

      // Limpa campos
      setNewUserName("");
      setNewUserEmail("");
      setNewUserMatricula("");
      setNewUserPassword("Descarte@2026");
      setNewUserTurma("");
      setNewUserRole("STUDENT");
      setCreateUserModalVisible(false);
    } catch (err: any) {
      const errMsg = err?.response?.data?.error ?? "Não foi possível cadastrar o usuário. Verifique se o e-mail ou matrícula já estão registrados.";
      Alert.alert("Erro de Cadastro", errMsg);
    } finally {
      setIsCreatingUser(false);
    }
  }

  async function handleChangeRole(user: AdminUser, newRole: Role) {
    if (user.id === adminUser?.id && newRole !== "ADMIN") {
      Alert.alert("Atenção", "Você não pode remover seu próprio papel de administrador.");
      return;
    }
    try {
      await api.patch(`/admin/users/${user.id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u));
      if (selectedUserDetails && selectedUserDetails.id === user.id) {
        setSelectedUserDetails({ ...selectedUserDetails, role: newRole });
      }
      setRoleModalUser(null);
    } catch {
      Alert.alert("Erro", "Não foi possível alterar o cargo.");
    }
  }

  async function handleDeleteUser(user: AdminUser) {
    if (user.id === adminUser?.id) {
      Alert.alert("Atenção", "Você não pode deletar sua própria conta.");
      return;
    }
    Alert.alert(
      "Remover usuário",
      `Tem certeza que deseja remover "${user.name}"? Esta ação é irreversível e excluirá todo o histórico de reciclagem deste aluno.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover", style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/admin/users/${user.id}`);
              setUsers((prev) => prev.filter((u) => u.id !== user.id));
              if (stats) setStats({ ...stats, totalUsers: stats.totalUsers - 1 });
              setSelectedUserDetails(null);
            } catch {
              Alert.alert("Erro", "Não foi possível remover o usuário.");
            }
          },
        },
      ]
    );
  }

  // Filtragem dos usuários com busca e filtros rápidos por cargo
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch = (
      u.name.toLowerCase().includes(q) ||
      u.turma.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Cálculos dinâmicos de impacto ecológico com base nos scans
  const scansCount = stats?.totalScans ?? 0;
  const carbonOffset = (scansCount * 0.15).toFixed(1); // 150g CO2 evitado por descarte correto
  const wasteDiverted = (scansCount * 0.25).toFixed(1); // 250g peso médio por descarte correto

  // 1. Extração de todos os scans do banco de dados a partir do array de usuários
  const allScans = users.flatMap((u) => u.scans ?? []);
  
  // 2. Agrupamento por dia de semana (Segunda a Sexta) com dados reais do banco
  let segCount = 0;
  let terCount = 0;
  let quaCount = 0;
  let quiCount = 0;
  let sexCount = 0;

  allScans.forEach((scan) => {
    if (!scan.createdAt) return;
    const date = new Date(scan.createdAt);
    const day = date.getDay(); // 0 = Dom, 1 = Seg, 2 = Ter, 3 = Qua, 4 = Qui, 5 = Sex, 6 = Sáb
    if (day === 1) segCount++;
    else if (day === 2) terCount++;
    else if (day === 3) quaCount++;
    else if (day === 4) quiCount++;
    else if (day === 5) sexCount++;
  });

  const maxDailyScans = Math.max(1, segCount, terCount, quaCount, quiCount, sexCount);

  const WEEK_DAYS = [
    { label: "Seg", day: "MON", count: segCount, percentage: (segCount / maxDailyScans) * 100 },
    { label: "Ter", day: "TUE", count: terCount, percentage: (terCount / maxDailyScans) * 100 },
    { label: "Qua", day: "WED", count: quaCount, percentage: (quaCount / maxDailyScans) * 100 },
    { label: "Qui", day: "THU", count: quiCount, percentage: (quiCount / maxDailyScans) * 100 },
    { label: "Sex", day: "FRI", count: sexCount, percentage: (sexCount / maxDailyScans) * 100 },
  ];

  // 3. Agrupamento de Turmas com 100% de coesão (Total Real de Scans por turma)
  const turmasRealData = (() => {
    const map: Record<string, { scansCount: number; membersCount: number }> = {};
    users.forEach((u) => {
      if (!u.turma) return;
      const turmaKey = u.turma.toUpperCase().trim();
      const userScansCount = u.scans?.length ?? 0;
      if (!map[turmaKey]) {
        map[turmaKey] = { scansCount: 0, membersCount: 0 };
      }
      map[turmaKey].scansCount += userScansCount;
      map[turmaKey].membersCount += 1;
    });

    return Object.entries(map).map(([turma, data]) => ({
      turma,
      scansCount: data.scansCount,
      membersCount: data.membersCount,
    })).sort((a, b) => b.scansCount - a.scansCount);
  })();

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      {/* HEADER ADAPTATIVO COM DUAL THEME */}
      <Animated.View style={[styles.header, {
        backgroundColor: colors.headerBg,
        paddingTop: insets.top + 16,
        opacity: headerAnim,
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
            {isDark ? (
              <IconSun color="#eab308" size={20} />
            ) : (
              <IconMoonStars color="#3b82f6" size={20} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.8}>
            <IconLogout color="#ef4444" size={22} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* TABS COESAS (borderRadius: 20, visual sutil) */}
      <View style={styles.tabContainer}>
        <View style={[styles.tabBar, { backgroundColor: colors.cardBg }]}>
          {(["dashboard", "users"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.tabBtn,
                tab === t && { backgroundColor: "#22c55e" },
              ]}
              onPress={() => setTab(t)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.tabLabel,
                {
                  color: tab === t ? "#ffffff" : colors.subTextColor,
                  fontWeight: "800",
                },
              ]}>
                {t === "dashboard" ? "Dashboard" : "Usuários"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={[styles.loadingText, { color: colors.subTextColor }]}>Carregando dados...</Text>
        </View>
      ) : tab === "dashboard" ? (
        // ── ABA DASHBOARD (ALINHADO COM HOMESCREEN) ───────────────────────────
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >

          {/* Grid de Estatísticas (Cards borderRadius: 20) */}
          <Text style={[styles.sectionLabel, { color: colors.subTextColor }]}>DADOS GERAIS</Text>
          <View style={styles.statsRow}>
            <StatCard
              icon={<IconUser color="#22c55e" />}
              label="Total Alunos" value={stats?.totalUsers ?? 0} accent="#22c55e"
              colors={colors} animOpacity={s0Opacity} animY={s0Y}
            />
            <StatCard
              icon={<IconRecycle color="#f97316" />}
              label="Total Scans" value={stats?.totalScans ?? 0} accent="#f97316"
              colors={colors} animOpacity={s1Opacity} animY={s1Y}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              icon={<IconStar color="#3b82f6" />}
              label="Pontos Escolares" value={(stats?.totalPoints ?? 0).toLocaleString("pt-BR")} accent="#3b82f6"
              colors={colors} animOpacity={s2Opacity} animY={s2Y}
            />
            <StatCard
              icon={<IconHash color="#a855f7" />}
              label="Total Turmas" value={stats?.turmas.length ?? 0} accent="#a855f7"
              colors={colors} animOpacity={s3Opacity} animY={s3Y}
            />
          </View>

          {/* PAINEL DE AÇÕES RÁPIDAS (Ideia 3) */}
          <Animated.View style={{ opacity: s0Opacity, transform: [{ translateY: s0Y }] }}>
            <Text style={[styles.sectionLabel, { color: colors.subTextColor, marginTop: 8 }]}>
              AÇÕES RÁPIDAS
            </Text>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                onPress={() => setCreateUserModalVisible(true)}
                style={[styles.quickActionBtn, { backgroundColor: colors.cardBg }]}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIconWrap, { backgroundColor: "#22c55e12" }]}>
                  <IconUser color="#22c55e" size={18} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.quickActionTitle, { color: colors.textColor }]}>
                    Novo Cadastro
                  </Text>
                  <Text style={[styles.quickActionDesc, { color: colors.subTextColor }]}>
                    Aluno ou Professor
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* GRÁFICO DE TENDÊNCIA SEMANAL (Ideia 1) */}
          <Animated.View style={{ opacity: s1Opacity, transform: [{ translateY: s1Y }] }}>
            <Text style={[styles.sectionLabel, { color: colors.subTextColor, marginTop: 8 }]}>
              DESEMPENHO DA SEMANA
            </Text>
            <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
              <View style={styles.chartTitleRow}>
                <IconTrend color="#22c55e" size={18} />
                <Text style={[styles.chartTitleText, { color: colors.textColor }]}>
                  Volume de Coleta Diário
                </Text>
              </View>
              <Text style={[styles.chartSubText, { color: colors.subTextColor }]}>
                Média de descartes por dia útil da semana (Seg - Sex).
              </Text>

              <View style={styles.chartBarsContainer}>
                {WEEK_DAYS.map((d, index) => {
                  const percentage = d.percentage;
                  const volume = d.count;

                  return (
                    <View key={d.day} style={styles.chartColumn}>
                      <Text style={[styles.chartBarValue, { color: colors.textColor }]}>
                        {volume}
                      </Text>
                      <View style={[styles.chartBarTrack, { backgroundColor: colors.dividerColor }]}>
                        <View style={[
                          styles.chartBarFill,
                          {
                            height: `${percentage}%`,
                            backgroundColor: index === 2 ? "#22c55e" : "#22c55e90" // Destaque na quarta-feira
                          }
                        ]} />
                      </View>
                      <Text style={[styles.chartBarLabel, { color: colors.subTextColor }]}>
                        {d.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </Animated.View>

          {/* Ranking de Turmas (Estilo Lista de Ranking da Home) */}
          {turmasRealData.length > 0 && (
            <Animated.View style={{ opacity: listOpacity, transform: [{ translateY: listY }] }}>
              <Text style={[styles.sectionLabel, { color: colors.subTextColor, marginTop: 8 }]}>
                RANKING DE TURMAS
              </Text>
              <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
                {turmasRealData.map((t, i) => {
                  const maxScans = Math.max(1, ...turmasRealData.map((x) => x.scansCount));
                  const pct = (t.scansCount / maxScans) * 100;
                  return (
                    <View key={t.turma} style={{ marginVertical: 4 }}>
                      <TouchableOpacity
                        onPress={() => setSelectedTurmaDetails(t.turma)}
                        activeOpacity={0.7}
                        style={styles.rankItemRow}
                      >
                        {i < 3 ? (
                          <IconMedal type={i === 0 ? "gold" : i === 1 ? "silver" : "bronze"} size={26} />
                        ) : (
                          <View style={styles.rankIconCircle}>
                            <Text style={styles.rankNumberText}>{i + 1}</Text>
                          </View>
                        )}
                        <View style={{ flex: 1, marginLeft: 8 }}>
                          <Text style={[styles.rankTurmaName, { color: colors.textColor }]}>
                            Turma {t.turma}
                          </Text>
                          <Text style={{ fontSize: 11, color: colors.subTextColor }}>
                            {t.membersCount} {t.membersCount === 1 ? "aluno" : "alunos"} (Ver alunos ➔)
                          </Text>
                        </View>
                        <Text style={[styles.rankTurmaCount, { color: "#22c55e" }]}>{t.scansCount} Scans</Text>
                      </TouchableOpacity>
                      <View style={[styles.progressTrack, { backgroundColor: colors.dividerColor, marginLeft: 34 }]}>
                        <View style={[styles.progressBar, { width: `${pct}%`, backgroundColor: "#22c55e" }]} />
                      </View>
                      {i < turmasRealData.length - 1 && (
                        <View style={[styles.divider, { backgroundColor: colors.dividerColor, marginVertical: 8, marginLeft: 34 }]} />
                      )}
                    </View>
                  );
                })}
              </View>
            </Animated.View>
          )}

          {/* Distribuição de Roles */}
          {stats && stats.roles.length > 0 && (
            <Animated.View style={{ opacity: listOpacity, transform: [{ translateY: listY }] }}>
              <Text style={[styles.sectionLabel, { color: colors.subTextColor, marginTop: 8 }]}>
                CARGOS REGISTRADOS
              </Text>
              <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
                {stats.roles.map((r, i) => (
                  <View key={r.role}>
                    <View style={styles.roleDistributionRow}>
                      <RoleBadge role={r.role} colors={colors} />
                      <Text style={[styles.rolePercent, { color: colors.textColor }]}>
                        {((r.count / (stats.totalUsers || 1)) * 100).toFixed(0)}%
                      </Text>
                      <Text style={[styles.roleCountNum, { color: colors.subTextColor }]}>
                        {r.count} {r.count === 1 ? "usuário" : "usuários"}
                      </Text>
                    </View>
                    {i < stats.roles.length - 1 && (
                      <View style={[styles.divider, { backgroundColor: colors.dividerColor, marginVertical: 8 }]} />
                    )}
                  </View>
                ))}
              </View>
            </Animated.View>
          )}
        </ScrollView>
      ) : (
        // ── ABA USUÁRIOS (GERENCIAMENTO PREMIUM COM FILTROS) ──────────────────
        <View style={{ flex: 1 }}>
          {/* Busca Nítida */}
          <Animated.View style={[styles.searchWrap, { opacity: listOpacity }]}>
            <TextInput
              style={[styles.searchInput, {
                backgroundColor: colors.inputBg,
                borderColor: colors.inputBorder,
                color: colors.textColor,
              }]}
              placeholder="Buscar aluno, turma ou e-mail..."
              placeholderTextColor={colors.subTextColor}
              value={search}
              onChangeText={setSearch}
            />
          </Animated.View>

          {/* Filtros rápidos por Cargo (Chips horizontais deslizáveis) */}
          <Animated.View style={[styles.chipsContainer, { opacity: listOpacity }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
              {(["ALL", "STUDENT", "TEACHER", "ADMIN"] as const).map((filter) => {
                const label = filter === "ALL" ? "Todos" : ROLE_LABELS[filter as Role];
                const active = roleFilter === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.chip,
                      { backgroundColor: active ? "#22c55e" : colors.cardBg },
                    ]}
                    onPress={() => setRoleFilter(filter)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.chipText,
                      { color: active ? "#ffffff" : colors.textColor },
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* Alternador de Visualização (Lista Unificada vs Agrupado por Turma) */}
          <Animated.View style={[styles.viewModeToggleContainer, { opacity: listOpacity, backgroundColor: colors.cardBg, borderColor: colors.dividerColor }]}>
            <TouchableOpacity
              style={[
                styles.viewModeBtn,
                viewMode === "list" && { backgroundColor: "#22c55e" }
              ]}
              onPress={() => setViewMode("list")}
              activeOpacity={0.8}
            >
              <Text style={[styles.viewModeBtnText, { color: viewMode === "list" ? "#ffffff" : colors.textColor }]}>
                Lista Unificada
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.viewModeBtn,
                viewMode === "grouped" && { backgroundColor: "#22c55e" }
              ]}
              onPress={() => setViewMode("grouped")}
              activeOpacity={0.8}
            >
              <Text style={[styles.viewModeBtnText, { color: viewMode === "grouped" ? "#ffffff" : colors.textColor }]}>
                Agrupar por Turma
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Lista de Usuários ou Agrupamento por Turma */}
          {viewMode === "grouped" ? (
            <ScrollView
              contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingHorizontal: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {(() => {
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
                      <Text style={[styles.emptyText, { color: colors.subTextColor }]}>
                        Nenhum usuário correspondente encontrado.
                      </Text>
                    </View>
                  );
                }

                return groupedByTurma.map(([turmaName, members]) => {
                  const isExpanded = !!expandedTurmas[turmaName];
                  return (
                    <Animated.View
                      key={turmaName}
                      style={{
                        opacity: listOpacity,
                        transform: [{ translateY: listY }],
                        marginBottom: 16,
                      }}
                    >
                      <View style={[styles.groupedCard, { backgroundColor: colors.cardBg, borderColor: colors.dividerColor }]}>
                        {/* Cabeçalho da Pasta Sanfona (Clicável) */}
                        <TouchableOpacity
                          style={[
                            styles.groupedHeader,
                            { 
                              borderBottomColor: colors.dividerColor,
                              borderBottomWidth: isExpanded ? 1 : 0,
                              paddingBottom: isExpanded ? 10 : 0,
                              marginBottom: isExpanded ? 10 : 0
                            }
                          ]}
                          onPress={() => setExpandedTurmas(prev => ({ ...prev, [turmaName]: !prev[turmaName] }))}
                          activeOpacity={0.7}
                        >
                          <View style={styles.groupedHeaderLeft}>
                            <IconHash color="#22c55e" size={16} />
                            <Text style={[styles.groupedHeaderTitle, { color: colors.textColor }]}>
                              Turma {turmaName}
                            </Text>
                          </View>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <Text style={[styles.groupedHeaderCount, { color: colors.subTextColor }]}>
                              {members.length} {members.length === 1 ? "integrante" : "integrantes"}
                            </Text>
                            <Text style={{ fontSize: 11, color: "#22c55e", fontWeight: "bold" }}>
                              {isExpanded ? "▲" : "▼"}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        {/* Integrantes da Turma (Exibidos apenas se a pasta estiver aberta) */}
                        {isExpanded && members.map((user, idx) => (
                          <View key={user.id}>
                            <TouchableOpacity
                              style={styles.groupedUserRow}
                              onPress={() => setSelectedUserDetails(user)}
                              activeOpacity={0.8}
                            >
                              <View style={[styles.avatarInitialWrapSmall, { backgroundColor: "#22c55e12" }]}>
                                <Text style={styles.userInitialSmall}>{user.name[0].toUpperCase()}</Text>
                              </View>
                              <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={[styles.userNameSmall, { color: colors.textColor }]} numberOfLines={1}>
                                  {user.name}
                                </Text>
                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                                  <RoleBadge role={user.role} colors={colors} />
                                  <Text style={{ fontSize: 11, color: colors.subTextColor, marginLeft: 8 }}>
                                    {user.scans?.length ?? 0} Scans • {user.points?.total ?? 0} pts
                                  </Text>
                                </View>
                              </View>
                              <Text style={[styles.arrowRight, { color: colors.subTextColor }]}>➔</Text>
                            </TouchableOpacity>
                            {idx < members.length - 1 && (
                              <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />
                            )}
                          </View>
                        ))}
                      </View>
                    </Animated.View>
                  );
                });
              })()}
            </ScrollView>
          ) : (
            <FlatList
              data={filteredUsers}
              keyExtractor={(u) => u.id}
              contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingHorizontal: 20 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: user }) => (
                <Animated.View style={{
                  opacity: listOpacity,
                  transform: [{ translateY: listY }],
                }}>
                  <TouchableOpacity
                    style={[styles.userCard, { backgroundColor: colors.cardBg }]}
                    onPress={() => setSelectedUserDetails(user)}
                    activeOpacity={0.8}
                  >
                    {/* Avatar redondo coeso com a HomeScreen */}
                    <View style={[styles.avatarInitialWrap, { backgroundColor: "#22c55e12" }]}>
                      <Text style={styles.userInitial}>{user.name[0].toUpperCase()}</Text>
                    </View>

                    {/* Detalhes do Usuário */}
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View style={styles.userNameRow}>
                        <Text style={[styles.userName, { color: colors.textColor }]} numberOfLines={1}>
                          {user.name}
                        </Text>
                      </View>
                      <Text style={[styles.userEmail, { color: colors.subTextColor }]} numberOfLines={1}>
                        {user.email}
                      </Text>
                      <View style={styles.userMeta}>
                        <RoleBadge role={user.role} colors={colors} />
                        <Text style={[styles.userMetaText, { color: colors.subTextColor }]}>
                          Turma: {user.turma || "N/A"}
                        </Text>
                      </View>
                    </View>

                    {/* Detalhe Seta Direita */}
                    <Text style={[styles.arrowRight, { color: colors.subTextColor }]}>➔</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Text style={[styles.emptyText, { color: colors.subTextColor }]}>
                    Nenhum usuário correspondente encontrado.
                  </Text>
                </View>
              }
            />
          )}
        </View>
      )}

      {/* ── MODAIS INTERATIVOS ─────────────────────────────────────────────────── */}

      {/* 2. FICHA ECOLÓGICA DETALHADA DO USUÁRIO (Ideia 2) */}
      <Modal
        visible={!!selectedUserDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedUserDetails(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setSelectedUserDetails(null)}
        >
          <View
            style={[styles.modalCard, { backgroundColor: colors.cardBg }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeaderCloseRow}>
              <Text style={[styles.modalTitle, { color: colors.textColor }]}>
                Ficha Ecológica
              </Text>
              <TouchableOpacity onPress={() => setSelectedUserDetails(null)} style={styles.closeModalBtn}>
                <Text style={{ fontSize: 20, color: colors.subTextColor }}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.dividerColor, marginVertical: 12 }]} />

            {selectedUserDetails && (() => {
              const totalUserScans = selectedUserDetails.scans?.length ?? 0;
              const totalUserPoints = selectedUserDetails.points?.total ?? 0;
              
              const userScansList = selectedUserDetails.scans ?? [];
              const plasticoCount = userScansList.filter(s => {
                const cat = s.category.toLowerCase();
                return cat === "plastico" || cat === "plástico";
              }).length;
              const papelCount = userScansList.filter(s => s.category.toLowerCase() === "papel").length;
              const metalCount = userScansList.filter(s => s.category.toLowerCase() === "metal").length;
              const vidroCount = userScansList.filter(s => s.category.toLowerCase() === "vidro").length;

              const plasticoPct = totalUserScans > 0 ? ((plasticoCount / totalUserScans) * 100).toFixed(0) + "%" : "0%";
              const papelPct = totalUserScans > 0 ? ((papelCount / totalUserScans) * 100).toFixed(0) + "%" : "0%";
              const metalPct = totalUserScans > 0 ? ((metalCount / totalUserScans) * 100).toFixed(0) + "%" : "0%";
              const vidroPct = totalUserScans > 0 ? ((vidroCount / totalUserScans) * 100).toFixed(0) + "%" : "0%";

              const resíduosArray = [
                { label: "Plástico", count: plasticoCount, color: "#ef4444", pct: plasticoPct },
                { label: "Papel", count: papelCount, color: "#3b82f6", pct: papelPct },
                { label: "Metal", count: metalCount, color: "#eab308", pct: metalPct },
                { label: "Vidro", count: vidroCount, color: "#22c55e", pct: vidroPct },
              ];

              return (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Cabeçalho Ficha */}
                  <View style={styles.fichaHeader}>
                    <View style={[styles.fichaAvatar, { backgroundColor: "#22c55e15" }]}>
                      <Text style={styles.fichaAvatarText}>{selectedUserDetails.name[0].toUpperCase()}</Text>
                    </View>
                    <Text style={[styles.fichaName, { color: colors.textColor }]}>
                      {selectedUserDetails.name}
                    </Text>
                    <Text style={[styles.fichaEmail, { color: colors.subTextColor }]}>
                      {selectedUserDetails.email}
                    </Text>
                    <View style={{ marginTop: 8 }}>
                      <RoleBadge role={selectedUserDetails.role} colors={colors} />
                    </View>
                  </View>

                  {/* Dados Técnicos */}
                  <View style={styles.fichaStatsRow}>
                    <View style={[styles.fichaStatItem, { backgroundColor: colors.bg }]}>
                      <Text style={[styles.fichaStatNum, { color: colors.textColor }]}>
                        {selectedUserDetails.turma || "N/A"}
                      </Text>
                      <Text style={[styles.fichaStatLabel, { color: colors.subTextColor }]}>Turma</Text>
                    </View>
                    <View style={[styles.fichaStatItem, { backgroundColor: colors.bg }]}>
                      <Text style={[styles.fichaStatNum, { color: "#22c55e" }]}>
                        {totalUserScans}
                      </Text>
                      <Text style={[styles.fichaStatLabel, { color: colors.subTextColor }]}>Scans</Text>
                    </View>
                    <View style={[styles.fichaStatItem, { backgroundColor: colors.bg }]}>
                      <Text style={[styles.fichaStatNum, { color: "#3b82f6" }]}>
                        {totalUserPoints}
                      </Text>
                      <Text style={[styles.fichaStatLabel, { color: colors.subTextColor }]}>Pontos</Text>
                    </View>
                  </View>

                  {/* Gráfico Distribuição de Resíduos (Ideia 2) */}
                  {selectedUserDetails.role === "STUDENT" && (
                    <View style={{ marginTop: 16 }}>
                      <Text style={[styles.fichaSectionLabel, { color: colors.textColor }]}>
                        Materiais Coletados
                      </Text>
                      <View style={styles.residuosGrid}>
                        {resíduosArray.map((item) => (
                          <View key={item.label} style={{ marginVertical: 4 }}>
                            <View style={styles.residuoTextRow}>
                              <Text style={[styles.residuoLabel, { color: colors.textColor }]}>
                                {item.label} ({item.count})
                              </Text>
                              <Text style={[styles.residuoPct, { color: colors.subTextColor }]}>
                                {item.pct}
                              </Text>
                            </View>
                            <View style={[styles.progressTrack, { backgroundColor: colors.dividerColor }]}>
                              <View style={[styles.progressBar, { width: item.pct, backgroundColor: item.color }]} />
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Ações de Administração na Ficha */}
                  <View style={styles.fichaActionsContainer}>
                    <TouchableOpacity
                      style={[styles.fichaBtn, { backgroundColor: "#3b82f615", borderColor: "#3b82f6" }]}
                      onPress={() => {
                        setRoleModalUser(selectedUserDetails);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={{ color: "#3b82f6", fontWeight: "700", fontSize: 13 }}>Alterar Cargo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.fichaBtn, { backgroundColor: "#ef444415", borderColor: "#ef4444" }]}
                      onPress={() => handleDeleteUser(selectedUserDetails)}
                      activeOpacity={0.8}
                    >
                      <Text style={{ color: "#ef4444", fontWeight: "700", fontSize: 13 }}>Remover Conta</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              );
            })()}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 2.5 MODAL DE DETALHES DE ALUNOS DA TURMA (RANKING DE TURMA) */}
      <Modal
        visible={selectedTurmaDetails !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTurmaDetails(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setSelectedTurmaDetails(null)}
        >
          <View
            style={[styles.modalCard, { backgroundColor: colors.cardBg }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeaderCloseRow}>
              <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={[styles.modalTitle, { color: colors.textColor }]}>
                  Alunos da Turma {selectedTurmaDetails}
                </Text>
                <Text style={{ fontSize: 12, color: colors.subTextColor, marginTop: 2 }}>
                  Alunos ordenados por pontuação. Toque para ver a Ficha Ecológica.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedTurmaDetails(null)}
                style={styles.closeModalBtn}
              >
                <Text style={{ fontSize: 20, color: colors.subTextColor }}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.dividerColor, marginVertical: 12 }]} />

            {selectedTurmaDetails && (() => {
              const classMembers = users
                .filter((u) => u.turma?.toUpperCase().trim() === selectedTurmaDetails.toUpperCase().trim())
                .sort((a, b) => (b.points?.total ?? 0) - (a.points?.total ?? 0));

              return (
                <FlatList
                  data={classMembers}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  renderItem={({ item: user, index }) => (
                    <TouchableOpacity
                      style={styles.groupedUserRow}
                      onPress={() => {
                        setSelectedUserDetails(user);
                        setSelectedTurmaDetails(null); // Fecha o modal da turma ao abrir o detalhe do aluno
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.avatarInitialWrapSmall, { backgroundColor: "#22c55e12" }]}>
                        <Text style={styles.userInitialSmall}>{user.name[0].toUpperCase()}</Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.userNameSmall, { color: colors.textColor }]} numberOfLines={1}>
                          {user.name}
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.subTextColor, marginTop: 2 }}>
                          Posição: #{index + 1} • {user.scans?.length ?? 0} Scans
                        </Text>
                      </View>
                      <View style={{ alignItems: "flex-end", marginRight: 8 }}>
                        <Text style={{ fontWeight: "700", color: "#22c55e", fontSize: 14 }}>
                          {user.points?.total ?? 0} pts
                        </Text>
                      </View>
                      <Text style={[styles.arrowRight, { color: colors.subTextColor }]}>➔</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={[styles.divider, { backgroundColor: colors.dividerColor, marginVertical: 4 }]} />
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                      <Text style={[styles.emptyText, { color: colors.subTextColor }]}>
                        Nenhum aluno registrado nesta turma.
                      </Text>
                    </View>
                  }
                />
              );
            })()}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 3. MODAL DE CADASTRO DE NOVO USUÁRIO (Ideia 3) */}
      <Modal
        visible={createUserModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateUserModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => !isCreatingUser && setCreateUserModalVisible(false)}
        >
          <View
            style={[styles.modalCard, { backgroundColor: colors.cardBg }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeaderCloseRow}>
              <Text style={[styles.modalTitle, { color: colors.textColor }]}>
                Novo Cadastro Rápido
              </Text>
              <TouchableOpacity
                onPress={() => !isCreatingUser && setCreateUserModalVisible(false)}
                style={styles.closeModalBtn}
                disabled={isCreatingUser}
              >
                <Text style={{ fontSize: 20, color: colors.subTextColor }}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.dividerColor, marginVertical: 12 }]} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
              {/* Nome */}
              <Text style={[styles.inputLabel, { color: colors.subTextColor }]}>NOME COMPLETO</Text>
              <TextInput
                style={[styles.modalInput, {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.inputBorder,
                  color: colors.textColor,
                }]}
                placeholder="ex: João Silva"
                placeholderTextColor={colors.subTextColor}
                value={newUserName}
                onChangeText={setNewUserName}
                editable={!isCreatingUser}
              />

              {/* Email */}
              <Text style={[styles.inputLabel, { color: colors.subTextColor }]}>E-MAIL</Text>
              <TextInput
                style={[styles.modalInput, {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.inputBorder,
                  color: colors.textColor,
                }]}
                placeholder="ex: joao@escola.com"
                placeholderTextColor={colors.subTextColor}
                value={newUserEmail}
                onChangeText={setNewUserEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isCreatingUser}
              />

              <View style={{ flexDirection: "row", gap: 12 }}>
                {/* Matrícula */}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: colors.subTextColor }]}>MATRÍCULA (MÍN. 6 DÍG)</Text>
                  <TextInput
                    style={[styles.modalInput, {
                      backgroundColor: colors.inputBg,
                      borderColor: colors.inputBorder,
                      color: colors.textColor,
                    }]}
                    placeholder="ex: 202611"
                    placeholderTextColor={colors.subTextColor}
                    value={newUserMatricula}
                    onChangeText={setNewUserMatricula}
                    keyboardType="numeric"
                    editable={!isCreatingUser}
                  />
                </View>

                {/* Turma */}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: colors.subTextColor }]}>TURMA (EX: 3B)</Text>
                  <TextInput
                    style={[styles.modalInput, {
                      backgroundColor: colors.inputBg,
                      borderColor: colors.inputBorder,
                      color: colors.textColor,
                    }]}
                    placeholder="ex: 3B"
                    placeholderTextColor={colors.subTextColor}
                    value={newUserTurma}
                    onChangeText={setNewUserTurma}
                    autoCapitalize="characters"
                    editable={!isCreatingUser}
                  />
                </View>
              </View>

              {/* Senha */}
              <Text style={[styles.inputLabel, { color: colors.subTextColor }]}>SENHA INICIAL</Text>
              <TextInput
                style={[styles.modalInput, {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.inputBorder,
                  color: colors.textColor,
                }]}
                placeholder="Senha inicial forte"
                placeholderTextColor={colors.subTextColor}
                value={newUserPassword}
                onChangeText={setNewUserPassword}
                autoCapitalize="none"
                editable={!isCreatingUser}
              />

              {/* Cargo Seletor (Chips) */}
              <Text style={[styles.inputLabel, { color: colors.subTextColor, marginBottom: 8 }]}>CARGO</Text>
              <View style={styles.roleSelectorRow}>
                {ROLES.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleSelectChip,
                      {
                        backgroundColor: newUserRole === role ? "#22c55e" : colors.bg,
                        borderColor: newUserRole === role ? "#22c55e" : colors.dividerColor,
                      },
                    ]}
                    onPress={() => setNewUserRole(role)}
                    disabled={isCreatingUser}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.roleSelectChipText, {
                      color: newUserRole === role ? "#fff" : colors.textColor,
                      fontWeight: "750",
                    }]}>
                      {ROLE_LABELS[role]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: "#22c55e", marginTop: 24 }]}
                onPress={handleCreateUser}
                disabled={isCreatingUser}
                activeOpacity={0.8}
              >
                {isCreatingUser ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Salvar Cadastro</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL SIMULAÇÃO EXPORTAÇÃO PDF PREMIUM (Ideia 3) */}
      <Modal visible={isExporting} transparent animationType="fade">
        <View style={styles.exportBackdrop}>
          <View style={[styles.exportCard, { backgroundColor: colors.cardBg }]}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={[styles.exportTitle, { color: colors.textColor, marginTop: 16 }]}>
              Exportando Relatório
            </Text>
            <Text style={[styles.exportStepText, { color: colors.subTextColor }]}>
              {exportStepText}
            </Text>

            <View style={[styles.exportProgressTrack, { backgroundColor: colors.bg, marginTop: 18 }]}>
              <View style={[styles.exportProgressBar, { width: `${exportProgress}%`, backgroundColor: "#3b82f6" }]} />
            </View>
            <Text style={[styles.exportProgressText, { color: "#3b82f6", fontWeight: "800", marginTop: 6 }]}>
              {exportProgress}%
            </Text>
          </View>
        </View>
      </Modal>

      {/* MODAL DE MUDANÇA DE CARGO SIMPLES (Ideia 2) */}
      <Modal
        visible={!!roleModalUser}
        transparent
        animationType="fade"
        onRequestClose={() => setRoleModalUser(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setRoleModalUser(null)}
        >
          <View
            style={[styles.modalCard, { backgroundColor: colors.cardBg }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.modalTitle, { color: colors.textColor }]}>
              Alterar Cargo
            </Text>
            <Text style={[styles.modalSub, { color: colors.subTextColor }]}>
              {roleModalUser?.name}
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.dividerColor, marginVertical: 16 }]} />
            {ROLES.map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleOption,
                  {
                    backgroundColor:
                      roleModalUser?.role === role ? "#22c55e15" : "transparent",
                    borderColor: roleModalUser?.role === role ? "#22c55e" : colors.dividerColor,
                  },
                ]}
                onPress={() => roleModalUser && handleChangeRole(roleModalUser, role)}
                activeOpacity={0.8}
              >
                <Text style={[styles.roleOptionText, {
                  color: roleModalUser?.role === role ? "#22c55e" : colors.textColor,
                  fontWeight: roleModalUser?.role === role ? "800" : "600",
                }]}>
                  {ROLE_LABELS[role]}
                </Text>
                {roleModalUser?.role === role && (
                  <Text style={{ color: "#22c55e", fontSize: 16, fontWeight: "800" }}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setRoleModalUser(null)}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalCancelText, { color: colors.subTextColor }]}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ── Styles (CONFORME DENTRO DAS DIRETRIZES DA HOMESCREEN) ───────────────────

const styles = StyleSheet.create({
  root:  { flex: 1 },

  // header adaptativo
  header: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "space-between",
    paddingHorizontal: 20,
    paddingBottom:   16,
  },
  headerLeft:  { flexDirection: "row", alignItems: "center", gap: 12, flex: 1, marginRight: 12 },
  adminAvatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center", overflow: "hidden",
  },
  avatarText:  { fontSize: 18, fontWeight: "800", color: "#fff" },
  headerInfo:  { flex: 1 },
  headerHello: { fontSize: 12, fontWeight: "500" },
  headerName:  { fontSize: 18, fontWeight: "800" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  themeBtn:    { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  logoutBtn:   { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },

  // tab bar (borderRadius 20 estilo capsule)
  tabContainer: { paddingHorizontal: 20, marginBottom: 12 },
  tabBar: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 4,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  tabBtn: {
    flex: 1, alignItems: "center",
    paddingVertical: 10,
    borderRadius: 18,
  },
  tabLabel: { fontSize: 13 },

  // loading
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: { fontSize: 14, fontWeight: "600" },

  // scroll / cards
  scroll:   { paddingHorizontal: 20, paddingTop: 10 },
  card:     {
    borderRadius: 20, padding: 18, marginBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  sectionLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6, marginBottom: 8, marginLeft: 2 },
  divider:  { height: 1 },

  // impact card (estilo factCard da home)
  impactCard: {
    borderRadius: 20, padding: 16, marginBottom: 18,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  impactContent: { flexDirection: "row", alignItems: "flex-start" },
  impactTitle:   { fontSize: 14, fontWeight: "800", marginBottom: 4 },
  impactText:    { fontSize: 12, lineHeight: 18 },

  // stats grid
  statsRow:  { flexDirection: "row", gap: 12, marginBottom: 12 },
  statCard:  {
    flex: 1, borderRadius: 20, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  statHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconWrap:      { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  statValue:    { fontSize: 20, fontWeight: "900", letterSpacing: -0.5, flex: 1, marginLeft: 8, textAlign: "right" },
  statLabel:    { fontSize: 11, fontWeight: "700", marginTop: 10 },

  // AÇÕES RÁPIDAS ROW (Ideia 3)
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

  // GRÁFICO SEMANAL (Ideia 1)
  chartTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  chartTitleText: { fontSize: 15, fontWeight: "850" },
  chartSubText: { fontSize: 12, marginBottom: 18 },
  chartBarsContainer: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "flex-end", height: 120, paddingHorizontal: 10,
  },
  chartColumn:   { alignItems: "center", width: "16%" },
  chartBarValue: { fontSize: 10, fontWeight: "800", marginBottom: 6 },
  chartBarTrack: { width: 14, height: 80, borderRadius: 7, overflow: "hidden", justifyContent: "flex-end" },
  chartBarFill:  { width: "100%", borderRadius: 7 },
  chartBarLabel: { fontSize: 11, fontWeight: "700", marginTop: 8 },

  // ranking turmas
  rankItemRow:   { flexDirection: "row", alignItems: "center", gap: 10 },
  rankIconCircle: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  rankNumberText: { fontSize: 12, fontWeight: "850", color: "#64748b" },
  rankTurmaName: { fontSize: 14, fontWeight: "700", flex: 1 },
  rankTurmaCount: { fontSize: 13, fontWeight: "800" },
  progressTrack: { height: 8, borderRadius: 4, overflow: "hidden", marginTop: 6 },
  progressBar:   { height: "100%", borderRadius: 4 },

  // role distribution
  roleDistributionRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  rolePercent:         { fontSize: 14, fontWeight: "800", width: 40, textAlign: "right" },
  roleCountNum:        { fontSize: 12, fontWeight: "600", flex: 1 },

  // badge
  badge:     { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.2 },

  // search
  searchWrap: { paddingHorizontal: 20, paddingTop: 10 },
  searchInput: {
    height: 48, borderRadius: 16, borderWidth: 1,
    paddingHorizontal: 16, fontSize: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
  },

  // chips
  chipsContainer: { paddingVertical: 10 },
  chipsScroll:    { paddingHorizontal: 20, gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  chipText: { fontSize: 12, fontWeight: "750" },

  // user card
  userCard: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 20, padding: 14, marginBottom: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  avatarInitialWrap: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  userInitial:     { fontSize: 18, fontWeight: "800", color: "#22c55e" },
  userNameRow:     { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  userName:        { fontSize: 14, fontWeight: "850", flex: 1 },
  userEmail:       { fontSize: 11, marginBottom: 6 },
  userMeta:        { flexDirection: "row", alignItems: "center", gap: 10 },
  userMetaText:    { fontSize: 11, fontWeight: "700" },
  arrowRight:      { fontSize: 14, fontWeight: "bold", paddingHorizontal: 4 },

  // empty
  emptyWrap: { padding: 40, alignItems: "center" },
  emptyText: { fontSize: 13, fontWeight: "600" },

  // modal base
  modalBackdrop: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center", justifyContent: "flex-end",
  },
  modalCard:    { width: "100%", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, elevation: 20, maxHeight: "90%" },
  modalTitle:   { fontSize: 18, fontWeight: "850" },
  modalSub:     { fontSize: 13, marginTop: 4 },
  modalHeaderCloseRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  closeModalBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  roleOption: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 14, borderRadius: 16, borderWidth: 1.5, marginBottom: 10,
  },
  roleOptionText: { fontSize: 14 },
  modalCancel:   { alignItems: "center", marginTop: 8, paddingVertical: 12 },
  modalCancelText: { fontSize: 14, fontWeight: "700" },

  // FICHA ECOLÓGICA DETALHES (Ideia 2)
  fichaHeader:      { alignItems: "center", marginVertical: 10 },
  fichaAvatar:      { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  fichaAvatarText:  { fontSize: 28, fontWeight: "900", color: "#22c55e" },
  fichaName:        { fontSize: 18, fontWeight: "850" },
  fichaEmail:       { fontSize: 12, marginTop: 2 },
  fichaStatsRow:    { flexDirection: "row", gap: 10, marginVertical: 16 },
  fichaStatItem:    { flex: 1, padding: 12, borderRadius: 16, alignItems: "center" },
  fichaStatNum:     { fontSize: 16, fontWeight: "900" },
  fichaStatLabel:   { fontSize: 11, fontWeight: "700", marginTop: 2 },
  fichaSectionLabel: { fontSize: 14, fontWeight: "850", marginBottom: 8 },
  residuosGrid:     { padding: 12, borderRadius: 20, borderWidth: 1, borderColor: "transparent" },
  residuoTextRow:   { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  residuoLabel:     { fontSize: 12, fontWeight: "800" },
  residuoPct:       { fontSize: 12, fontWeight: "700" },
  fichaActionsContainer: { flexDirection: "row", gap: 12, marginTop: 24, marginBottom: 8 },
  fichaBtn:         { flex: 1, height: 44, borderRadius: 14, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },

  // CADASTRO MODAL (Ideia 3)
  inputLabel:   { fontSize: 11, fontWeight: "850", letterSpacing: 0.3, marginTop: 14, marginBottom: 6 },
  modalInput:   { height: 48, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, fontSize: 13, marginBottom: 4 },
  roleSelectorRow: { flexDirection: "row", gap: 8, marginVertical: 4 },
  roleSelectChip:  { flex: 1, height: 38, borderRadius: 12, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  roleSelectChipText: { fontSize: 11 },
  saveBtn:      { height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  saveBtnText:  { color: "#fff", fontSize: 14, fontWeight: "850" },

  // EXPORTAÇÃO PDF MODAL (Ideia 3)
  exportBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },
  exportCard:     { width: "80%", borderRadius: 24, padding: 24, alignItems: "center", elevation: 12 },
  exportTitle:    { fontSize: 16, fontWeight: "850" },
  exportStepText: { fontSize: 12, marginTop: 4, textAlign: "center" },
  exportProgressTrack: { height: 6, width: "100%", borderRadius: 3, overflow: "hidden" },
  exportProgressBar:   { height: "100%" },
  exportProgressText:  { fontSize: 14 },

  // alternador de visualização
  viewModeToggleContainer: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 14,
    gap: 4,
  },
  viewModeBtn: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  viewModeBtnText: {
    fontSize: 12,
    fontWeight: "800",
  },

  // cards agrupados por turma
  groupedCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  groupedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  groupedHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  groupedHeaderTitle: {
    fontSize: 15,
    fontWeight: "850",
  },
  groupedHeaderCount: {
    fontSize: 11,
    fontWeight: "700",
  },
  groupedUserRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  avatarInitialWrapSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  userInitialSmall: {
    fontSize: 15,
    fontWeight: "800",
    color: "#22c55e",
  },
  userNameSmall: {
    fontSize: 13,
    fontWeight: "800",
  },
});
