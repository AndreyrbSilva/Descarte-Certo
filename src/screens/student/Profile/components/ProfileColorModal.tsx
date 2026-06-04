import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from "react-native";
import { IconCheck } from "../../../components/icons";
import { useProfileThemeStore, PROFILE_COLOR_OPTIONS } from "../../../store/useProfileThemeStore";
import { useProfileColors } from "../../../theme/useProfileColors";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function ProfileColorModal({ visible, onClose }: Props) {
  const { activeColor, setProfileColor } = useProfileThemeStore();
  const themeColors = useProfileColors();

  const handleSelectColor = (color: string) => {
    setProfileColor(color);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: themeColors.cardBg }]}>
          <Text style={[styles.title, { color: themeColors.textColor }]}>
            Cor do Perfil
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.subTextColor }]}>
            Escolha uma cor para personalizar o cabeçalho e os ícones do seu perfil.
          </Text>

          <View style={styles.grid}>
            {PROFILE_COLOR_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.colorItem, { backgroundColor: option.value }]}
                onPress={() => handleSelectColor(option.value)}
                activeOpacity={0.8}
              >
                {activeColor === option.value && (
                  <IconCheck color="#ffffff" size={24} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.closeBtn, { borderColor: themeColors.dividerColor }]}
            onPress={onClose}
          >
            <Text style={[styles.closeBtnText, { color: themeColors.textColor }]}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  colorItem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  closeBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
  },
  closeBtnText: {
    fontWeight: "700",
    fontSize: 15,
  },
});
