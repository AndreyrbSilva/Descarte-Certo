import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { View, Text, Animated, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useSplashAnimations } from "../../hooks/useSplashAnimations";
import { useSplashColors }     from "../../theme/useSplashColors";
import { styles }              from "./splashStyles";
import * as SecureStore from "expo-secure-store";
import { useAuthStore }  from "../../store/useAuthStore";

export function SplashScreen() {
  const navigation = useNavigation<any>();
  const colors     = useSplashColors();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(colors.bgColor);
    NavigationBar.setButtonStyleAsync("dark");
  }, []);

  const setAuth = useAuthStore((s) => s.setAuth);

  async function checkSession() {
    const token      = await SecureStore.getItemAsync("token");
    const userRaw    = await SecureStore.getItemAsync("user");
    const rememberMe = await SecureStore.getItemAsync("rememberMe");

    if (token && userRaw && rememberMe === "true") {
      const user = JSON.parse(userRaw);
      useAuthStore.getState().setAuth(user, token);
      navigation.replace("Tabs");
    } else {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      navigation.replace("Login");
    }
  }

  const anim = useSplashAnimations(() => checkSession());

  return (
    <Animated.View style={[styles.root, { backgroundColor: colors.bgColor, opacity: anim.screenOpacity }]}>

      <Animated.View style={[styles.background, { backgroundColor: colors.bgColor, opacity: anim.bgOpacity }]} />

      <Animated.View style={[styles.ripple, { opacity: anim.rippleOpacity, transform: [{ scale: anim.rippleScale }] }]} />

      <Animated.View style={[styles.ball, { opacity: anim.ballOpacity, backgroundColor: colors.ballColor, shadowColor: colors.ballColor }]}>
        <Animated.View style={[styles.logoContainer, { opacity: anim.logoOpacity, transform: [{ scale: anim.logoScale }] }]}>
          <Image source={require("../../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
        </Animated.View>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[styles.explosion, { backgroundColor: colors.explosionColor, opacity: anim.explosionOpacity, transform: [{ scale: anim.explosionScale }] }]}
      />

      <Animated.View style={[styles.textBlock, { opacity: anim.textOpacity, transform: [{ translateY: anim.textY }] }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.titleGreen, { color: colors.titleGreenColor }]}>Descarte</Text>
          <Text style={[styles.titleDark,  { color: colors.titleDarkColor  }]}> Certo</Text>
        </View>
      </Animated.View>

      <Animated.Text style={[styles.tagline, { color: colors.taglineColor, opacity: anim.taglineOpacity, transform: [{ translateY: anim.taglineY }] }]}>
        RECICLE • PONTUE • TRANSFORME
      </Animated.Text>

    </Animated.View>
  );
}
