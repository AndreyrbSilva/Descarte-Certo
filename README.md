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
| Mobile | React Native + Expo + TypeScript |
| Estilo | StyleSheet nativo + NativeWind |
| Estado | Zustand + TanStack Query |
| Backend principal | Node.js + Fastify + TypeScript |
| ORM | Prisma 7 |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | JWT + bcrypt + AES (matrícula) |
| Backend de IA | Python + FastAPI *(em desenvolvimento)* |

---

## Estrutura do Repositório

```
descarte-certo/
├── src/                        # App mobile (React Native)
│   ├── components/
│   │   ├── icons/              # Ícones customizados (View-based, sem SVG externo)
│   │   ├── shared/
│   │   └── ui/
│   ├── constants/
│   │   └── theme.ts            # Cores globais
│   ├── hooks/                  # Hooks de animação e cores por tela
│   ├── screens/
│   │   ├── admin/              # Painel administrativo (em desenvolvimento)
│   │   └── student/            # Fluxo do aluno
│   ├── services/               # Chamadas à API
│   ├── store/                  # Zustand (estado global)
│   └── types/
├── backend/                    # API Node.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── controllers/
│       ├── lib/                # prisma.ts, crypto.ts, blacklist.ts
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
| POST | `/auth/login` | Login, retorna JWT | ❌ |
| POST | `/auth/logout` | Logout, invalida token | ✅ |

### Scan

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/scan` | Registra escaneamento e calcula pontos | ✅ |
| GET | `/scan/points` | Retorna total de pontos do usuário | ✅ |
| GET | `/scan/history` | Últimos 20 escaneamentos | ✅ |

### Ranking

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/ranking/me` | Posição do usuário na turma e na escola | ✅ |

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
- **Token blacklist** no logout — tokens invalidados são armazenados no banco e rejeitados em requisições futuras
- **Rate limiting** global (100 req/min) e restrito no login (5 req/min por IP) via `@fastify/rate-limit`
- Validação de entrada com **Zod** em todas as rotas

---

## Fluxo de uma Requisição (Scan)

```
Aluno abre o app
  → tira foto do resíduo (Expo Camera)
  → app recorta a região do frame (expo-image-manipulator)
  → envia categoria para POST /scan                    ← hoje: categoria simulada aleatória
  → backend valida JWT + blacklist
  → calcula pontos e salva Scan + atualiza UserPoints
  → retorna { category, pointsEarned, totalPoints }
  → app exibe tela de resultado com animação
```

> **Modo simulado:** enquanto o modelo de IA não está integrado, a categoria é sorteada aleatoriamente no `scanService.ts`. Quando o FastAPI estiver pronto, será necessário apenas substituir essa lógica — o restante do fluxo permanece idêntico.

---

## Roadmap

- [x] Autenticação completa (registro, login, logout, sessão persistente)
- [x] Escaneamento com câmera e resultado animado
- [x] Sistema de pontos e histórico
- [x] Ranking por turma e escola
- [ ] Tela de perfil do aluno
- [ ] Painel administrativo
- [ ] Backend de IA (FastAPI + TensorFlow)
- [ ] Integração do modelo de classificação de resíduos
- [ ] Missões diárias
- [ ] Sistema de troféus
- [ ] Recuperação de senha por e-mail
- [ ] Deploy (Railway + EAS Build)

---

## Variáveis de Ambiente

| Variável | Onde | Descrição |
|---|---|---|
| `DATABASE_URL` | `backend/.env` | Connection string do Supabase |
| `JWT_SECRET` | `backend/.env` | Chave para assinar tokens JWT |
| `AES_SECRET` | `backend/.env` | Chave para criptografar matrículas |
| `PORT` | `backend/.env` | Porta do servidor (padrão: 3333) |

> Nunca commite o arquivo `.env`. Ele já está no `.gitignore`.

---
