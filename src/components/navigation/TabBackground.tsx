import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const TAB_H = 64;

export function TabBackground({ tabBg, border }: { tabBg: string; border: string }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height={TAB_H + 30} viewBox="0 0 390 94" preserveAspectRatio="none">
        <Path
          d={`M0,0 L140,0 Q160,0 168,12 Q175,26 195,26 Q215,26 222,12 Q230,0 250,0 L390,0 L390,94 L0,94 Z`}
          fill={tabBg}
        />
        <Path
          d={`M0,0 L140,0 Q160,0 168,12 Q175,26 195,26 Q215,26 222,12 Q230,0 250,0 L390,0`}
          fill="none"
          stroke={border}
          strokeWidth="1"
        />
      </Svg>
    </View>
  );
}
