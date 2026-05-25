import { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity,
  Modal, TextInput, ActivityIndicator, Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useConfigColors } from "../../../../theme/useConfigColors";
import { modalStyles } from "./modalStyles";

const GREEN = "#22c55e";

export function QRModal({ visible, qrCode, secret, onConfirm, onClose, loading }: {
  visible:   boolean;
  qrCode:    string;
  secret:    string;
  onConfirm: (code: string) => void;
  onClose:   () => void;
  loading:   boolean;
}) {
  const colors = useConfigColors();
  const [code, setCode] = useState("");

  useEffect(() => { if (!visible) setCode(""); }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.backdrop}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
          <View style={[modalStyles.card, { backgroundColor: colors.cardBg }]}>
            <Text style={[modalStyles.title, { color: colors.textColor }]}>
              Ativar autenticação de dois fatores
            </Text>
            <Text style={[modalStyles.sub, { color: colors.subTextColor }]}>
              Escaneie o QR Code abaixo com o Google Authenticator ou similar.
            </Text>

            {qrCode ? (
              <Image
                source={{ uri: qrCode }}
                style={{ width: 180, height: 180, alignSelf: "center", marginVertical: 16 }}
              />
            ) : (
              <ActivityIndicator color={GREEN} style={{ marginVertical: 24 }} />
            )}

            <Text style={[{ fontSize: 11, textAlign: "center", marginBottom: 16 }, { color: colors.subTextColor }]}>
              Ou insira manualmente: {"\n"}
              <Text style={{ fontWeight: "800", letterSpacing: 2, color: colors.textColor }}>{secret}</Text>
            </Text>

            <TextInput
              style={[modalStyles.input, { borderColor: colors.dividerColor, color: colors.textColor }]}
              placeholder="Código do aplicativo"
              placeholderTextColor={colors.subTextColor}
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />

            <TouchableOpacity
              style={[modalStyles.btn, { backgroundColor: GREEN, opacity: loading ? 0.7 : 1 }]}
              onPress={() => onConfirm(code)}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={modalStyles.btnText}>Verificar e ativar</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
              <Text style={{ color: colors.subTextColor, fontSize: 13, textAlign: "center" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
