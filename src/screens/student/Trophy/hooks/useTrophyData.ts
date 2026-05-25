import { useState, useEffect, useRef } from "react";
import { Animated } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigation } from "@react-navigation/native";

import { fetchAchievements, AchievementData } from "../../../../services/achievementService";
import { useTrophyColors } from "../../../../theme/useTrophyColors";

export function useTrophyData() {
  const navigation = useNavigation<any>();
  const colors     = useTrophyColors();

  const [achievements, setAchievements]   = useState<AchievementData[]>([]);
  const [totalCount, setTotalCount]       = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY       = useRef(new Animated.Value(20)).current;
  const listOpacity   = useRef(new Animated.Value(0)).current;
  const listY         = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(colors.bg);

    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(headerY,       { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(listOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(listY,       { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();

    fetchAchievements().then((data) => {
      setAchievements(data.achievements);
      setTotalCount(data.totalCount);
      setUnlockedCount(data.unlockedCount);
    });
  }, []);

  const progressPct = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return {
    navigation,
    colors,
    achievements,
    totalCount,
    unlockedCount,
    progressPct,
    headerOpacity,
    headerY,
    listOpacity,
    listY,
  };
}
