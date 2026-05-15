import { useEffect, useRef, useState } from "react";
import {
  View, Text, TouchableOpacity,
  Animated, StatusBar, ActivityIndicator, StyleSheet, Alert,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigation } from "@react-navigation/native";

import { submitScan, NotTrashError } from "../../services/scanService";
import { useScannerColors }  from "../../hooks/useScannerColors";
import { styles, FRAME_SIZE } from "./scannerStyles";
import { IconFlash, IconFlip, IconCheck } from "../../components/icons";
import { useAuthStore } from "../../store/useAuthStore";

const GREEN = "#22c55e";

export function ScannerScreen() {
  const navigation            = useNavigation<any>();
  const colors                = useScannerColors();
  const [permission, request] = useCameraPermissions();
  const [facing,   setFacing]  = useState<CameraType>("back");
  const [flash,    setFlash]   = useState(false);
  const [loading,  setLoading] = useState(false);
  const previousStreak = useAuthStore((s) => s.streak);

  const cameraRef = useRef<CameraView>(null);
  const scanAnim  = useRef(new Animated.Value(0)).current;
  const frameAnim = useRef(new Animated.Value(0)).current;
  const [capturing, setCapturing] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#000000");
    NavigationBar.setButtonStyleAsync("light");

    Animated.timing(frameAnim, {
      toValue: 1, duration: 400, useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: FRAME_SIZE - 4,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  async function handleCapture() {
    if (loading || !cameraRef.current) return;

    try {
      setLoading(true);

      // tira a foto
      setCapturing(true);

      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();

      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }).start();

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        shutterSound: false,
      });

      // volta ao normal
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setCapturing(false);
      if (!photo) throw new Error("Falha ao capturar foto.");

      // calcula o crop proporcional ao frame
      const { width: photoW, height: photoH } = photo;
      const cropSize   = Math.min(photoW, photoH) * 0.72;
      const originX    = (photoW - cropSize) / 2;
      const originY    = (photoH - cropSize) / 2;

      const cropped = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ crop: { originX, originY, width: cropSize, height: cropSize } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      const result = await submitScan(cropped.uri);
      navigation.replace("ScanResult", { result, photoUri: cropped.uri, previousStreak });
    } catch (err: any) {
      if (err instanceof NotTrashError) {
        Alert.alert("Atenção", err.message);
      } else {
        const msg = err.response?.data?.error ?? err.message ?? "Erro ao escanear. Tente novamente.";
        navigation.replace("ScanResult", { error: msg });
      }
    } finally {
      setLoading(false);
    }
  }

  if (!permission) return <View style={styles.root} />;

  if (!permission.granted) {
    return (
      <View style={[styles.root, { alignItems: "center", justifyContent: "center", padding: 32 }]}>
        <Text style={{ color: "#fff", fontSize: 16, textAlign: "center", marginBottom: 20 }}>
          Precisamos da sua câmera para escanear o lixo! 📷
        </Text>
        <TouchableOpacity
          style={[styles.captureBtn, { width: "100%", height: 52, borderRadius: 14 }]}
          onPress={request}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Permitir câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        enableTorch={flash}
      >
        <View style={styles.overlay}>

          {/* topo */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.replace("Tabs")}>
                <Text style={{ color: "#fff", fontSize: 30, includeFontPadding: false, textAlignVertical: "center", marginTop: -7 }}>←</Text>
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.topTitle}>Escanear Lixo</Text>
              <Text style={styles.topSub}>Aponte para o resíduo</Text>
            </View>
            <View style={{ width: 50 }} />
          </View>

          {/* frame de mira */}
          <Animated.View style={[styles.frame, { opacity: frameAnim }]}>
            <View style={[styles.corner, styles.cornerTL, { borderColor: GREEN }]} />
            <View style={[styles.corner, styles.cornerTR, { borderColor: GREEN }]} />
            <View style={[styles.corner, styles.cornerBL, { borderColor: GREEN }]} />
            <View style={[styles.corner, styles.cornerBR, { borderColor: GREEN }]} />

            <Animated.View style={[styles.scanLine, {
              transform: [{ translateY: scanAnim }],
            }]} />

            <Text style={styles.frameHint}>
              {loading ? "Analisando..." : "Centralize o item no quadro"}
            </Text>
          </Animated.View>

          {/* botões inferiores */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.sideBtn}
              onPress={() => setFlash(!flash)}
              activeOpacity={0.7}
            >
              <IconFlash color={flash ? GREEN : "#fff"} size={22} />
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.captureBtn}
                onPress={handleCapture}
                disabled={loading}
                activeOpacity={0.85}
              >
              {loading
                ? <ActivityIndicator color="#22c55e" size="large" />
                : <View style={styles.captureBtnInner}>
                    <IconCheck color={GREEN} size={28} />
                  </View>
              }
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={styles.sideBtn}
              onPress={() => setFacing(facing === "back" ? "front" : "back")}
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
            opacity: overlayAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.25],
            }),
          }}
        />
      </CameraView>
    </View>
  );
}
