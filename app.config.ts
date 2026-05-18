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
      backgroundColor: "#064e3b",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.dreeam.descartecerto",
      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
        backgroundColor: "#064e3b",
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
      supabaseUrl:     process.env.SUPABASE_URL     || "https://yuqexdhsnbzeqkfvclvx.supabase.co",
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1cWV4ZGhzbmJ6ZXFrZnZjbHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDY2MjUsImV4cCI6MjA5MjcyMjYyNX0.MyZczpdTudfT4kEln8x2DmLUmco8d_S99-XZtTJ-WkM",
      apiUrl:          process.env.API_URL           || "https://descarte-certo-production.up.railway.app",
    },
  },
};
