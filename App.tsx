import "./src/globals.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider } from "./src/context/ThemeContext";
import { AppNavigator } from "./src/navigation/index";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
