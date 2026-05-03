import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useColorScheme } from "react-native";

import { SplashScreen }         from "../screens/student/SplashScreen";
import { LoginScreen }          from "../screens/student/LoginScreen";
import { RegisterScreen }       from "../screens/student/RegisterScreen";
import { RegisterSuccessScreen } from "../screens/student/RegisterSuccessScreen";
import { HomeScreen }           from "../screens/student/HomeScreen";
import { ScannerScreen }        from "../screens/student/ScannerScreen";
import { ScanResultScreen }     from "../screens/student/ScanResultScreen";
import { ProfileScreen }        from "../screens/student/ProfileScreen";
import { RankingScreen }        from "../screens/student/RankingScreen";
import { ConfigScreen }         from "../screens/student/ConfigScreen";

import { IconHome, IconRanking, IconUser, IconConfig, IconCamera } from "../components/icons";

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const GREEN = "#22c55e";

function TabNavigator() {
  const dark   = useColorScheme() === "dark";
  const tabBg  = dark ? "#0f172a" : "#ffffff";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const active = GREEN;
  const inactive = dark ? "#475569" : "#94a3b8";

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBg,
          borderTopColor: border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor:   active,
        tabBarInactiveTintColor: inactive,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ color }) => <IconHome color={color} size={22} />,
        }}
      />

      <Tab.Screen
        name="Ranking"
        component={RankingScreen}
        options={{
          tabBarLabel: "Ranking",
          tabBarIcon: ({ color }) => <IconRanking color={color} size={22} />,
        }}
      />

      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: () => (
            <View style={styles.fabWrap}>
              <View style={[styles.fab, { backgroundColor: GREEN }]}>
                <IconCamera color="#fff" size={22} />
              </View>
            </View>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              activeOpacity={0.85}
              style={styles.fabBtn}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color }) => <IconUser color={color} size={22} />,
        }}
      />

      <Tab.Screen
        name="Config"
        component={ConfigScreen}
        options={{
          tabBarLabel: "Config",
          tabBarIcon: ({ color }) => <IconConfig color={color} size={22} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash"          component={SplashScreen} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ animation: "fade" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="RegisterSuccess"
          component={RegisterSuccessScreen}
          options={{ animation: "fade" }}
        />
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ animation: "fade" }}
        />
        <Stack.Screen
          name="ScanResult"
          component={ScanResultScreen}
          options={{
            animation: "slide_from_right",
            animationDuration: 250,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  fabWrap: {
    alignItems: "center", justifyContent: "center",
    width: 60, height: 60,
    marginBottom: 20,
  },
  fab: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: "center", justifyContent: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },
  fabBtn: {
    flex: 1, alignItems: "center", justifyContent: "center",
  },
});