import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../../services/authService";

export function AdminScreen() {
  const navigation = useNavigation<any>();

  async function handleLogout() {
    await logout();
    navigation.replace("Login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔒</Text>
      <Text style={styles.title}>Painel de Admin</Text>
      <Text style={styles.subtitle}>(em breve)</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#94a3b8",
    marginBottom: 48,
  },
  logoutBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: "#ef4444",
    borderRadius: 12,
  },
  logoutText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
