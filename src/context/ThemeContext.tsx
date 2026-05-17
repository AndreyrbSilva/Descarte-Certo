import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { loadThemePreference, saveThemePreference, ThemePreference } from "../theme/storage";

type ThemeContextType = {
  isDark:     boolean;
  preference: ThemePreference;
  setTheme:   (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark:     false,
  preference: "system",
  setTheme:   () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    loadThemePreference().then(setPreference);
  }, []);

  function setTheme(theme: ThemePreference) {
    setPreference(theme);
    setTimeout(() => {
      saveThemePreference(theme).catch(() => {});
    }, 100);
  }

  const isDark =
    preference === "dark" ? true :
    preference === "light" ? false :
    systemScheme === "dark";

  return (
    <ThemeContext.Provider value={{ isDark, preference, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
