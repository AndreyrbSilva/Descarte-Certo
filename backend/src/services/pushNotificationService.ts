import { prisma } from "../lib/prisma";

// ── Expo Push API ────────────────────────────────────────
const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface ExpoPushMessage {
  to:     string;
  title:  string;
  body:   string;
  data?:  Record<string, unknown>;
  sound?: "default" | null;
}

/**
 * Send push notifications via Expo Push API.
 * Accepts an array of messages and sends them in a single batch.
 */
export async function sendPushNotifications(messages: ExpoPushMessage[]): Promise<void> {
  if (messages.length === 0) return;

  try {
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Accept":       "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    if (!response.ok) {
      console.error("[PushService] Expo API error:", response.status, await response.text());
    }
  } catch (err) {
    console.error("[PushService] Failed to send push notifications:", err);
  }
}

/**
 * Register or update a user's Expo push token.
 */
export async function registerPushToken(userId: string, token: string): Promise<void> {
  await prisma.pushToken.upsert({
    where:  { userId },
    update: { token },
    create: { userId, token },
  });
}

/**
 * Get the push token for a specific user.
 */
export async function getUserPushToken(userId: string): Promise<string | null> {
  const record = await prisma.pushToken.findUnique({ where: { userId } });
  return record?.token ?? null;
}

/**
 * Get push tokens for multiple users.
 */
export async function getUsersPushTokens(userIds: string[]): Promise<Map<string, string>> {
  const records = await prisma.pushToken.findMany({
    where: { userId: { in: userIds } },
  });

  const map = new Map<string, string>();
  for (const r of records) {
    map.set(r.userId, r.token);
  }
  return map;
}

/**
 * After a scan, detect which users were affected by the ranking change
 * and notify them that someone passed them.
 */
export async function notifyRankingChanges(
  scannerUserId: string,
  scannerTurma:  string,
): Promise<void> {
  // Get the turma ranking (ordered by points DESC)
  const turmaUsers = await prisma.user.findMany({
    where:  { turma: scannerTurma },
    select: { id: true, name: true },
  });

  const turmaIds = turmaUsers.map((u) => u.id);

  const turmaPoints = await prisma.userPoints.findMany({
    where:   { userId: { in: turmaIds } },
    orderBy: { total: "desc" },
    select:  { userId: true, total: true },
  });

  // Find the scanner's current position
  const scannerIndex = turmaPoints.findIndex((p) => p.userId === scannerUserId);
  if (scannerIndex < 0) return; // scanner not in ranking yet

  const scannerPoints = turmaPoints[scannerIndex].total;

  // Find users who are now BELOW the scanner but were ABOVE before this scan
  // They are the ones immediately below the scanner with the same or slightly less points
  // Since the scan just happened, users right below the scanner in the same points range were likely passed
  const affectedUsers: string[] = [];

  // Check the user right below the scanner — if they have fewer points, they might have been passed
  for (let i = scannerIndex + 1; i < turmaPoints.length; i++) {
    const otherUserId = turmaPoints[i].userId;
    // Only notify if the difference is small enough that this scan likely caused the overtake
    // (within 10 points = 1 scan)
    if (scannerPoints - turmaPoints[i].total <= 10) {
      affectedUsers.push(otherUserId);
    } else {
      break; // further users were already below
    }
  }

  if (affectedUsers.length === 0) return;

  // Get push tokens for affected users
  const tokens = await getUsersPushTokens(affectedUsers);

  const scannerName = turmaUsers.find((u) => u.id === scannerUserId)?.name ?? "Alguém";
  const firstName = scannerName.split(" ")[0];

  const messages: ExpoPushMessage[] = [];

  for (const [userId, token] of tokens) {
    const userIndex = turmaPoints.findIndex((p) => p.userId === userId);
    const position  = userIndex + 1;

    messages.push({
      to:    token,
      title: "📊 Alguém te ultrapassou!",
      body:  `${firstName} te passou! Você agora está em ${position}º lugar. Escaneie para recuperar! ♻️`,
      data:  { screen: "Ranking", type: "ranking-down" },
      sound: "default",
    });
  }

  await sendPushNotifications(messages);
}

/**
 * Send a notification to a specific user about their ranking improvement.
 */
export async function notifyRankingUp(
  userId:      string,
  newPosition: number,
): Promise<void> {
  const token = await getUserPushToken(userId);
  if (!token) return;

  await sendPushNotifications([{
    to:    token,
    title: "📊 Você subiu no ranking!",
    body:  `Agora você está em ${newPosition}º lugar na sua turma! Continue assim! 🚀`,
    data:  { screen: "Ranking", type: "ranking-up" },
    sound: "default",
  }]);
}
