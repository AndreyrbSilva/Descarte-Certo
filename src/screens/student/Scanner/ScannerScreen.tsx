import {
  View, Text, TouchableOpacity,
  Animated, ActivityIndicator, StyleSheet,
} from "react-native";
import { CameraView } from "expo-camera";

import { styles } from "./scannerStyles";
import { FocusAwareStatusBar } from "../../../components/layout/FocusAwareStatusBar";
import { IconFlash, IconFlip, IconCheck } from "../../../components/icons";

import { useScannerData } from "./hooks/useScannerData";

const GREEN = "#22c55e";

export function ScannerScreen() {
  const d = useScannerData();

  if (!d.permission) return <View style={styles.root} />;

  if (!d.permission.granted) {
    return (
      <View style={[styles.root, { alignItems: "center", justifyContent: "center", padding: 32 }]}>
        <Text style={{ color: "#fff", fontSize: 16, textAlign: "center", marginBottom: 20 }}>
          Precisamos da sua câmera para escanear o lixo! 📷
        </Text>
        <TouchableOpacity
          style={[styles.captureBtn, { width: "100%", height: 52, borderRadius: 14 }]}
          onPress={d.request}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Permitir câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#000" />

      <CameraView
        ref={d.cameraRef}
        style={styles.camera}
        facing={d.facing}
        enableTorch={d.flash}
      >
        <View style={styles.overlay}>

          {/* topo */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backBtn} onPress={() => d.navigation.replace("Tabs")}>
                <Text style={{ color: "#fff", fontSize: 30, includeFontPadding: false, textAlignVertical: "center", marginTop: -7 }}>←</Text>
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.topTitle}>Escanear Lixo</Text>
              <Text style={styles.topSub}>Aponte para o resíduo</Text>
            </View>
            <View style={{ width: 50 }} />
          </View>

          {/* frame de mira */}
          <Animated.View style={[styles.frame, { opacity: d.frameAnim }]}>
            <View style={[styles.corner, styles.cornerTL, { borderColor: GREEN }]} />
            <View style={[styles.corner, styles.cornerTR, { borderColor: GREEN }]} />
            <View style={[styles.corner, styles.cornerBL, { borderColor: GREEN }]} />
            <View style={[styles.corner, styles.cornerBR, { borderColor: GREEN }]} />

            <Animated.View style={[styles.scanLine, {
              transform: [{ translateY: d.scanAnim }],
            }]} />

            <Text style={styles.frameHint}>
              {d.loading ? "Analisando..." : "Centralize o item no quadro"}
            </Text>
          </Animated.View>

          {/* botões inferiores */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.sideBtn}
              onPress={d.toggleFlash}
              activeOpacity={0.7}
            >
              <IconFlash color={d.flash ? GREEN : "#fff"} size={22} />
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: d.scaleAnim }] }}>
              <TouchableOpacity
                style={styles.captureBtn}
                onPress={d.handleCapture}
                disabled={d.loading}
                activeOpacity={0.85}
              >
              {d.loading
                ? <ActivityIndicator color="#22c55e" size="large" />
                : <View style={styles.captureBtnInner}>
                    <IconCheck color={GREEN} size={28} />
                  </View>
              }
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={styles.sideBtn}
              onPress={d.toggleFacing}
              activeOpacity={0.7}
            >
              <IconFlip color="#fff" size={22} />
            </TouchableOpacity>
          </View>

        </View>
        <Animated.View
          pointerEvents="none"
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "#000",
            opacity: d.overlayAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.25],
            }),
          }}
        />
      </CameraView>
    </View>
  );
}
