import { useRef, useState } from "react";
import { Animated, Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import type { AdminStats, AdminUser } from "../admin.types";

export function useAdminExport(stats: AdminStats | null, users: AdminUser[]) {
  const [isExporting,    setIsExporting]    = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStepText, setExportStepText] = useState("");
  const exportProgressAnim = useRef(new Animated.Value(0)).current;

  function handleExportReport() {
    setIsExporting(true);
    setExportProgress(0);
    setExportStepText("Carregando registros de reciclagem...");
    exportProgressAnim.setValue(0);

    Animated.timing(exportProgressAnim, {
      toValue: 1, duration: 2500, useNativeDriver: false,
    }).start();

    const listener = exportProgressAnim.addListener(({ value }) => {
      const progress = Math.round(value * 100);
      setExportProgress(progress);
      if      (progress < 25) setExportStepText("Carregando registros de reciclagem...");
      else if (progress < 50) setExportStepText("Analisando desempenho ecológico...");
      else if (progress < 75) setExportStepText("Gerando gráficos analíticos...");
      else if (progress < 98) setExportStepText("Finalizando documento...");
      else                    setExportStepText("Exportação concluída!");
    });

    const totalUsers  = stats?.totalUsers  ?? users.length;
    const totalScans  = stats?.totalScans  ?? 0;
    const totalPoints = stats?.totalPoints ?? 0;
    const turmasData  = stats?.turmas      ?? [];

    const currentDate = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
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
        <tr><th>Turma</th><th>Integrantes Ativos</th></tr>
      </thead>
      <tbody>
        ${turmasData.map(t => `
          <tr>
            <td><strong>Turma ${t.turma}</strong></td>
            <td>${t.count} integrante(s)</td>
          </tr>
        `).join("") || '<tr><td colspan="2" style="text-align:center;color:#64748b;padding:20px;">Nenhuma turma registrada no momento.</td></tr>'}
      </tbody>
    </table>

    <h2 class="section-title">Quadro de Usuários Cadastrados</h2>
    <table>
      <thead>
        <tr><th>Nome</th><th>E-mail</th><th>Turma</th><th>Cargo</th><th>Matrícula</th></tr>
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
        `).join("") || '<tr><td colspan="5" style="text-align:center;color:#64748b;padding:20px;">Nenhum usuário cadastrado.</td></tr>'}
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
          const blob = new Blob([htmlContent], { type: "text/html" });
          const url  = URL.createObjectURL(blob);
          const a    = document.createElement("a");
          a.href     = url;
          a.download = `Descarte_Certo_Relatorio_Sustentabilidade_${new Date().getFullYear()}.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          Alert.alert("Sucesso", "Relatório escolar visual gerado e baixado com sucesso no seu navegador!");
        } else {
          const fileUri = FileSystem.documentDirectory + "Descarte_Certo_Relatorio_Sustentabilidade.html";
          await FileSystem.writeAsStringAsync(fileUri, htmlContent, { encoding: "utf8" });
          Alert.alert("Sucesso", `Relatório gerado com sucesso localmente!\n\nCaminho: ${fileUri}`);
        }
      } catch (err: any) {
        console.error("Erro ao salvar arquivo:", err);
        Alert.alert("Erro", "Ocorreu um erro ao salvar o relatório no dispositivo.");
      }
    }, 2800);
  }

  return {
    isExporting,
    exportProgress,
    exportStepText,
    exportProgressAnim,
    handleExportReport,
  };
}
