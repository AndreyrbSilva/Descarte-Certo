import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SplashScreen } from "../screens/student/SplashScreen";
import { LoginScreen } from "../screens/student/LoginScreen";
import { RegisterScreen } from "../screens/student/RegisterScreen";
import { RegisterSuccessScreen } from "../screens/student/RegisterSuccessScreen";
import { HomeScreen } from "../screens/student/HomeScreen";
import { ScannerScreen }    from "../screens/student/ScannerScreen";
import { ScanResultScreen } from "../screens/student/ScanResultScreen";
import { ProfileScreen } from "../screens/student/ProfileScreen";

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
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{ 
            animation: "slide_from_right", 
            animationDuration: 250,
            gestureEnabled: false 
          }}
        />
        <Stack.Screen
          name="ScanResult"
          component={ScanResultScreen}
          options={{ 
            animation: "slide_from_right", 
            animationDuration: 250,
            gestureEnabled: false 
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ animation: "fade", animationDuration: 250 }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
