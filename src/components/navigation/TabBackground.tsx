import { Animated, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const TAB_H = 64;

export function TabBackground({ tabBg, border }: { tabBg: any; border: any }) {
  return (
    <Animated.View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 390 94" preserveAspectRatio="none">
        <AnimatedPath
          d={`M0,0 L140,0 Q160,0 168,12 Q175,26 195,26 Q215,26 222,12 Q230,0 250,0 L390,0 L390,94 L0,94 Z`}
          fill={tabBg}
        />
        <AnimatedPath
          d={`M0,0 L140,0 Q160,0 168,12 Q175,26 195,26 Q215,26 222,12 Q230,0 250,0 L390,0`}
          fill="none"
          stroke={border}
          strokeWidth="1"
        />
      </Svg>
    </Animated.View>
  );
}
