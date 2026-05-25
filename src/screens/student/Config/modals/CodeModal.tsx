import { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity,
  Modal, TextInput, ActivityIndicator,
} from "react-native";
import { useConfigColors } from "../../../../theme/useConfigColors";
import { modalStyles } from "./modalStyles";

const GREEN = "#22c55e";

export function CodeModal({ visible, title, subtitle, onConfirm, onClose, loading }: {
  visible:   boolean;
  title:     string;
  subtitle:  string;
  onConfirm: (code: string) => void;
  onClose:   () => void;
  loading:   boolean;
}) {
  const colors = useConfigColors();
  const [code,  setCode]  = useState("");
  const [error, setError] = useState("");

  useEffect(() => { if (!visible) { setCode(""); setError(""); } }, [visible]);

  async function handleConfirm() {
    setError("");
    try {
      await onConfirm(code);
    } catch (e: any) {
      setError(e.response?.data?.error ?? "Código inválido.");
    }
  }

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.backdrop}>
        <View style={[modalStyles.card, { backgroundColor: colors.cardBg }]}>
          <Text style={[modalStyles.title, { color: colors.textColor }]}>{title}</Text>
          <Text style={[modalStyles.sub,   { color: colors.subTextColor }]}>{subtitle}</Text>
          <TextInput
            style={[modalStyles.input, { borderColor: colors.dividerColor, color: colors.textColor }]}
            placeholder="000000"
            placeholderTextColor={colors.subTextColor}
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
            autoFocus
          />
          {error ? (
            <View style={{ backgroundColor: "#fee2e2", borderRadius: 10, padding: 10, marginTop: 10 }}>
              <Text style={{ color: "#ef4444", fontSize: 13, fontWeight: "700" }}>{error}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={[modalStyles.btn, { backgroundColor: GREEN, opacity: loading ? 0.7 : 1 }]}
            onPress={handleConfirm}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={modalStyles.btnText}>Confirmar</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
            <Text style={{ color: colors.subTextColor, fontSize: 13, textAlign: "center" }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
