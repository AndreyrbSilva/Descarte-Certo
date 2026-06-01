import { View, Text } from "react-native";
import type { useAdminColors } from "../../theme/useAdminColors";
import { ROLE_LABELS } from "../../screens/admin/admin.types";
import type { Role } from "../../screens/admin/admin.types";
import { styles } from "../../screens/admin/adminStyles";

interface RoleBadgeProps {
  role:   Role;
  colors: ReturnType<typeof useAdminColors> | any;
}

export function RoleBadge({ role, colors }: RoleBadgeProps) {
  const map = {
    STUDENT: colors.badgeStudent,
    TEACHER: colors.badgeTeacher,
    ADMIN:   colors.badgeAdmin,
  };
  const badge = map[role];

  return (
    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
      <Text style={[styles.badgeText, { color: badge.text }]}>
        {ROLE_LABELS[role]}
      </Text>
    </View>
  );
}
