import { View, Text, Modal, ActivityIndicator, Animated } from "react-native";
import type { useAdminColors } from "../../../theme/useAdminColors";
import { styles } from "../adminStyles";

interface ExportProgressModalProps {
  visible:        boolean;
  exportProgress: number;
  exportStepText: string;
  colors:         ReturnType<typeof useAdminColors>;
}

export function ExportProgressModal({
  visible, exportProgress, exportStepText, colors,
}: ExportProgressModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.exportBackdrop}>
        <View style={[styles.exportCard, { backgroundColor: colors.cardBg }]}>
          <ActivityIndicator size="large" color="#3b82f6" />

          <Text style={[styles.exportTitle, { color: colors.textColor, marginTop: 16 }]}>
            Exportando Relatório
          </Text>
          <Text style={[styles.exportStepText, { color: colors.subTextColor }]}>
            {exportStepText}
          </Text>

          <View style={[styles.exportProgressTrack, { backgroundColor: colors.bg, marginTop: 18 }]}>
            <View style={[styles.exportProgressBar, { width: `${exportProgress}%`, backgroundColor: "#3b82f6" }]} />
          </View>
          <Text style={[styles.exportProgressText, { color: "#3b82f6", fontWeight: "800", marginTop: 6 }]}>
            {exportProgress}%
          </Text>
        </View>
      </View>
    </Modal>
  );
}
