import { View, Text, Modal, TouchableOpacity, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { useAdminColors } from "../../../theme/useAdminColors";
import type { AdminUser } from "../admin.types";
import { styles } from "../adminStyles";

interface ClassDetailModalProps {
  turmaName:    string | null;
  users:        AdminUser[];
  colors:       ReturnType<typeof useAdminColors>;
  onClose:      () => void;
  onSelectUser: (user: AdminUser) => void;
}

export function ClassDetailModal({ turmaName, users, colors, onClose, onSelectUser }: ClassDetailModalProps) {
  const insets = useSafeAreaInsets();
  const classMembers = turmaName
    ? users
        .filter((u) => u.turma?.toUpperCase().trim() === turmaName.toUpperCase().trim())
        .sort((a, b) => (b.points?.total ?? 0) - (a.points?.total ?? 0))
    : [];

  return (
    <Modal visible={turmaName !== null} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <View
          style={[styles.modalCard, { backgroundColor: colors.cardBg, paddingBottom: Math.max((insets.bottom || 0) + 12, 24) }]}
          onStartShouldSetResponder={() => true}
        >
          {/* Header */}
          <View style={styles.modalHeaderCloseRow}>
            <View style={{ flex: 1, paddingRight: 16 }}>
              <Text style={[styles.modalTitle, { color: colors.textColor }]}>
                Alunos da Turma {turmaName}
              </Text>
              <Text style={{ fontSize: 12, color: colors.subTextColor, marginTop: 2 }}>
                Alunos ordenados por pontuação. Toque para ver a Ficha Ecológica.
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeModalBtn}>
              <Text style={{ fontSize: 20, color: colors.subTextColor }}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.dividerColor, marginVertical: 12 }]} />

          <FlatList
            data={classMembers}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item: user, index }) => (
              <TouchableOpacity
                style={styles.groupedUserRow}
                onPress={() => onSelectUser(user)}
                activeOpacity={0.8}
              >
                <View style={[styles.avatarInitialWrapSmall, { backgroundColor: "#22c55e12" }]}>
                  <Text style={styles.userInitialSmall}>{user.name[0].toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.userNameSmall, { color: colors.textColor }]} numberOfLines={1}>
                    {user.name}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.subTextColor, marginTop: 2 }}>
                    Posição: #{index + 1} • {user.scans?.length ?? 0} Scans
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end", marginRight: 8 }}>
                  <Text style={{ fontWeight: "700", color: "#22c55e", fontSize: 14 }}>
                    {user.points?.total ?? 0} pts
                  </Text>
                </View>
                <Text style={[styles.arrowRight, { color: colors.subTextColor }]}>➔</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => (
              <View style={[styles.divider, { backgroundColor: colors.dividerColor, marginVertical: 4 }]} />
            )}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={[styles.emptyText, { color: colors.subTextColor }]}>
                  Nenhum aluno registrado nesta turma.
                </Text>
              </View>
            }
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
