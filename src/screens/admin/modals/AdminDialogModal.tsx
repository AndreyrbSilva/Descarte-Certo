import { View, Text, TouchableOpacity, Modal } from "react-native";
import type { useAdminColors } from "../../../theme/useAdminColors";
import { IconLogout, IconCheck, IconSecureLock, IconMailEdit, IconShieldCheck } from "../../../components/icons";

export type AdminDialogType = "info" | "warning" | "error" | "success" | "logout";

export interface AdminDialogState {
  visible: boolean;
  type: AdminDialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function AdminDialogModal({
  dialog,
  colors,
  onClose,
}: {
  dialog: AdminDialogState | null;
  colors: ReturnType<typeof useAdminColors>;
  onClose: () => void;
}) {
  if (!dialog || !dialog.visible) return null;

  let IconComponent = IconShieldCheck;
  let iconColor = "#3b82f6";
  let iconBg = "#eff6ff";
  let confirmColor = "#3b82f6";

  if (dialog.type === "success") {
    IconComponent = IconCheck;
    iconColor = "#22c55e";
    iconBg = "#dcfce7";
    confirmColor = "#22c55e";
  } else if (dialog.type === "error") {
    IconComponent = IconSecureLock;
    iconColor = "#ef4444";
    iconBg = "#fee2e2";
    confirmColor = "#ef4444";
  } else if (dialog.type === "warning") {
    IconComponent = IconMailEdit;
    iconColor = "#eab308";
    iconBg = "#fef9c3";
    confirmColor = "#eab308";
  } else if (dialog.type === "logout") {
    IconComponent = IconLogout;
    iconColor = "#ef4444";
    iconBg = "#fee2e2";
    confirmColor = "#ef4444";
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={dialog.onCancel || onClose} statusBarTranslucent navigationBarTranslucent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <View
          style={{
            width: "100%",
            borderRadius: 24,
            padding: 24,
            alignItems: "center",
            backgroundColor: colors.cardBg,
            elevation: 10,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: iconBg,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <IconComponent color={iconColor} size={28} />
          </View>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              marginBottom: 8,
              color: colors.textColor,
              textAlign: "center",
            }}
          >
            {dialog.title}
          </Text>

          <Text
            style={{
              fontSize: 14,
              textAlign: "center",
              marginBottom: 24,
              color: colors.subTextColor,
            }}
          >
            {dialog.message}
          </Text>

          <TouchableOpacity
            style={{
              width: "100%",
              paddingVertical: 14,
              borderRadius: 14,
              backgroundColor: confirmColor,
              alignItems: "center",
              marginBottom: dialog.onCancel ? 10 : 0,
            }}
            onPress={() => {
              dialog.onConfirm();
              onClose();
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
              {dialog.confirmText || "OK"}
            </Text>
          </TouchableOpacity>

          {dialog.onCancel && (
            <TouchableOpacity
              style={{
                width: "100%",
                paddingVertical: 14,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: colors.dividerColor,
                alignItems: "center",
              }}
              onPress={() => {
                if (dialog.onCancel) dialog.onCancel();
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Text style={{ fontWeight: "700", fontSize: 15, color: colors.textColor }}>
                {dialog.cancelText || "Cancelar"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}
