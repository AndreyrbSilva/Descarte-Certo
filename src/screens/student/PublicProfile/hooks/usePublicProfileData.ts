import { useState, useEffect, useRef } from "react";
import { Animated } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigation, useRoute } from "@react-navigation/native";

import { fetchPublicProfile } from "../../../../services/profileService";
import {
  TimeFilter, FILTERS, PREVIEW_COUNT,
  getLevelInfo, filterScans, formatDate,
} from "../../Profile/hooks/useProfileData";

const GREEN = "#22c55e";

export { TimeFilter, FILTERS, formatDate };

export function usePublicProfileData() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const { userId } = route.params as { userId: string };

  const [profileUser, setProfileUser] = useState<any>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalScans, setTotalScans]   = useState(0);
  const [scans, setScans]             = useState<any[]>([]);
  const [schoolRank, setSchoolRank]   = useState<number | null>(null);
  const [turmaRank, setTurmaRank]     = useState<number | null>(null);
  const [streak, setStreak]           = useState(0);
  const [expanded, setExpanded]       = useState(false);
  const [timeFilter, setTimeFilter]   = useState<TimeFilter>("semana");
  const [recentTrophies, setRecentTrophies] = useState<any[]>([]);
  const [trophyStats, setTrophyStats] = useState({ total: 0, unlocked: 0 });

  const headerAnim  = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardAnim    = useRef(new Animated.Value(40)).current;
  const expandAnim  = useRef(new Animated.Value(1)).current;
  const xpAnim      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(GREEN);
    NavigationBar.setButtonStyleAsync("light");

    Animated.sequence([
      Animated.timing(headerAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(cardAnim,    { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();

    fetchPublicProfile(userId).then((data) => {
      setProfileUser(data.user);
      setTotalPoints(data.totalPoints);
      setTotalScans(data.totalScans);
      setScans(data.scans);
      setSchoolRank(data.schoolRank);
      setTurmaRank(data.turmaRank);
      setStreak(data.streak);
      setRecentTrophies(data.recentTrophies ?? []);
      setTrophyStats(data.trophyStats ?? { total: 0, unlocked: 0 });
    });
  }, []);

  useEffect(() => {
    const info = getLevelInfo(totalPoints);
    xpAnim.setValue(0);
    Animated.timing(xpAnim, {
      toValue: info.progress, duration: 800, useNativeDriver: false,
    }).start();
  }, [totalPoints]);

  useEffect(() => { setExpanded(false); }, [timeFilter]);

  function handleExpand() {
    Animated.sequence([
      Animated.timing(expandAnim, { toValue: 0, duration: 90, useNativeDriver: true }),
      Animated.timing(expandAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
    ]).start(() => setExpanded((prev) => !prev));
  }

  const levelInfo     = getLevelInfo(totalPoints);
  const initial       = (profileUser?.name?.split(" ")[0] ?? "A")[0].toUpperCase();
  const filteredScans = filterScans(scans, timeFilter);
  const visibleScans  = expanded ? filteredScans : filteredScans.slice(0, PREVIEW_COUNT);
  const hasMore       = filteredScans.length > PREVIEW_COUNT;

  const xpWidth = xpAnim.interpolate({
    inputRange: [0, 1], outputRange: ["0%", "100%"],
  });

  return {
    navigation,
    profileUser,
    totalPoints,
    totalScans,
    schoolRank,
    turmaRank,
    streak,
    expanded,
    timeFilter,
    setTimeFilter,
    recentTrophies,
    trophyStats,
    headerAnim,
    cardOpacity,
    cardAnim,
    expandAnim,
    levelInfo,
    initial,
    filteredScans,
    visibleScans,
    hasMore,
    xpWidth,
    handleExpand,
  };
}
