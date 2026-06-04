import { useEffect, useRef } from "react";
import "./src/globals.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import type { EventSubscription } from "expo-modules-core";

import { ThemeProvider } from "./src/context/ThemeContext";
import { AppNavigator }  from "./src/navigation/index";
import {
  setupNotificationChannel,
  registerForPushNotifications,
  registerPushTokenOnBackend,
  setForegroundHandler,
} from "./src/services/notificationService";
import { useNotificationStore } from "./src/store/useNotificationStore";

// Configure foreground notification display (must be called outside component)
setForegroundHandler();

export default function App() {
  const notificationResponseListener = useRef<EventSubscription | null>(null);

  useEffect(() => {
    // Hydrate notification preferences from SecureStore
    useNotificationStore.getState().hydrate();

    // Set up Android notification channel
    setupNotificationChannel();

    // Register for push notifications and save token
    registerForPushNotifications().then((token) => {
      if (token) {
        useNotificationStore.getState().setExpoPushToken(token);
        // Also register on backend for remote push notifications
        registerPushTokenOnBackend(token);
      }
    });

    // Listen for notification taps (response)
    notificationResponseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        // Navigation will be handled by the NavigationContainer ref in a future enhancement
        // For now we just log the tap — the notification itself already brings the user back to the app
        console.log("[Notifications] User tapped notification:", data);
      });

    return () => {
      if (notificationResponseListener.current) {
        notificationResponseListener.current.remove();
      }
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
