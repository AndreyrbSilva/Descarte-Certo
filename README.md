# Descarte Certo ♻️

> Aplicativo mobile gamificado que torna a reciclagem divertida para estudantes do ensino fundamental. Escaneie resíduos, ganhe pontos, suba no ranking da sua turma e da escola.

[![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_54-000?style=flat&logo=react)](https://expo.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Fastify-000?style=flat&logo=nodedotjs)](https://fastify.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-000?style=flat&logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-000?style=flat&logo=supabase)](https://supabase.com)

---

## Visão Geral

O Descarte Certo resolve um problema real: crianças não sabem separar o lixo corretamente e não têm motivação para aprender. O app transforma esse comportamento através de gamificação. O aluno aponta a câmera para um resíduo, o app identifica a categoria e recompensa com pontos. Rankings por turma e escola criam competição saudável.

**Stack:**

| Camada | Tecnologia |
|---|---|
| Mobile | React Native + Expo SDK 54 + TypeScript |
| Estilo | StyleSheet nativo |
| Estado | Zustand |
| Backend | Node.js + Fastify + TypeScript |
| ORM | Prisma 7 |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | JWT + bcrypt + AES (matrícula) + TOTP (2FA) |
| E-mail transacional | Brevo |
| Backend de IA | Python + FastAPI (Hospedado no Hugging Face Spaces) |

---

## Estrutura do Repositório

```
descarte-certo/
├── src/                        # App mobile (React Native)
│   ├── components/
│   │   ├── icons/              # Ícones customizados SVG-based
│   │   └── modals/             # Modais reutilizáveis (StreakSheetModal)
│   ├── context/
│   │   └── ThemeContext.tsx    # Contexto global de tema (dark/light/system)
│   ├── hooks/                  # Hooks de animação e cores por tela
│   ├── lib/
│   │   ├── streakColors.ts     # Mapeamento de cores por nível de streak
│   │   └── themeStorage.ts     # Persistência da preferência de tema
│   ├── screens/
│   │   └── student/            # Fluxo do aluno
│   ├── services/               # Chamadas à API
│   ├── store/                  # Zustand (estado global)
│   └── app/                    # Navegação (Stack + Tab)
├── backend/                    # API Node.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── controllers/
│       ├── lib/                # prisma.ts, crypto.ts, blacklist.ts, mailer.ts
│       ├── middlewares/
│       └── routes/
└── README.md
```

---

## Pré-requisitos

- Node.js >= 20
- npm >= 10
- Expo CLI (`npm install -g expo-cli`)
- Conta no [Supabase](https://supabase.com)
- Conta no [Brevo](https://brevo.com) para envio de e-mails
- Dispositivo físico ou emulador com Expo Go instalado

---

## Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/AndreyrbSilva/descarte-certo.git
cd descarte-certo
```

### 2. Mobile

```bash
npm install
```

Crie o arquivo `src/services/api.ts` e configure o `baseURL` com o IP da máquina onde o backend estará rodando:

```ts
export const api = axios.create({
  baseURL: "http://SEU_IP_LOCAL:3333",
});
```

> **Atenção:** use o IP da rede local (ex: `192.168.0.107`), não `localhost`. O dispositivo físico precisa estar na mesma rede que o backend.

### 3. Backend

```bash
cd backend
npm install
```

Crie o arquivo `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:SUASENHA@db.SEUPROJECT.supabase.co:5432/postgres"
JWT_SECRET="chave_jwt_longa_e_aleatoria"
AES_SECRET="chave_aes_longa_e_aleatoria_32chars"
BREVO_API_KEY="sua_api_key_do_brevo"
PORT=3333
```

> **Wi-Fi corporativo ou de provedor:** algumas redes bloqueiam a porta `5432`. Se receber `P1001`, use hotspot móvel para rodar as migrations ou adicione `?family=4` no final da `DATABASE_URL` para forçar IPv4.

### 4. Banco de dados

Com o `.env` configurado, rode as migrations:

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

---

## Rodando o Projeto

### Backend

```bash
cd backend
npm run dev
```

O servidor sobe em `http://localhost:3333`. Verifique com:

```bash
curl http://localhost:3333/health
# {"status":"ok"}
```

### Mobile

Em outro terminal, na raiz do projeto:

```bash
npx expo start
```

Escaneie o QR code com o Expo Go (Android) ou a câmera (iOS).

---

## Rotas da API

### Auth

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/auth/register` | Cadastro de aluno | ❌ |
| POST | `/auth/login` | Login, retorna JWT + dados do usuário | ❌ |
| POST | `/auth/logout` | Logout, invalida token | ✅ |
| GET | `/auth/me` | Dados atuais do usuário autenticado | ✅ |
| PATCH | `/auth/avatar` | Atualiza URL do avatar | ✅ |
| POST | `/auth/email/send-code` | Envia código de verificação de e-mail | ✅ |
| POST | `/auth/email/verify` | Confirma e-mail com código | ✅ |
| POST | `/auth/email/change` | Inicia troca de e-mail (envia código pro novo) | ✅ |
| POST | `/auth/email/change/confirm` | Confirma troca de e-mail com código | ✅ |
| POST | `/auth/password/change` | Altera senha (requer 2FA se ativo) | ✅ |
| POST | `/auth/2fa/setup` | Gera secret + QR Code TOTP | ✅ |
| POST | `/auth/2fa/verify` | Confirma ativação do 2FA | ✅ |
| POST | `/auth/2fa/disable` | Desativa 2FA | ✅ |

### Scan

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/scan` | Registra escaneamento, calcula pontos e streak | ✅ |
| GET | `/scan/points` | Total de pontos do usuário | ✅ |
| GET | `/scan/history` | Últimos 20 escaneamentos | ✅ |
| GET | `/scan/streak` | Streak atual (dias consecutivos com scan) | ✅ |

### Ranking

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/ranking/me` | Posição do usuário na turma e na escola | ✅ |
| GET | `/ranking/turma` | Top 10 da turma com streak | ✅ |
| GET | `/ranking/escola` | Top 15 da escola com streak e turma | ✅ |

### Perfil público

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/profile/:userId` | Perfil público de outro usuário | ✅ |

> Rotas marcadas com ✅ exigem header `Authorization: Bearer <token>`.

### Categorias e pontuação

| Categoria | Lixeira | Pontos |
|---|---|---|
| `plastico` | Vermelha | 10 |
| `papel` | Azul | 10 |
| `metal` | Amarela | 10 |
| `organico` | Marrom | 10 |
| `vidro` | Verde | 10 |

---

## Segurança

- Senhas com **bcrypt** (salt 10)
- Matrícula criptografada com **AES** no banco
- JWT com expiração de **7 dias**
- **Token blacklist** no logout
- **Rate limiting** global (100 req/min) e restrito no login (5 req/min por IP)
- Validação de entrada com **Zod** em todas as rotas
- **2FA TOTP** opcional via Google Authenticator ou similar
- Troca de e-mail e senha protegidas por código de verificação ou TOTP quando 2FA está ativo

---

## Sistema de Streak

O streak representa dias consecutivos com pelo menos um scan. A cor do ícone de chama evolui conforme o nível:

| Dias | Cor |
|---|---|
| 0 | Cinza (inativo) |
| 1–2 | Laranja claro |
| 3–6 | Laranja |
| 7–13 | Vermelho |
| 14–20 | Vermelho escuro |
| 21–29 | Amarelo |
| 30–44 | Verde |
| 45–59 | Ciano |
| 60–89 | Azul |
| 90–119 | Roxo |
| 120+ | Rosa |

Ao subir de nível, um overlay animado aparece na HomeScreen com o novo foguinho e a cor do nível atingido.

---

## Fluxo de uma Requisição (Scan)

```
Aluno abre o app
  → tira foto do resíduo em base64 (Expo Camera)
  → app recorta a região do frame e mantém o base64 (expo-image-manipulator)
  → envia para API da IA no Hugging Face (POST /classify)
  → recebe category e confidence
  → se confidence < 85%, exibe alerta de "Nenhum resíduo reconhecido"
  → caso contrário, envia category para backend Node.js (POST /scan)
  → backend valida JWT + blacklist
  → calcula pontos, atualiza UserPoints e computa streak
  → retorna { category, pointsEarned, totalPoints, streak }
  → app exibe tela de resultado com barra de certeza animada
  → ao voltar para Home, detecta level up de streak e exibe overlay
```

---

## Roadmap

- [x] Autenticação completa (registro, login, logout, sessão persistente)
- [x] Escaneamento com câmera e resultado animado
- [x] Sistema de pontos e histórico
- [x] Sistema de streak com foguinho animado e níveis de cor
- [x] Overlay de level up ao subir de nível de streak
- [x] Modal de selos de sequência (milestone sheet)
- [x] Ranking por turma (top 10) e escola (top 15) com pódio animado
- [x] Perfil público de outros alunos via ranking
- [x] Tela de perfil com avatar, XP, histórico e filtros de tempo
- [x] Upload de avatar no Supabase Storage
- [x] Tela de configurações com trocar tema, verificação de e-mail, troca de e-mail e senha, 2FA TOTP
- [x] Sistema de tema dark/light persistido com override do sistema
- [x] Missões diárias funcionais
- [x] Sistema de troféus e conquistas (31 troféus: scans, pontos, streak, ranking turma/escola, consistência, diversidade, missões)
- [x] Smooth screen transitions (JS stack navigator, no white flash on back navigation)
- [x] Backend de IA (FastAPI + TensorFlow/MobileNet)
- [x] Integração do modelo de classificação de resíduos
- [x] Recuperação de senha por e-mail (fluxo completo: envio de código, verificação OTP 6 dígitos, redefinição com medidor de força)
- [ ] Painel administrativo
- [ ] Deploy (Railway + EAS Build)

---

## Variáveis de Ambiente

| Variável | Onde | Descrição |
|---|---|---|
| `DATABASE_URL` | `backend/.env` | Connection string do Supabase |
| `JWT_SECRET` | `backend/.env` | Chave para assinar tokens JWT |
| `AES_SECRET` | `backend/.env` | Chave para criptografar matrículas |
| `BREVO_API_KEY` | `backend/.env` | API key do Brevo para envio de e-mails |
| `PORT` | `backend/.env` | Porta do servidor (padrão: 3333) |
| `AI_API_URL` | `src/services/scanService.ts` | URL da API de classificação de IA |

> Nunca commite o arquivo `.env`. Ele já está no `.gitignore`.
