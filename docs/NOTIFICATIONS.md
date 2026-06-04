# Sistema de Notificações Push — DescarteCerto

## Visão geral

O sistema de notificações oferece 10 tipos de notificações para manter os usuários engajados com o app de reciclagem. Utiliza **notificações locais** via `expo-notifications` em todas as categorias, com infraestrutura pronta para notificações push remotas no futuro.

## Categorias de notificação

| # | Tipo | Categoria | Gatilho | Modo |
|---|---|---|---|---|
| 1 | 🔥 Lembrete de sequência | `streak` | Todo dia às 18h | Local (recorrente) |
| 2 | 😢 Sequência perdida | `streak` | Ao abrir o app, streak = 0 | Local (sob demanda) |
| 3 | 🎯 Missão diária | `missions` | Todo dia às 8h | Local (recorrente) |
| 4 | 🏆 Missão quase concluída | `missions` | Após scan, progresso ≥ 80% | Local (sob demanda) |
| 5 | 🏅 Conquista desbloqueada | `achievements` | Após scan, nova conquista | Local (sob demanda) |
| 6 | 📊 Subiu no ranking | `ranking` | Após scan, posição melhorou | Local (sob demanda) |
| 7 | 📊 Caiu no ranking | `ranking` | Ao abrir o app, posição caiu | Local (sob demanda) |
| 8 | 📈 Resumo semanal | `weekly` | Segunda-feira às 9h | Local (recorrente) |
| 9 | 👋 Reengajamento | `reengagement` | 3 dias sem abrir o app | Local (agendado) |
| 10 | 🎉 Marco de pontos atingido | `milestones` | Após scan, cruzou um limiar | Local (sob demanda) |

## Arquitetura

```
src/
├── types/
│   └── notifications.ts              # Definições de tipos e metadados de categoria
├── services/
│   └── notificationService.ts        # Wrapper da API de notificações
├── store/
│   └── useNotificationStore.ts       # Store Zustand (preferências e rastreamento de estado)
├── hooks/
│   └── useNotificationScheduler.ts   # Hook de lógica de agendamento
├── screens/student/Config/
│   └── components/
│       └── NotificationToggle.tsx    # Componente de toggle nas configurações
App.tsx                               # Inicialização na raiz
```

## Como funciona

### Inicialização do app (`App.tsx`)
1. Rehidrata preferências de notificação do SecureStore
2. Configura o canal de notificação no Android
3. Solicita permissão para notificações push
4. Salva o token Expo push
5. Configura exibição de notificações em primeiro plano
6. Escuta respostas a toques em notificações

### Ao carregar a tela inicial (`useHomeData.ts`)
1. Busca dados do usuário (streak, ranking, pontos)
2. Chama `onAppOpen()`, que:
   - Verifica se a sequência foi perdida → dispara notificação "Sequência perdida"
   - Compara a posição salva no ranking → dispara "Caiu no ranking" se necessário
   - Reagenda todas as notificações recorrentes (reinicia o timer de reengajamento)

### Ao concluir um scan (`useScanResultData.ts`)
1. Recebe o resultado do scan com conquistas, pontos e streak
2. Chama `onScanCompleted()`, que:
   - Dispara "Conquista desbloqueada" para cada nova conquista
   - Verifica se os pontos cruzaram um marco (50, 100, 250, 500, 1000, 2500, 5000, 10000)
   - Verifica o progresso de missões → dispara "Missão quase concluída" se ≥ 80%
   - Compara a posição no ranking → dispara "Subiu no ranking" se melhorou
   - Reagenda notificações recorrentes (reinicia os timers de reengajamento e streak)

### Preferências do usuário (`ConfigScreen`)
- O usuário pode ativar/desativar cada categoria individualmente
- Preferências persistem via SecureStore
- Toda a lógica de notificações verifica as preferências antes de disparar

## Macete de reengajamento

A notificação de reengajamento usa uma abordagem inteligente:
- Uma notificação é agendada para daqui a 3 dias
- Toda vez que o usuário abre o app, ela é cancelada e reagendada
- Se o usuário ficar 3 dias sem abrir o app, a notificação dispara automaticamente

## Marcos de pontos

Notificações são disparadas ao cruzar os seguintes limiares:
`50 → 100 → 250 → 500 → 1000 → 2500 → 5000 → 10000`

## Integração futura com backend

Para migrar para notificações push remotas em tempo real:

1. **Salvar tokens push**: criar endpoint `POST /notifications/register` que salva o token Expo push por usuário
2. **Disparar em eventos**: quando o scan de outro usuário alterar o ranking, usar a Expo Push API para notificar os afetados
3. **Cron semanal**: adicionar um cron job que compila estatísticas semanais e envia resumos personalizados
4. **O frontend já está pronto**: o `expoPushToken` já é salvo no store e as categorias/tipos de notificação estão definidos