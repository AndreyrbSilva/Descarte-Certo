import { useState, useEffect, useRef } from "react";
import { Animated } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

import { useAuthStore }     from "../../../../store/useAuthStore";
import { logout }           from "../../../../services/authService";
import { fetchProfile, uploadAvatar } from "../../../../services/profileService";
import { fetchAchievements, AchievementData } from "../../../../services/achievementService";
import * as ImagePicker from "expo-image-picker";

const GREEN = "#22c55e";

export type TimeFilter = "hoje" | "3dias" | "semana";

export const FILTERS: { key: TimeFilter; label: string }[] = [
  { key: "hoje",   label: "Hoje" },
  { key: "3dias",  label: "3 dias" },
  { key: "semana", label: "Semana" },
];

export const PREVIEW_COUNT = 4;

export const LEVELS = [
  { name: "Semente",             min: 0,    max: 50   },
  { name: "Broto",               min: 50,   max: 150  },
  { name: "Coletor Verde",       min: 150,  max: 300  },
  { name: "Guardião Verde",      min: 300,  max: 500  },
  { name: "Herói da Reciclagem", min: 500,  max: 1000 },
  { name: "Salvador do Planeta", min: 1000, max: null },
];

export function getLevelInfo(points: number) {
  const current    = [...LEVELS].reverse().find((l) => points >= l.min)!;
  const nextIndex  = LEVELS.indexOf(current) + 1;
  const next       = LEVELS[nextIndex] ?? null;
  const progress   = next ? (points - current.min) / (next.min - current.min) : 1;

  return {
    currentName:   current.name,
    nextName:      next?.name ?? null,
    pointsInLevel: points - current.min,
    pointsToNext:  next ? next.min - current.min : null,
    progress,
    isMax:         next === null,
  };
}

export function isWithinDays(iso: string, days: number): boolean {
  const diff = Date.now() - new Date(iso).getTime();
  return diff <= days * 24 * 60 * 60 * 1000;
}

export function filterScans(scans: any[], filter: TimeFilter): any[] {
  if (filter === "hoje")  return scans.filter((s) => isWithinDays(s.createdAt, 1));
  if (filter === "3dias") return scans.filter((s) => isWithinDays(s.createdAt, 3));
  return scans.filter((s) => isWithinDays(s.createdAt, 7));
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

export function useProfileData() {
  const navigation = useNavigation<any>();
  const user       = useAuthStore((s) => s.user);
  const avatarUrl  = useAuthStore((s) => s.user?.avatarUrl ?? null);

  const [photoUri,       setPhotoUri]       = useState<string | null>(avatarUrl);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [totalPoints,    setTotalPoints]    = useState(0);
  const [totalScans,     setTotalScans]     = useState(0);
  const [scans,          setScans]          = useState<any[]>([]);
  const [schoolRank,     setSchoolRank]     = useState<number | null>(null);
  const [turmaRank,      setTurmaRank]      = useState<number | null>(null);
  const [showLogout,     setShowLogout]     = useState(false);
  const [expanded,       setExpanded]       = useState(false);
  const [timeFilter,     setTimeFilter]     = useState<TimeFilter>("semana");
  const [recentTrophies, setRecentTrophies] = useState<AchievementData[]>([]);
  const [trophyStats,    setTrophyStats]    = useState({ total: 0, unlocked: 0 });

  const headerAnim  = useRef(new Animated.Value(0)).current;
  const cardAnim    = useRef(new Animated.Value(40)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const expandAnim  = useRef(new Animated.Value(1)).current;
  const xpAnim      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(GREEN);
    NavigationBar.setButtonStyleAsync("light");

    Animated.sequence([
      Animated.timing(headerAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(cardAnim,    { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();

    SecureStore.getItemAsync("user").then((raw) => {
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.avatarUrl) setPhotoUri(saved.avatarUrl);
      }
    });

    fetchProfile().then((data) => {
      setTotalPoints(data.totalPoints);
      setTotalScans(data.totalScans);
      setScans(data.scans);
      setSchoolRank(data.schoolRank);
      setTurmaRank(data.turmaRank);
    });

    fetchAchievements().then((data) => {
      const unlocked = data.achievements
        .filter((a) => a.unlocked && a.unlockedAt)
        .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
        .slice(0, 4);
      setRecentTrophies(unlocked);
      setTrophyStats({ total: data.totalCount, unlocked: data.unlockedCount });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const info = getLevelInfo(totalPoints);
    xpAnim.setValue(0);
    Animated.timing(xpAnim, {
      toValue: info.progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [totalPoints]);

  useEffect(() => { setExpanded(false); }, [timeFilter]);

  function handleExpand() {
    Animated.sequence([
      Animated.timing(expandAnim, { toValue: 0, duration: 90,  useNativeDriver: true }),
      Animated.timing(expandAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
    ]).start(() => setExpanded((prev) => !prev));
  }

  async function handlePickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      setUploadingPhoto(true);
      try {
        await uploadAvatar(uri);
      } catch (err) {
        console.log("ERRO UPLOAD:", err);
        setPhotoUri(avatarUrl);
      } finally {
        setUploadingPhoto(false);
      }
    }
  }

  async function confirmLogout() {
    setShowLogout(false);
    await logout();
    navigation.replace("Login");
  }

  const fullName  = user?.name ?? "Aluno";
  const initial   = (user?.name?.split(" ")[0] ?? "A")[0].toUpperCase();
  const levelInfo = getLevelInfo(totalPoints);

  const xpWidth = xpAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ["0%", "100%"],
  });

  const filteredScans = filterScans(scans, timeFilter);
  const visibleScans  = expanded ? filteredScans : filteredScans.slice(0, PREVIEW_COUNT);
  const hasMore       = filteredScans.length > PREVIEW_COUNT;

  return {
    user,
    photoUri,
    uploadingPhoto,
    totalPoints,
    totalScans,
    schoolRank,
    turmaRank,
    showLogout,
    setShowLogout,
    expanded,
    timeFilter,
    setTimeFilter,
    recentTrophies,
    trophyStats,
    headerAnim,
    cardAnim,
    cardOpacity,
    expandAnim,
    xpWidth,
    fullName,
    initial,
    levelInfo,
    filteredScans,
    visibleScans,
    hasMore,
    handleExpand,
    handlePickPhoto,
    confirmLogout,
  };
}
