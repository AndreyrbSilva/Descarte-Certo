import { View, TouchableOpacity, Animated } from "react-native";
import { useAnimatedConfigColors } from "../../../../theme/useConfigColors";
import { styles } from "../configStyles";

export function ConfigItem({ icon, label, sub, onPress, danger, aColors }: {
  icon:   React.ReactNode;
  label:  string;
  sub?:   string;
  onPress: () => void;
  danger?: boolean;
  aColors: ReturnType<typeof useAnimatedConfigColors>;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <Animated.View style={[styles.itemIconWrap, { backgroundColor: aColors.iconBg }]}>
        {icon}
      </Animated.View>
      <View style={styles.itemText}>
        <Animated.Text style={[styles.itemLabel, { color: danger ? aColors.dangerColor : aColors.textColor }]}>
          {label}
        </Animated.Text>
        {sub && <Animated.Text style={[styles.itemSub, { color: aColors.subTextColor }]}>{sub}</Animated.Text>}
      </View>
      <Animated.Text style={[styles.chevron, { color: aColors.subTextColor }]}>›</Animated.Text>
    </TouchableOpacity>
  );
}
