import Svg, { Path } from "react-native-svg";

export function IconRainbow({ color = "#000", size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Arco externo */}
      <Path
        d="M3 18C3 10.82 8.82 5 16 5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.35}
      />
      {/* Arco do meio */}
      <Path
        d="M6 18C6 12.477 10.477 8 16 8"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.55}
      />
      {/* Arco interno */}
      <Path
        d="M9 18C9 14.134 12.134 11 16 11"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.8}
      />
      {/* Nuvem esquerda */}
      <Path
        d="M2 17.5C2 16.12 3.12 15 4.5 15C5.88 15 7 16.12 7 17.5C7 18.88 5.88 20 4.5 20C3.12 20 2 18.88 2 17.5Z"
        fill={color}
        opacity={0.5}
      />
      {/* Nuvem direita */}
      <Path
        d="M17 4.5C17 3.12 18.12 2 19.5 2C20.88 2 22 3.12 22 4.5C22 5.88 20.88 7 19.5 7C18.12 7 17 5.88 17 4.5Z"
        fill={color}
        opacity={0.5}
      />
      {/* Estrelinhas decorativas */}
      <Path
        d="M20 10L20.5 11L21.5 11.5L20.5 12L20 13L19.5 12L18.5 11.5L19.5 11L20 10Z"
        fill={color}
        opacity={0.6}
      />
      <Path
        d="M13 3L13.35 3.7L14.1 4L13.35 4.3L13 5L12.65 4.3L11.9 4L12.65 3.7L13 3Z"
        fill={color}
        opacity={0.4}
      />
    </Svg>
  );
}
