import { useEffect, useRef } from "react";
import { TouchableOpacity, View, Animated } from "react-native";
import { useAnimatedConfigColors } from "../../../../theme/useConfigColors";
import { IconMoonStars, IconSun } from "../../../../components/icons";
import { styles } from "../configStyles";

export function ThemeToggle({ isDark, onToggle, aColors }: {
  isDark: boolean;
  onToggle: () => void;
  aColors: ReturnType<typeof useAnimatedConfigColors>;
}) {
  const thumbAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;
  const colorAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(thumbAnim, {
      toValue: isDark ? 1 : 0,
      tension: 120,
      friction: 8,
      useNativeDriver: true,
    }).start();

    Animated.timing(colorAnim, {
      toValue: isDark ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isDark]);

  const thumbX = thumbAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [2, 26],
  });

  const sunOpacity = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const moonOpacity = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <TouchableOpacity
      style={[styles.item, { paddingVertical: 14 }]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      {/* ícone */}
      <Animated.View style={[styles.itemIconWrap, { backgroundColor: aColors.iconBg }]}>
        <Animated.View style={{ position: "absolute", opacity: moonOpacity }}>
          <IconMoonStars size={20} color="#e2e8f0" />
        </Animated.View>
        <Animated.View style={{ position: "absolute", opacity: sunOpacity }}>
          <IconSun size={20} color="#000000" />
        </Animated.View>
      </Animated.View>

      {/* texto */}
      <View style={styles.itemText}>
        <Animated.Text style={[styles.itemLabel, { color: aColors.textColor }]}>
          {isDark ? "Tema escuro" : "Tema claro"}
        </Animated.Text>
        <Animated.Text style={[styles.itemSub, { color: aColors.subTextColor }]}>
          {isDark ? "Usando modo escuro" : "Usando modo claro"}
        </Animated.Text>
      </View>

      {/* toggle customizado */}
      <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
        <Animated.View style={{
          width:        52,
          height:       28,
          borderRadius: 14,
          backgroundColor: aColors.dividerColor,
          justifyContent: "center",
          padding:      2,
        }}>
          <Animated.View style={{
            width:        24,
            height:       24,
            borderRadius: 12,
            backgroundColor: "#fff",
            transform:    [{ translateX: thumbX }],
            alignItems:   "center",
            justifyContent: "center",
            shadowColor:  "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 2,
            elevation:    2,
          }}>
            <Animated.View style={{ position: "absolute", opacity: moonOpacity }}>
              <IconMoonStars size={14} color="#334155" />
            </Animated.View>
            <Animated.View style={{ position: "absolute", opacity: sunOpacity }}>
              <IconSun size={14} color="#000000" />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
