import Svg, { Path } from "react-native-svg";

export function IconShieldCheck({ color = "#000", size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      {/* Escudo sólido com check integrado */}
      <Path
        d="M31.25 7.4a43.79 43.79 0 0 1-6.62-2.35 45 45 0 0 1-6.08-3.21L18 1.5l-.54.35a45 45 0 0 1-6.08 3.21A43.79 43.79 0 0 1 4.75 7.4L4 7.59v8.34c0 13.39 13.53 18.4 13.66 18.45l.34.12.34-.12c.14 0 13.66-5.05 13.66-18.45V7.59Z"
        fill={color}
        opacity={0.2}
      />
      {/* Contorno do escudo */}
      <Path
        d="M31.25 7.4a43.79 43.79 0 0 1-6.62-2.35 45 45 0 0 1-6.08-3.21L18 1.5l-.54.35a45 45 0 0 1-6.08 3.21A43.79 43.79 0 0 1 4.75 7.4L4 7.59v8.34c0 13.39 13.53 18.4 13.66 18.45l.34.12.34-.12c.14 0 13.66-5.05 13.66-18.45V7.59Z"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
      {/* Checkmark */}
      <Path
        d="M26.68 14.05 15.51 24.9 9.19 18.57a1.4 1.4 0 0 1 2-2l4.35 4.36L24.73 12a1.4 1.4 0 1 1 2 2Z"
        fill={color}
      />
    </Svg>
  );
}
