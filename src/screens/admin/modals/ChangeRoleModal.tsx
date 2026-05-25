import { View, Text, Modal, TouchableOpacity } from "react-native";
import type { useAdminColors } from "../../../theme/useAdminColors";
import type { AdminUser, Role } from "../admin.types";
import { ROLE_LABELS, ROLES } from "../admin.types";
import { styles } from "../adminStyles";

interface ChangeRoleModalProps {
  user:         AdminUser | null;
  colors:       ReturnType<typeof useAdminColors>;
  onClose:      () => void;
  onChangeRole: (user: AdminUser, newRole: Role) => void;
}

export function ChangeRoleModal({ user, colors, onClose, onChangeRole }: ChangeRoleModalProps) {
  return (
    <Modal visible={!!user} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <View
          style={[styles.modalCard, { backgroundColor: colors.cardBg }]}
          onStartShouldSetResponder={() => true}
        >
          <Text style={[styles.modalTitle, { color: colors.textColor }]}>Alterar Cargo</Text>
          <Text style={[styles.modalSub,   { color: colors.subTextColor }]}>{user?.name}</Text>
          <View style={[styles.divider, { backgroundColor: colors.dividerColor, marginVertical: 16 }]} />

          {ROLES.map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleOption,
                {
                  backgroundColor: user?.role === role ? "#22c55e15" : "transparent",
                  borderColor:     user?.role === role ? "#22c55e"   : colors.dividerColor,
                },
              ]}
              onPress={() => user && onChangeRole(user, role)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.roleOptionText,
                {
                  color:      user?.role === role ? "#22c55e" : colors.textColor,
                  fontWeight: user?.role === role ? "800"     : "600",
                },
              ]}>
                {ROLE_LABELS[role]}
              </Text>
              {user?.role === role && (
                <Text style={{ color: "#22c55e", fontSize: 16, fontWeight: "800" }}>✓</Text>
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.modalCancel} onPress={onClose} activeOpacity={0.8}>
            <Text style={[styles.modalCancelText, { color: colors.subTextColor }]}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
