import { useEffect, useRef } from "react";
import { TouchableOpacity, View, Animated, Text, StyleSheet } from "react-native";
import { useAnimatedConfigColors } from "../../../../theme/useConfigColors";
import { styles as configStyles } from "../configStyles";

import React from "react";
import type { NotificationCategory } from "../../../../types/notifications";

interface Props {
  category: NotificationCategory;
  label:    string;
  sub:      string;
  icon:     React.ReactNode;
  enabled:  boolean;
  onToggle: (category: NotificationCategory, value: boolean) => void;
  aColors:  ReturnType<typeof useAnimatedConfigColors>;
}

export function NotificationToggle({ category, label, sub, icon, enabled, onToggle, aColors }: Props) {
  const thumbAnim = useRef(new Animated.Value(enabled ? 1 : 0)).current;
  const trackColor = useRef(new Animated.Value(enabled ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(thumbAnim, {
      toValue: enabled ? 1 : 0,
      tension: 120,
      friction: 8,
      useNativeDriver: true,
    }).start();

    Animated.timing(trackColor, {
      toValue: enabled ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [enabled]);

  const thumbX = thumbAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [2, 26],
  });

  const trackBg = trackColor.interpolate({
    inputRange:  [0, 1],
    outputRange: ["#94a3b8", "#16a34a"],
  });

  return (
    <TouchableOpacity
      style={configStyles.item}
      onPress={() => onToggle(category, !enabled)}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <Animated.View style={[configStyles.itemIconWrap, { backgroundColor: aColors.iconBg }]}>
        {icon}
      </Animated.View>

      {/* Label + subtitle */}
      <View style={configStyles.itemText}>
        <Animated.Text style={[configStyles.itemLabel, { color: aColors.textColor }]}>
          {label}
        </Animated.Text>
        <Animated.Text style={[configStyles.itemSub, { color: aColors.subTextColor }]}>
          {sub}
        </Animated.Text>
      </View>

      {/* Toggle switch */}
      <TouchableOpacity
        onPress={() => onToggle(category, !enabled)}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Animated.View style={[localStyles.track, { backgroundColor: trackBg }]}>
          <Animated.View style={[localStyles.thumb, { transform: [{ translateX: thumbX }] }]} />
        </Animated.View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const localStyles = StyleSheet.create({
  emoji: {
    fontSize: 18,
  },
  track: {
    width:          52,
    height:         28,
    borderRadius:   14,
    justifyContent: "center",
    padding:        2,
  },
  thumb: {
    width:          24,
    height:         24,
    borderRadius:   12,
    backgroundColor: "#fff",
    shadowColor:    "#000",
    shadowOffset:   { width: 0, height: 1 },
    shadowOpacity:  0.15,
    shadowRadius:   2,
    elevation:      2,
  },
});
