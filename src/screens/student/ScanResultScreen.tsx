import { useEffect, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Animated, StatusBar, Image,
} from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useScanResultColors } from "../../hooks/useScanResultColors";
import { styles }              from "./scanResultStyles";
import { IconTrophy, IconRecycle } from "../../components/icons";

const GREEN = "#22c55e";

const CATEGORY_LABEL: Record<string, string> = {
  plastico: "Plástico ♻️",
  papel:    "Papel 📄",
  metal:    "Metal 🥫",
  organico: "Orgânico 🍃",
};

const CATEGORY_TIP: Record<string, string> = {
  plastico: "Plásticos levam até 400 anos para se decompor. Reciclar faz toda a diferença!",
  papel:    "Uma tonelada de papel reciclado salva 20 árvores!",
  metal:    "O alumínio pode ser reciclado infinitas vezes sem perder qualidade!",
  organico: "Lixo orgânico pode virar adubo e ajudar a natureza a crescer!",
};

const CATEGORY_BIN: Record<string, { color: string; label: string }> = {
  plastico: { color: "#ef4444", label: "Lixeira Vermelha" },
  papel:    { color: "#3b82f6", label: "Lixeira Azul" },
  metal:    { color: "#eab308", label: "Lixeira Amarela" },
  organico: { color: "#92400e", label: "Lixeira Marrom" },
};

export function ScanResultScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const colors     = useScanResultColors();

  const { result, photoUri, error } = route.params ?? {};
  console.log("photoUri:", photoUri);

  const headerAnim    = useRef(new Animated.Value(0)).current;
  const cardAnim      = useRef(new Animated.Value(60)).current;
  const cardOpacity   = useRef(new Animated.Value(0)).current;
  const pointsScale   = useRef(new Animated.Value(0.5)).current;
  const pointsOpacity = useRef(new Animated.Value(0)).current;
  const photoAnim     = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(GREEN);
    NavigationBar.setButtonStyleAsync("light");

    Animated.sequence([
      Animated.timing(headerAnim,    { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(pointsScale,   { toValue: 1, tension: 120, friction: 6, useNativeDriver: true }),
        Animated.timing(pointsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(cardAnim,    { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  if (error) {
    return (
      <View style={[styles.root, {
        backgroundColor: colors.cardBg,
        alignItems: "center", justifyContent: "center", padding: 32,
      }]}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>😕</Text>
        <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 8, color: colors.textColor }}>
          Algo deu errado
        </Text>
        <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 32, color: colors.subTextColor }}>
          {error}
        </Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.goBack()}>
          <Text style={styles.btnPrimaryText}>TENTAR NOVAMENTE</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.cardBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── HEADER VERDE ── */}
        <Animated.View style={[styles.header, { opacity: headerAnim }]}>
            <View style={styles.iconWrap}>
                <IconRecycle color="#fff" size={36} />
            </View>
            <Animated.View style={[styles.pointsBadge, {
                transform: [{ scale: pointsScale }],
                opacity: pointsOpacity,
            }]}>
                <Text style={styles.pointsEarned}>+{result?.pointsEarned ?? 0}</Text>
            </Animated.View>
            <Text style={styles.pointsLabel}>pontos ganhos!</Text>
        </Animated.View>

        {/* ── CARD RESULTADO ── */}
        <Animated.View style={[styles.card, {
          backgroundColor: colors.cardBg,
          opacity: cardOpacity,
          transform: [{ translateY: cardAnim }],
        }]}>
          <Text style={[styles.cardTitle, { color: colors.textColor }]}>
            Boa, é um {CATEGORY_LABEL[result?.category] ?? "Resíduo"}!
          </Text>

            {/* foto do lixo */}
            {photoUri ? (
            <Image
                source={{ uri: photoUri }}
                style={styles.photo}
                resizeMode="cover"
                onError={(e) => console.log("Erro na imagem:", e.nativeEvent.error)}
            />
            ) : (
            <Text style={{ color: "red" }}>sem foto</Text>
        )}

        <Text style={[styles.cardSub, { color: colors.subTextColor, marginTop: 12 }]}>
            {CATEGORY_TIP[result?.category] ?? "Continue reciclando!"}
        </Text>

          <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />

          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.subTextColor }]}>Categoria</Text>
            <Text style={[styles.rowValue, { color: colors.textColor }]}>
              {CATEGORY_LABEL[result?.category] ?? "--"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.subTextColor }]}>Pontos ganhos</Text>
            <Text style={[styles.rowValue, { color: GREEN }]}>+{result?.pointsEarned ?? 0}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.subTextColor }]}>Total acumulado</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <IconTrophy color={GREEN} size={14} />
              <Text style={[styles.rowValue, { color: GREEN }]}>{result?.totalPoints ?? 0} pts</Text>
            </View>
          </View>
          {CATEGORY_BIN[result?.category] && (
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: colors.subTextColor }]}>Descartar em</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{
                  width: 12, height: 12, borderRadius: 6,
                  backgroundColor: CATEGORY_BIN[result?.category]?.color,
                }} />
                <Text style={[styles.rowValue, { color: colors.textColor }]}>
                  {CATEGORY_BIN[result?.category]?.label}
                </Text>
              </View>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: colors.dividerColor }]} />

          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.replace("Scanner")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>ESCANEAR MAIS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnSecondary, { borderColor: colors.dividerColor }]}
            onPress={() => navigation.replace("Home")}
            activeOpacity={0.7}
          >
            <Text style={[styles.btnSecondaryText, { color: colors.textColor }]}>
              Ir para o início
            </Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </View>
  );
}
