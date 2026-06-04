# 🔔 Sistema de Notificações Push — DescarteCerto v1.3.0

## Visão geral

O sistema de notificações oferece 10 tipos de notificações para manter os usuários engajados com o app de reciclagem. Combina **notificações locais** (agendadas no device) com **notificações remotas** (enviadas pelo backend via Expo Push API) para uma cobertura completa.

## Categorias de notificação

| # | Tipo | Categoria | Gatilho | Modo |
|---|---|---|---|---|
| 1 | 🔥 Lembrete de streak | `streak` | Todo dia às 18h | Local (recorrente) |
| 2 | 😢 Streak perdido | `streak` | Ao abrir o app, streak = 0 | Local (sob demanda) |
| 3 | 🎯 Missão diária | `missions` | Todo dia às 8h | Local (recorrente) |
| 4 | 🏆 Missão quase completa | `missions` | Após scan, progresso ≥ 80% | Local (sob demanda) |
| 5 | 🏅 Conquista desbloqueada | `achievements` | Após scan, nova conquista | Local (sob demanda) |
| 6 | 📊 Subiu no ranking | `ranking` | Após scan, posição melhorou | Local (sob demanda) |
| 7 | 📊 Alguém te ultrapassou | `ranking` | Outro aluno escaneia e te passa | **Remoto (push do backend)** |
| 8 | 📈 Resumo semanal | `weekly` | Segunda-feira às 9h | Local (recorrente) |
| 9 | 👋 Reengajamento | `reengagement` | 3 dias sem abrir o app | Local (agendado) |
| 10 | 🎉 Marco atingido | `milestones` | Após scan, cruzou limiar de pontos | Local (sob demanda) |

## Arquitetura

```
Frontend (React Native)
├── src/types/notifications.ts          # Tipos e metadados
├── src/services/notificationService.ts # API local + registro de token
├── src/store/useNotificationStore.ts   # Preferências (Zustand + SecureStore)
├── src/hooks/useNotificationScheduler.ts # Lógica de agendamento
├── src/screens/student/Config/components/NotificationToggle.tsx
└── App.tsx                             # Inicialização

Backend (Fastify + Prisma)
├── prisma/schema.prisma               # Model PushToken
├── src/services/pushNotificationService.ts # Expo Push API + ranking detection
├── src/controllers/notificationController.ts # POST /notifications/register
├── src/routes/notificationRoutes.ts
└── src/controllers/scanController.ts   # Ranking change notifications
```

## Fluxo completo

### 1. Inicialização do app (`App.tsx`)
1. Rehidrata preferências de notificação do SecureStore
2. Configura o canal de notificação no Android
3. Solicita permissão para notificações push
4. Salva o token Expo push localmente
5. **Registra o token no backend** (`POST /notifications/register`)
6. Escuta toques em notificações

### 2. Ao carregar a Home (`useHomeData.ts`)
Chama `onAppOpen()`, que:
- Verifica se o streak foi perdido → dispara notificação local
- Compara posição salva no ranking → dispara "Caiu no ranking" se caiu
- Reagenda todas as notificações recorrentes (reinicia reengajamento)

### 3. Ao concluir um scan (`useScanResultData.ts`)
Chama `onScanCompleted()`, que:
- Dispara "Conquista desbloqueada" para cada nova conquista
- Verifica marcos de pontos (50, 100, 250, 500, 1000, 2500, 5000, 10000)
- Verifica missão → "Missão quase completa" se ≥ 80%
- Compara ranking → "Subiu no ranking" se melhorou

### 4. Notificação remota de ranking (`scanController.ts` no backend)
Quando um aluno escaneia:
1. Backend calcula a nova posição no ranking da turma
2. Detecta quais alunos foram ultrapassados (diferença ≤ 10 pontos)
3. Busca os push tokens desses alunos no banco
4. Envia push notification em tempo real via Expo Push API
5. **O aluno recebe no celular mesmo com o app fechado** ✅

### 5. Preferências do usuário (`ConfigScreen`)
- Toggles por categoria (streak, missões, ranking, conquistas, etc.)
- Persistem via SecureStore
- Toda lógica verifica preferências antes de disparar

## Macete de reengajamento

- Agenda notificação local para daqui 3 dias
- Cada vez que o usuário abre o app, cancela e reagenda
- Se não abrir em 3 dias → dispara automaticamente

## Marcos de pontos

`50 → 100 → 250 → 500 → 1000 → 2500 → 5000 → 10000`

## Endpoints do backend

| Método | Rota | Descrição |
|---|---|---|
| POST | `/notifications/register` | Registra/atualiza token push do usuário |
| POST | `/scan` | (atualizado) Retorna `turmaRankPosition` e envia push para afetados |