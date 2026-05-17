import "dotenv/config";

export default {
  expo: {
    name: "DescarteCerto",
    slug: "descarte-certo",
    version: "1.0.0",
    orientation: "portrait",
    updates: {
      fallbackToCacheTimeout: 0,
    },
    icon: "./assets/logo.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.dreeam.descartecerto",
      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: false,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: "./assets/logo.png",
    },
    plugins: [
      "expo-secure-store",
      [
        "expo-camera",
        {
          cameraPermission: "O DescarteCerto precisa acessar sua câmera para escanear itens recicláveis.",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "O DescarteCerto precisa acessar suas fotos para enviar imagens.",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "01ef7e17-a591-4817-a69e-70b751d89b4f",
      },
      supabaseUrl:     process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      apiUrl:          process.env.API_URL,
    },
  },
};
