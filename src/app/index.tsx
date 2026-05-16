import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from "@react-navigation/stack";

import { useTheme } from "../context/ThemeContext";
import { SplashScreen }          from "../screens/student/Splash/SplashScreen";
import { LoginScreen }           from "../screens/student/Login/LoginScreen";
import { RegisterScreen }        from "../screens/student/Register/RegisterScreen";
import { RegisterSuccessScreen } from "../screens/student/RegisterSuccess/RegisterSuccessScreen";
import { ForgotPasswordScreen }  from "../screens/student/ForgotPassword/ForgotPasswordScreen";
import { ScanResultScreen }      from "../screens/student/ScanResult/ScanResultScreen";
import { PublicProfileScreen }   from "../screens/student/PublicProfile/PublicProfileScreen";
import { TrophyScreen }          from "../screens/student/Trophy/TrophyScreen";
import { TabNavigator }          from "./TabNavigator";

const Stack = createStackNavigator();

export function AppNavigator() {
  const { isDark } = useTheme();
  const themeBg = isDark ? "#0f172a" : "#f8fafc";

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: themeBg },
        detachPreviousScreen: false,
      }}>
        <Stack.Screen name="Splash"          component={SplashScreen} />
        <Stack.Screen name="Login"           component={LoginScreen}           options={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }} />
        <Stack.Screen name="Register"        component={RegisterScreen}        options={{ cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS }} />
        <Stack.Screen name="ForgotPassword"  component={ForgotPasswordScreen}  options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
        <Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} options={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }} />
        <Stack.Screen name="Tabs"            component={TabNavigator}          options={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }} />
        <Stack.Screen name="ScanResult"      component={ScanResultScreen}      options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, gestureEnabled: false }} />
        <Stack.Screen name="PublicProfile"   component={PublicProfileScreen}   options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
        <Stack.Screen name="Trophies"        component={TrophyScreen}          options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
