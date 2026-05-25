import {
  View, Text, TouchableOpacity, Modal,
} from "react-native";
import { useConfigColors } from "../../../../theme/useConfigColors";
import { IconLogout } from "../../../../components/icons";

export function LogoutModal({ visible, onConfirm, onClose }: {
  visible:   boolean;
  onConfirm: () => void;
  onClose:   () => void;
}) {
  const colors = useConfigColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
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
          style={[
            {
              width: "100%",
              borderRadius: 24,
              padding: 24,
              alignItems: "center",
            },
            { backgroundColor: colors.cardBg },
          ]}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#fee2e2",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <IconLogout color="#ef4444" size={28} />
          </View>

          <Text
            style={[
              {
                fontSize: 20,
                fontWeight: "800",
                marginBottom: 8,
              },
              { color: colors.textColor },
            ]}
          >
            Sair da conta?
          </Text>

          <Text
            style={[
              {
                fontSize: 14,
                textAlign: "center",
                marginBottom: 24,
              },
              { color: colors.subTextColor },
            ]}
          >
            Você precisará entrar novamente para acessar o app.
          </Text>

          <TouchableOpacity
            style={{
              width: "100%",
              paddingVertical: 14,
              borderRadius: 14,
              backgroundColor: "#ef4444",
              alignItems: "center",
              marginBottom: 10,
            }}
            onPress={onConfirm}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "800",
                fontSize: 15,
              }}
            >
              Sair
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: "100%",
              paddingVertical: 14,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: colors.dividerColor,
              alignItems: "center",
            }}
            onPress={onClose}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 15,
                color: colors.textColor,
              }}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
