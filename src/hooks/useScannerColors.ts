import { useColorScheme } from "react-native";

export function useScannerColors() {
  const dark = useColorScheme() === "dark";
  return {
    overlayBg:    "rgba(0,0,0,0.6)",
    btnBg:        dark ? "#ffffff20" : "#ffffff25",
    btnBorder:    dark ? "#ffffff30" : "#ffffff40",
    textColor:    "#ffffff",
    subTextColor: "rgba(255,255,255,0.7)",
    frameColor:   "#22c55e",
  };
}
