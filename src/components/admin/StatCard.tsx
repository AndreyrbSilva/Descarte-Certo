import { View, Text, Animated } from "react-native";
import type { useAdminColors } from "../../theme/useAdminColors";
import { styles } from "../../screens/admin/adminStyles";

interface StatCardProps {
  icon:        React.ReactNode;
  label:       string;
  value:       string | number;
  accent:      string;
  colors:      ReturnType<typeof useAdminColors>;
  animOpacity: Animated.Value;
  animY:       Animated.Value;
}

export function StatCard({ icon, label, value, accent, colors, animOpacity, animY }: StatCardProps) {
  return (
    <Animated.View style={{ opacity: animOpacity, transform: [{ translateY: animY }], flex: 1 }}>
      <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
        <View style={styles.statHeaderRow}>
          <View style={[styles.iconWrap, { backgroundColor: accent + "15" }]}>
            {icon}
          </View>
          <Text style={[styles.statValue, { color: colors.textColor }]} numberOfLines={1}>
            {value}
          </Text>
        </View>
        <Text style={[styles.statLabel, { color: colors.subTextColor }]}>{label}</Text>
      </View>
    </Animated.View>
  );
}
