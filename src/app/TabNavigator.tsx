import { View, TouchableOpacity, StyleSheet, Animated, Text } from "react-native";
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef, useEffect } from "react";

import { HomeScreen }    from "../screens/student/HomeScreen";
import { RankingScreen } from "../screens/student/RankingScreen";
import { ScannerScreen } from "../screens/student/ScannerScreen";
import { ProfileScreen } from "../screens/student/ProfileScreen";
import { ConfigScreen }  from "../screens/student/ConfigScreen";

import { IconHome, IconRanking, IconUser, IconConfig, IconCamera } from "../components/icons";
import { TabBackground } from "../components/navigation/TabBackground";
import { useTabColors, useAnimatedTabColors } from "../hooks/useTabColors";

const Tab   = createMaterialTopTabNavigator();
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

function CustomTabBar({ state, descriptors, navigation, position, colors, aColors, insets }: MaterialTopTabBarProps & { colors: any, aColors: any, insets: any }) {
  const translateY = position.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [0, 0, 150, 0, 0], // Hide when position is 2 (Scanner)
  });

  return (
    <Animated.View style={{ 
      position: "absolute", bottom: 0, left: 0, right: 0, 
      height: TAB_H + insets.bottom, paddingBottom: insets.bottom,
      transform: [{ translateY }],
      zIndex: 999, elevation: 999, // Ensure tab bar stays above pager screens
    }}>
      <TabBackground tabBg={aColors.tabBg} border={aColors.border} />
      <View style={{ flex: 1, flexDirection: "row" }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (route.name === "Scanner") {
            return (
              <TouchableOpacity key={route.key} activeOpacity={0.85} style={styles.fabBtn} onPress={onPress}>
                <View style={styles.fabWrap}>
                  <View style={[styles.fab, { backgroundColor: GREEN }]}>
                    <IconCamera color="#fff" size={26} style={{ marginTop: -6 }} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }

          const Icon = options.tabBarIcon;
          const label = options.tabBarLabel as string;

          return (
            <TouchableOpacity key={route.key} activeOpacity={1} style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={onPress}>
              {Icon && Icon({ focused: isFocused, color: "transparent" })}
              <Text style={{ fontSize: 10, fontWeight: "700", marginTop: 2, color: isFocused ? colors.active : colors.inactive }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}

export function TabNavigator() {
  const colors  = useTabColors();
  const aColors = useAnimatedTabColors();
  const insets  = useSafeAreaInsets();

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      tabBar={(props) => <CustomTabBar {...props} colors={colors} aColors={aColors} insets={insets} />}
      screenOptions={{
        swipeEnabled: true,
        lazy: true,
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
