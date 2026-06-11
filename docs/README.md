# Descarte Certo ♻️
 
> A gamified mobile application that makes recycling fun for elementary school students. Scan waste items, earn points, and climb your classroom and school rankings.
 
[![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_54-000?style=flat\&logo=react)](https://expo.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Fastify-000?style=flat\&logo=nodedotjs)](https://fastify.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-000?style=flat\&logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-000?style=flat\&logo=supabase)](https://supabase.com)
 
---
 
## Overview
 
Descarte Certo solves a real-world problem: children often do not know how to separate waste correctly and lack motivation to learn. The app changes this behavior through gamification. Students point their camera at a waste item, the app identifies its category, and rewards them with points. Classroom and school rankings create healthy competition and encourage engagement.
 
**Tech Stack:**
 
| Layer               | Technology                                              |
| ------------------- | ------------------------------------------------------- |
| Mobile              | React Native + Expo SDK 54 + TypeScript                 |
| Styling             | Native StyleSheet                                       |
| State Management    | Zustand                                                 |
| Backend             | Node.js + Fastify + TypeScript                          |
| ORM                 | Prisma 7                                                |
| Database            | Supabase (PostgreSQL)                                   |
| Authentication      | JWT + bcrypt + AES (student ID encryption) + TOTP (2FA) |
| Transactional Email | Brevo                                                   |
| AI Backend          | Python + FastAPI (Hosted on Hugging Face Spaces)        |
 
---
 
## Repository Structure
 
```text
descarte-certo/
├── src/                            # Mobile application (React Native)
│   ├── app/                        # Navigation (Stack + Tabs)
│   ├── components/                 # Reusable components
│   ├── context/                    # Global contexts
│   ├── screens/student/            # Feature-based screens
│   ├── services/                   # API layer
│   ├── store/                      # Zustand global state
│   └── theme/                      # Centralized design system
├── backend/                        # Node.js API
│   ├── prisma/
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── lib/
│       ├── middlewares/
│       └── routes/
└── README.md
```
 
---
 
## Prerequisites
 
* Node.js >= 20
* npm >= 10
* Expo CLI (`npm install -g expo-cli`)
* Supabase account
* Brevo account for email delivery
* Physical device or emulator with Expo Go installed
 
---
 
## Setup
 
### 1. Clone the Repository
 
```bash
git clone https://github.com/AndreyrbSilva/descarte-certo.git
cd descarte-certo
```
 
### 2. Mobile Application
 
```bash
npm install
```
 
Create a `.env` file in the project root and configure the `API_URL` variable with the IP address of the machine running the backend:
 
```env
API_URL=http://YOUR_LOCAL_IP:3333
```
 
> **Important:** Use your local network IP (e.g. `192.168.0.107`) instead of `localhost`. Physical devices must be connected to the same network as the backend. The URL is automatically loaded through `expo-constants`.
 
### 3. Backend
 
```bash
cd backend
npm install
```
 
Create `backend/.env`:
 
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOURPROJECT.supabase.co:5432/postgres"
JWT_SECRET="long_random_jwt_secret"
AES_SECRET="long_random_32_character_aes_secret"
BREVO_API_KEY="your_brevo_api_key"
PORT=3333
```
 
> **Corporate or ISP Wi-Fi:** Some networks block port `5432`. If you encounter a `P1001` error, use a mobile hotspot when running migrations or append `?family=4` to the end of your `DATABASE_URL` to force IPv4.
 
### 4. Database
 
With the `.env` file configured, run:
 
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```
 
---
 
## Running the Project
 
### Backend
 
```bash
cd backend
npm run dev
```
 
The server will be available at:
 
```text
http://localhost:3333
```
 
Health check:
 
```bash
curl http://localhost:3333/health
# {"status":"ok"}
```
 
### Mobile
 
In another terminal, from the project root:
 
```bash
npx expo start
```
 
Scan the QR code using Expo Go (Android) or the Camera app (iOS).
 
---
 
## API Endpoints
 
### Authentication
 
| Method | Route                        | Description                      | Auth |
| ------ | ---------------------------- | -------------------------------- | ---- |
| POST   | `/auth/register`             | Student registration             | ❌    |
| POST   | `/auth/login`                | Login and return JWT + user data | ❌    |
| POST   | `/auth/logout`               | Logout and invalidate token      | ✅    |
| GET    | `/auth/me`                   | Current authenticated user data  | ✅    |
| PATCH  | `/auth/avatar`               | Update avatar URL                | ✅    |
| POST   | `/auth/email/send-code`      | Send email verification code     | ✅    |
| POST   | `/auth/email/verify`         | Verify email using code          | ✅    |
| POST   | `/auth/email/change`         | Start email change process       | ✅    |
| POST   | `/auth/email/change/confirm` | Confirm email change             | ✅    |
| POST   | `/auth/password/change`      | Change password                  | ✅    |
| POST   | `/auth/2fa/setup`            | Generate TOTP secret + QR Code   | ✅    |
| POST   | `/auth/2fa/verify`           | Confirm 2FA activation           | ✅    |
| POST   | `/auth/2fa/disable`          | Disable 2FA                      | ✅    |
 
### Scan
 
| Method | Route           | Description                               | Auth |
| ------ | --------------- | ----------------------------------------- | ---- |
| POST   | `/scan`         | Register scan and calculate points/streak | ✅    |
| GET    | `/scan/points`  | User total points                         | ✅    |
| GET    | `/scan/history` | Last 20 scans                             | ✅    |
| GET    | `/scan/streak`  | Current streak                            | ✅    |
 
### Ranking
 
| Method | Route             | Description                           | Auth |
| ------ | ----------------- | ------------------------------------- | ---- |
| GET    | `/ranking/me`     | Classroom and school ranking position | ✅    |
| GET    | `/ranking/turma`  | Top 10 classroom ranking              | ✅    |
| GET    | `/ranking/escola` | Top 15 school ranking                 | ✅    |
 
### Public Profile
 
| Method | Route              | Description                       | Auth |
| ------ | ------------------ | --------------------------------- | ---- |
| GET    | `/profile/:userId` | Public profile of another student | ✅    |
 
> Routes marked with ✅ require an `Authorization: Bearer <token>` header.
 
---
 
## Categories and Points
 
| Category  | Bin Color | Points |
| --------- | --------- | ------ |
| `plastic` | Red       | 10     |
| `paper`   | Blue      | 10     |
| `metal`   | Yellow    | 10     |
| `organic` | Brown     | 10     |
| `glass`   | Green     | 10     |
 
---
 
## Security
 
* Password hashing with **bcrypt** (salt rounds: 10)
* Student IDs encrypted with **AES**
* JWT expiration of **7 days**
* Token blacklist on logout
* Global rate limiting (100 req/min)
* Login rate limiting (5 req/min per IP)
* Input validation with **Zod**
* Optional **TOTP 2FA**
* Email and password changes protected by verification codes or TOTP when 2FA is enabled
 
---
 
## Streak System
 
A streak represents consecutive days with at least one scan. The flame icon color evolves according to the streak level:
 
| Days   | Color           |
| ------ | --------------- |
| 0      | Gray (inactive) |
| 1–2    | Light Orange    |
| 3–6    | Orange          |
| 7–13   | Red             |
| 14–20  | Dark Red        |
| 21–29  | Yellow          |
| 30–44  | Green           |
| 45–59  | Cyan            |
| 60–89  | Blue            |
| 90–119 | Purple          |
| 120+   | Pink            |
 
When a user reaches a new level, an animated overlay appears on the Home Screen displaying the upgraded flame and level color.
 
---
 
## Request Flow (Scan)
 
```text
Student opens the app
  → takes a photo of a waste item in base64 format (Expo Camera)
  → app crops the frame and preserves base64 data (expo-image-manipulator)
  → sends image to the AI API on Hugging Face (POST /classify)
  → receives category and confidence
  → if confidence < 85%, show "No waste item recognized"
  → otherwise send category to the Node.js backend (POST /scan)
  → backend validates JWT + blacklist
  → calculates points and updates streak
  → returns { category, pointsEarned, totalPoints, streak }
  → app displays animated result screen
  → upon returning to Home, detects streak level-up and displays overlay
```
 
---
 
## Environment Variables
 
| Variable            | Location       | Description                 |
| ------------------- | -------------- | --------------------------- |
| `SUPABASE_URL`      | Root `.env`    | Supabase project URL        |
| `SUPABASE_ANON_KEY` | Root `.env`    | Supabase anonymous key      |
| `API_URL`           | Root `.env`    | Backend API base URL        |
| `DATABASE_URL`      | `backend/.env` | Supabase connection string  |
| `JWT_SECRET`        | `backend/.env` | JWT signing secret          |
| `AES_SECRET`        | `backend/.env` | AES encryption key          |
| `BREVO_API_KEY`     | `backend/.env` | Brevo API key               |
| `PORT`              | `backend/.env` | Server port (default: 3333) |
 
> Never commit your `.env` files. They are already included in `.gitignore`.
