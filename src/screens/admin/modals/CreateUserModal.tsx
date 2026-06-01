import {
  View, Text, Modal, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { useAdminColors } from "../../../theme/useAdminColors";
import type { Role } from "../admin.types";
import { ROLE_LABELS, ROLES } from "../admin.types";
import { styles } from "../adminStyles";

interface CreateUserModalProps {
  visible:         boolean;
  colors:          ReturnType<typeof useAdminColors>;
  onClose:         () => void;
  newUserName:     string; setNewUserName:     (v: string) => void;
  newUserEmail:    string; setNewUserEmail:    (v: string) => void;
  newUserMatricula:string; setNewUserMatricula:(v: string) => void;
  newUserPassword: string; setNewUserPassword: (v: string) => void;
  newUserTurma:    string; setNewUserTurma:    (v: string) => void;
  newUserRole:     Role;   setNewUserRole:     (r: Role)   => void;
  isCreatingUser:  boolean;
  onSubmit:        () => void;
}

export function CreateUserModal({
  visible, colors, onClose,
  newUserName, setNewUserName,
  newUserEmail, setNewUserEmail,
  newUserMatricula, setNewUserMatricula,
  newUserPassword, setNewUserPassword,
  newUserTurma, setNewUserTurma,
  newUserRole, setNewUserRole,
  isCreatingUser, onSubmit,
}: CreateUserModalProps) {
  const inputStyle = {
    backgroundColor: colors.inputBg,
    borderColor:     colors.inputBorder,
    color:           colors.textColor,
  };
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => !isCreatingUser && onClose()}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={() => !isCreatingUser && onClose()}
      >
        <View
          style={[styles.modalCard, { backgroundColor: colors.cardBg, paddingBottom: Math.max((insets.bottom || 0) + 12, 24) }]}
          onStartShouldSetResponder={() => true}
        >
          {/* Header */}
          <View style={styles.modalHeaderCloseRow}>
            <Text style={[styles.modalTitle, { color: colors.textColor }]}>Novo Cadastro Rápido</Text>
            <TouchableOpacity
              onPress={() => !isCreatingUser && onClose()}
              style={styles.closeModalBtn}
              disabled={isCreatingUser}
            >
              <Text style={{ fontSize: 20, color: colors.subTextColor }}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.dividerColor, marginVertical: 12 }]} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            {/* Nome */}
            <Text style={[styles.inputLabel, { color: colors.subTextColor }]}>NOME COMPLETO</Text>
            <TextInput
              style={[styles.modalInput, inputStyle]}
              placeholder="ex: João Silva"
              placeholderTextColor={colors.subTextColor}
              value={newUserName}
              onChangeText={setNewUserName}
              editable={!isCreatingUser}
            />

            {/* E-mail */}
            <Text style={[styles.inputLabel, { color: colors.subTextColor }]}>E-MAIL</Text>
            <TextInput
              style={[styles.modalInput, inputStyle]}
              placeholder="ex: joao@escola.com"
              placeholderTextColor={colors.subTextColor}
              value={newUserEmail}
              onChangeText={setNewUserEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isCreatingUser}
            />

            {/* Matrícula + Turma */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: colors.subTextColor }]}>MATRÍCULA (MÍN. 6 DÍG)</Text>
                <TextInput
                  style={[styles.modalInput, inputStyle]}
                  placeholder="ex: 202611"
                  placeholderTextColor={colors.subTextColor}
                  value={newUserMatricula}
                  onChangeText={setNewUserMatricula}
                  keyboardType="numeric"
                  editable={!isCreatingUser}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: colors.subTextColor }]}>TURMA (EX: 3B)</Text>
                <TextInput
                  style={[styles.modalInput, inputStyle]}
                  placeholder="ex: 3B"
                  placeholderTextColor={colors.subTextColor}
                  value={newUserTurma}
                  onChangeText={setNewUserTurma}
                  autoCapitalize="characters"
                  editable={!isCreatingUser}
                />
              </View>
            </View>

            {/* Senha */}
            <Text style={[styles.inputLabel, { color: colors.subTextColor }]}>SENHA INICIAL</Text>
            <TextInput
              style={[styles.modalInput, inputStyle]}
              placeholder="Senha inicial forte"
              placeholderTextColor={colors.subTextColor}
              value={newUserPassword}
              onChangeText={setNewUserPassword}
              autoCapitalize="none"
              editable={!isCreatingUser}
            />

            {/* Cargo */}
            <Text style={[styles.inputLabel, { color: colors.subTextColor, marginBottom: 8 }]}>CARGO</Text>
            <View style={styles.roleSelectorRow}>
              {ROLES.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleSelectChip,
                    {
                      backgroundColor: newUserRole === role ? "#22c55e" : colors.bg,
                      borderColor:     newUserRole === role ? "#22c55e" : colors.dividerColor,
                    },
                  ]}
                  onPress={() => setNewUserRole(role)}
                  disabled={isCreatingUser}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.roleSelectChipText,
                    { color: newUserRole === role ? "#fff" : colors.textColor, fontWeight: "700" },
                  ]}>
                    {ROLE_LABELS[role]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Botão salvar */}
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: "#22c55e", marginTop: 24 }]}
              onPress={onSubmit}
              disabled={isCreatingUser}
              activeOpacity={0.8}
            >
              {isCreatingUser ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Salvar Cadastro</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
