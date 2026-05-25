import { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity,
  Modal, TextInput, ActivityIndicator,
} from "react-native";
import { useConfigColors } from "../../../../theme/useConfigColors";
import { IconEye } from "../../../../components/icons";
import { modalStyles } from "./modalStyles";

const GREEN = "#22c55e";

export function InputModal({ visible, title, subtitle, placeholder, onConfirm, onClose, loading, secureText, extraField, showTotp }: {
  visible:     boolean;
  title:       string;
  subtitle:    string;
  placeholder: string;
  onConfirm:   (value: string, extra?: string, totp?: string) => void;
  onClose:     () => void;
  loading:     boolean;
  secureText?: boolean;
  extraField?: { placeholder: string; label: string };
  showTotp?:   boolean;
}) {
  const colors = useConfigColors();
  const [value,     setValue]     = useState("");
  const [extra,     setExtra]     = useState("");
  const [totp,      setTotp]      = useState("");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => {
    if (!visible) { setValue(""); setExtra(""); setTotp(""); setError(""); }
  }, [visible]);

  async function handleConfirm() {
    setError("");
    try {
      await onConfirm(value, extra || undefined, totp || undefined);
    } catch (e: any) {
      setError(e.response?.data?.error ?? "Erro. Tente novamente.");
    }
  }

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.backdrop}>
        <View style={[modalStyles.card, { backgroundColor: colors.cardBg }]}>
          <Text style={[modalStyles.title, { color: colors.textColor }]}>{title}</Text>
          <Text style={[modalStyles.sub,   { color: colors.subTextColor }]}>{subtitle}</Text>

          {/* campo principal */}
          <View style={{ position: "relative" }}>
            <TextInput
              style={[modalStyles.input, { borderColor: colors.dividerColor, color: colors.textColor, paddingRight: secureText ? 44 : 14 }]}
              placeholder={placeholder}
              placeholderTextColor={colors.subTextColor}
              secureTextEntry={secureText && !showPass1}
              value={value}
              onChangeText={setValue}
              autoFocus
            />
            {secureText && (
              <TouchableOpacity
                onPress={() => setShowPass1((p) => !p)}
                style={{ position: "absolute", right: 12, top: 13 }}
              >
                <IconEye color={colors.subTextColor} off={!showPass1} />
              </TouchableOpacity>
            )}
          </View>

          {/* campo extra (nova senha) */}
          {extraField && (
            <View style={{ position: "relative", marginTop: 10 }}>
              <TextInput
                style={[modalStyles.input, { borderColor: colors.dividerColor, color: colors.textColor, paddingRight: 44 }]}
                placeholder={extraField.placeholder}
                placeholderTextColor={colors.subTextColor}
                secureTextEntry={!showPass2}
                value={extra}
                onChangeText={setExtra}
              />
              <TouchableOpacity
                onPress={() => setShowPass2((p) => !p)}
                style={{ position: "absolute", right: 12, top: 13 }}
              >
                <IconEye color={colors.subTextColor} off={!showPass2} />
              </TouchableOpacity>
            </View>
          )}

          {/* campo TOTP — aparece quando 2FA está ativo */}
          {showTotp && (
            <TextInput
              style={[modalStyles.input, { borderColor: colors.dividerColor, color: colors.textColor, marginTop: 10 }]}
              placeholder="Código do autenticador (6 dígitos)"
              placeholderTextColor={colors.subTextColor}
              keyboardType="number-pad"
              maxLength={6}
              value={totp}
              onChangeText={setTotp}
            />
          )}

          {/* erro inline */}
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
