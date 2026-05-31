import { useEffect, useRef, ReactNode, useMemo } from "react";
import { View, Animated, StyleSheet, StyleProp, ViewStyle, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { IconLeaf, IconRecycle, IconStar } from "../icons";

const { width } = Dimensions.get("window");

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  hasCurve?: boolean;
};

// Um SVG de curva para usar na base (opcional)
function CurveBottom() {
  return (
    <View style={styles.curveWrapper}>
      <Svg width={width} height={40} viewBox={`0 0 ${width} 40`} preserveAspectRatio="none">
        <Path d={`M0,0 Q${width / 2},40 ${width},0 L${width},40 L0,40 Z`} fill="transparent" />
        <Path d={`M0,0 Q${width / 2},40 ${width},0 L0,0 Z`} fill="#22c55e" />
      </Svg>
    </View>
  );
}

// O padrão flutuante
function FloatingPattern() {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLoop = (anim: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration, useNativeDriver: true }),
        ])
      );
    };

    createLoop(anim1, 4000).start();
    createLoop(anim2, 6000).start();
    createLoop(anim3, 5000).start();
  }, [anim1, anim2, anim3]);

  const tY1 = anim1.interpolate({ inputRange: [0, 1], outputRange: [0, -15] });
  const tY2 = anim2.interpolate({ inputRange: [0, 1], outputRange: [0, -25] });
  const tY3 = anim3.interpolate({ inputRange: [0, 1], outputRange: [0, 20] });
  const rot1 = anim1.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "10deg"] });
  const rot2 = anim2.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "-15deg"] });
  const rot3 = anim3.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "20deg"] });

  return (
    <View style={styles.patternContainer}>
      <Animated.View style={[styles.floatingItem, { top: "15%", left: "10%", transform: [{ translateY: tY1 }, { rotate: rot1 }] }]}>
        <IconLeaf color="rgba(255,255,255,0.15)" size={42} />
      </Animated.View>
      
      <Animated.View style={[styles.floatingItem, { top: "60%", left: "80%", transform: [{ translateY: tY2 }, { rotate: rot2 }] }]}>
        <IconRecycle color="rgba(255,255,255,0.12)" size={50} />
      </Animated.View>
      
      <Animated.View style={[styles.floatingItem, { top: "30%", left: "75%", transform: [{ translateY: tY3 }, { rotate: rot3 }] }]}>
        <IconStar color="rgba(255,255,255,0.1)" size={28} />
      </Animated.View>
      
      <Animated.View style={[styles.floatingItem, { top: "70%", left: "20%", transform: [{ translateY: tY1 }, { rotate: rot2 }] }]}>
        <IconLeaf color="rgba(255,255,255,0.15)" size={32} />
      </Animated.View>

      {/* Bolhas suaves (Blurry circles concept) */}
      <View style={[styles.blurryCircle, { top: "-10%", right: "-10%", backgroundColor: "rgba(255, 255, 255, 0.08)" }]} />
      <View style={[styles.blurryCircle, { bottom: "-20%", left: "-10%", backgroundColor: "rgba(0, 0, 0, 0.05)" }]} />
    </View>
  );
}

export function AnimatedHeroHeader({ children, style, hasCurve = false }: Props) {
  return (
    <View style={[styles.container, style]}>
      {/* Background gradiente */}
      <LinearGradient
        colors={["#16a34a", "#22c55e", "#4ade80"]} // Tons de verde modernos
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Pattern Flutuante */}
      <FloatingPattern />
      
      {/* Conteúdo principal */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Curva inferior */}
      {hasCurve && <CurveBottom />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden", // Importante para manter a curva/borda arredondada
  },
  content: {
    flex: 1,
    zIndex: 10, // Garante que o conteúdo fique por cima do background
  },
  curveWrapper: {
    position: "absolute",
    bottom: -1, // Evita linha fina vazada
    left: 0,
    right: 0,
    zIndex: 1,
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    zIndex: 0,
  },
  floatingItem: {
    position: "absolute",
  },
  blurryCircle: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    // Blur não funciona perfeitamente no React Native base em todas as plataformas sem libs externas,
    // Mas uma cor com opacidade bem baixa em um círculo gigante já dá o efeito desejado.
  }
});
