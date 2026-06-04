import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

import type { NotificationContent, NotificationType } from "../types/notifications";

// ── Channel setup (Android) ──────────────────────────────
export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "DescarteCerto",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#064e3b",
      sound: "default",
    });
  }
}

// ── Permission & push token ──────────────────────────────
export async function registerForPushNotifications(): Promise<string | null> {
  // Push notifications only work on physical devices
  if (!Device.isDevice) {
    console.warn("[Notifications] Push notifications require a physical device.");
    return null;
  }

  // Check existing permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request if not granted
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("[Notifications] Permission not granted.");
    return null;
  }

  // Get Expo push token
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: "01ef7e17-a591-4817-a69e-70b751d89b4f",
  });

  return tokenData.data;
}

// ── Notification handler config ──────────────────────────
/** Configure how notifications are handled when the app is in the foreground */
export function setForegroundHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// ── Schedule a local notification ────────────────────────
interface ScheduleOptions {
  type:    NotificationType;
  content: NotificationContent;
  trigger: Notifications.NotificationTriggerInput;
}

export async function scheduleNotification({
  type,
  content,
  trigger,
}: ScheduleOptions): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: content.title,
      body:  content.body,
      data:  { ...content.data, type },
      sound: "default",
    },
    trigger,
  });
}

// ── Cancel helpers ───────────────────────────────────────
export async function cancelNotification(identifier: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getScheduledNotifications() {
  return Notifications.getAllScheduledNotificationsAsync();
}

// ── Utility: build daily trigger ─────────────────────────
/** Creates a daily trigger for a specific hour/minute (repeating) */
export function dailyTrigger(hour: number, minute: number): Notifications.NotificationTriggerInput {
  return {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour,
    minute,
  };
}

/** Creates a one-time trigger after N seconds */
export function secondsTrigger(seconds: number): Notifications.NotificationTriggerInput {
  return {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds,
    repeats: false,
  };
}
