import { useEffect, useRef, useState } from "react";
import { Animated, Alert } from "react-native";
import { CameraType, useCameraPermissions, CameraView } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigation } from "@react-navigation/native";

import { submitScan, NotTrashError } from "../../../../services/scanService";
import { useAuthStore } from "../../../../store/useAuthStore";
import { FRAME_SIZE } from "../scannerStyles";

export function useScannerData() {
  const navigation            = useNavigation<any>();
  const [permission, request] = useCameraPermissions();
  const [facing,   setFacing]  = useState<CameraType>("back");
  const [flash,    setFlash]   = useState(false);
  const [loading,  setLoading] = useState(false);
  const previousStreak = useAuthStore((s) => s.streak);

  const cameraRef = useRef<CameraView>(null);
  const scanAnim  = useRef(new Animated.Value(0)).current;
  const frameAnim = useRef(new Animated.Value(0)).current;
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
        base64: true,
      });

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

      if (!photo) throw new Error("Falha ao capturar foto.");

      // calcula o crop proporcional ao frame
      const { width: photoW, height: photoH } = photo;
      const cropSize   = Math.min(photoW, photoH) * 0.72;
      const originX    = (photoW - cropSize) / 2;
      const originY    = (photoH - cropSize) / 2;

      const cropped = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ crop: { originX, originY, width: cropSize, height: cropSize } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      const result = await submitScan(cropped.uri, cropped.base64);
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

  function toggleFacing() {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }

  function toggleFlash() {
    setFlash((prev) => !prev);
  }

  return {
    navigation,
    permission,
    request,
    facing,
    flash,
    loading,
    cameraRef,
    scanAnim,
    frameAnim,
    scaleAnim,
    overlayAnim,
    handleCapture,
    toggleFacing,
    toggleFlash,
  };
}
