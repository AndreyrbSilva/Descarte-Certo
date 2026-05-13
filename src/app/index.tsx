import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SplashScreen }          from "../screens/student/SplashScreen";
import { LoginScreen }           from "../screens/student/LoginScreen";
import { RegisterScreen }        from "../screens/student/RegisterScreen";
import { RegisterSuccessScreen } from "../screens/student/RegisterSuccessScreen";
import { ScanResultScreen }      from "../screens/student/ScanResultScreen";
import { PublicProfileScreen }   from "../screens/student/PublicProfileScreen";
import { TrophyScreen }          from "../screens/student/TrophyScreen";
import { TabNavigator }          from "./TabNavigator";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash"         component={SplashScreen} />
        <Stack.Screen name="Login"          component={LoginScreen}           options={{ animation: "fade" }} />
        <Stack.Screen name="Register"       component={RegisterScreen}        options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} options={{ animation: "fade" }} />
        <Stack.Screen name="Tabs"           component={TabNavigator}          options={{ animation: "fade" }} />
        <Stack.Screen name="ScanResult"     component={ScanResultScreen}      options={{ animation: "slide_from_right", animationDuration: 250, gestureEnabled: false }} />
        <Stack.Screen name="PublicProfile" component={PublicProfileScreen} options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="Trophies"      component={TrophyScreen}         options={{ animation: "slide_from_right" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
