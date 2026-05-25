import { View, Text, Modal, TouchableOpacity, ScrollView, FlatList } from "react-native";
import type { useAdminColors } from "../../../theme/useAdminColors";
import type { AdminUser } from "../admin.types";
import { RoleBadge } from "../../../components/admin/RoleBadge";
import { styles } from "../adminStyles";

interface UserDetailModalProps {
  user:         AdminUser | null;
  colors:       ReturnType<typeof useAdminColors>;
  onClose:      () => void;
  onChangeRole: (user: AdminUser) => void;
  onDeleteUser: (user: AdminUser) => void;
}

export function UserDetailModal({ user, colors, onClose, onChangeRole, onDeleteUser }: UserDetailModalProps) {
  if (!user) return null;

  const totalUserScans  = user.scans?.length ?? 0;
  const totalUserPoints = user.points?.total ?? 0;
  const userScansList   = user.scans ?? [];

  const plasticoCount = userScansList.filter((s) => {
    const cat = s.category.toLowerCase();
    return cat === "plastico" || cat === "plástico";
  }).length;
  const papelCount = userScansList.filter((s) => s.category.toLowerCase() === "papel").length;
  const metalCount = userScansList.filter((s) => s.category.toLowerCase() === "metal").length;
  const vidroCount = userScansList.filter((s) => s.category.toLowerCase() === "vidro").length;

  const pct = (n: number) =>
    totalUserScans > 0 ? `${((n / totalUserScans) * 100).toFixed(0)}%` : "0%";

  const resíduosArray = [
    { label: "Plástico", count: plasticoCount, color: "#ef4444", pct: pct(plasticoCount) },
    { label: "Papel",    count: papelCount,    color: "#3b82f6", pct: pct(papelCount)    },
    { label: "Metal",    count: metalCount,    color: "#eab308", pct: pct(metalCount)    },
    { label: "Vidro",    count: vidroCount,    color: "#22c55e", pct: pct(vidroCount)    },
  ];

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <View
          style={[styles.modalCard, { backgroundColor: colors.cardBg }]}
          onStartShouldSetResponder={() => true}
        >
          {/* Header */}
          <View style={styles.modalHeaderCloseRow}>
            <Text style={[styles.modalTitle, { color: colors.textColor }]}>Ficha Ecológica</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeModalBtn}>
              <Text style={{ fontSize: 20, color: colors.subTextColor }}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.dividerColor, marginVertical: 12 }]} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Avatar + nome */}
            <View style={styles.fichaHeader}>
              <View style={[styles.fichaAvatar, { backgroundColor: "#22c55e15" }]}>
                <Text style={styles.fichaAvatarText}>{user.name[0].toUpperCase()}</Text>
              </View>
              <Text style={[styles.fichaName,  { color: colors.textColor }]}>{user.name}</Text>
              <Text style={[styles.fichaEmail, { color: colors.subTextColor }]}>{user.email}</Text>
              <View style={{ marginTop: 8 }}>
                <RoleBadge role={user.role} colors={colors} />
              </View>
            </View>

            {/* Dados técnicos */}
            <View style={styles.fichaStatsRow}>
              {[
                { value: user.turma || "N/A", label: "Turma",  color: colors.textColor },
                { value: totalUserScans,       label: "Scans",  color: "#22c55e"        },
                { value: totalUserPoints,      label: "Pontos", color: "#3b82f6"        },
              ].map(({ value, label, color }) => (
                <View key={label} style={[styles.fichaStatItem, { backgroundColor: colors.bg }]}>
                  <Text style={[styles.fichaStatNum,   { color }]}>{value}</Text>
                  <Text style={[styles.fichaStatLabel, { color: colors.subTextColor }]}>{label}</Text>
                </View>
              ))}
            </View>

            {/* Distribuição de resíduos (apenas alunos) */}
            {user.role === "STUDENT" && (
              <View style={{ marginTop: 16 }}>
                <Text style={[styles.fichaSectionLabel, { color: colors.textColor }]}>
                  Materiais Coletados
                </Text>
                <View style={styles.residuosGrid}>
                  {resíduosArray.map((item) => (
                    <View key={item.label} style={{ marginVertical: 4 }}>
                      <View style={styles.residuoTextRow}>
                        <Text style={[styles.residuoLabel, { color: colors.textColor }]}>
                          {item.label} ({item.count})
                        </Text>
                        <Text style={[styles.residuoPct, { color: colors.subTextColor }]}>
                          {item.pct}
                        </Text>
                      </View>
                      <View style={[styles.progressTrack, { backgroundColor: colors.dividerColor }]}>
                        <View style={[styles.progressBar, { width: item.pct, backgroundColor: item.color }]} />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Ações */}
            <View style={styles.fichaActionsContainer}>
              <TouchableOpacity
                style={[styles.fichaBtn, { backgroundColor: "#3b82f615", borderColor: "#3b82f6" }]}
                onPress={() => onChangeRole(user)}
                activeOpacity={0.8}
              >
                <Text style={{ color: "#3b82f6", fontWeight: "700", fontSize: 13 }}>Alterar Cargo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.fichaBtn, { backgroundColor: "#ef444415", borderColor: "#ef4444" }]}
                onPress={() => onDeleteUser(user)}
                activeOpacity={0.8}
              >
                <Text style={{ color: "#ef4444", fontWeight: "700", fontSize: 13 }}>Remover Conta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
