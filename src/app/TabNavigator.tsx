import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef, useEffect } from "react";

import { HomeScreen }    from "../screens/student/HomeScreen";
import { RankingScreen } from "../screens/student/RankingScreen";
import { ScannerScreen } from "../screens/student/ScannerScreen";
import { ProfileScreen } from "../screens/student/ProfileScreen";
import { ConfigScreen }  from "../screens/student/ConfigScreen";

import { IconHome, IconRanking, IconUser, IconConfig, IconCamera } from "../components/icons";
import { TabBackground } from "../components/navigation/TabBackground";
import { useTabColors }  from "../hooks/useTabColors";

const Tab   = createBottomTabNavigator();
const GREEN = "#22c55e";
const TAB_H = 64;

function AnimatedIcon({ focused, activeColor, inactiveColor, children }: {
  focused: boolean;
  activeColor: string;
  inactiveColor: string;
  children: (color: string) => React.ReactNode;
}) {
  const anim  = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(focused ? 1.15 : 1)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.spring(scale, {
      toValue: focused ? 1.15 : 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  }, [focused]);

  const color = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {children(color as any)}
    </Animated.View>
  );
}

export function TabNavigator() {
  const colors = useTabColors();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: TAB_H + insets.bottom,
          paddingBottom: insets.bottom,
          position: "absolute",
        },
        tabBarBackground: () => <TabBackground tabBg={colors.tabBg} border={colors.border} />,
        tabBarActiveTintColor:   colors.active,
        tabBarInactiveTintColor: colors.inactive,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700", marginTop: 2 },
        lazy: true,
        animation: "shift",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon focused={focused} activeColor={colors.active} inactiveColor={colors.inactive}>
              {(color) => <IconHome color={color} size={22} />}
            </AnimatedIcon>
          ),
        }}
      />

      <Tab.Screen
        name="Ranking"
        component={RankingScreen}
        options={{
          tabBarLabel: "Ranking",
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon focused={focused} activeColor={colors.active} inactiveColor={colors.inactive}>
              {(color) => <IconRanking color={color} size={22} />}
            </AnimatedIcon>
          ),
        }}
      />

      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{
          tabBarLabel: "",
          tabBarStyle: { display: "none" },
          tabBarIcon: () => (
            <View style={styles.fabWrap}>
              <View style={[styles.fab, { backgroundColor: GREEN }]}>
                <IconCamera color="#fff" size={22} />
              </View>
            </View>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity {...props} activeOpacity={0.85} style={styles.fabBtn} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon focused={focused} activeColor={colors.active} inactiveColor={colors.inactive}>
              {(color) => <IconUser color={color} size={22} />}
            </AnimatedIcon>
          ),
        }}
      />

      <Tab.Screen
        name="Config"
        component={ConfigScreen}
        options={{
          tabBarLabel: "Config",
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon focused={focused} activeColor={colors.active} inactiveColor={colors.inactive}>
              {(color) => <IconConfig color={color} size={22} />}
            </AnimatedIcon>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  fabWrap: {
    alignItems: "center", justifyContent: "center",
    width: 60, height: 60,
    marginBottom: 24,
  },
  fab: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: "center", justifyContent: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
  },
  fabBtn: {
    flex: 1, alignItems: "center", justifyContent: "center",
  },
});
