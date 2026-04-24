import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SplashScreen } from "../screens/student/SplashScreen";
import { LoginScreen } from "../screens/student/LoginScreen";
import { RegisterScreen } from "../screens/student/RegisterScreen";
import { RegisterSuccessScreen } from "../screens/student/RegisterSuccessScreen";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}