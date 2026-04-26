import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SplashScreen } from "../screens/student/SplashScreen";
import { LoginScreen } from "../screens/student/LoginScreen";
import { RegisterScreen } from "../screens/student/RegisterScreen";
import { RegisterSuccessScreen } from "../screens/student/RegisterSuccessScreen";
import { HomeScreen } from "../screens/student/HomeScreen";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash"           component={SplashScreen} />
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
          name="Home"
          component={HomeScreen} 
          options={{ animation: "fade" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}