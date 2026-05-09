import "./src/lib/globals.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider } from "./src/context/ThemeContext";
import { AppNavigator } from "./src/app/index";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
