import Svg, { Line, Path, Rect } from "react-native-svg";

export function IconBulb({ color = "#000", size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
    >
      {/* Raios */}
      <Line x1="50.4" y1="24.38" x2="58.3" y2="23.14" stroke={color} strokeWidth={3} />
      <Line x1="47.93" y1="17.11" x2="52.87" y2="14.2" stroke={color} strokeWidth={3} />
      <Line x1="42.89" y1="11.73" x2="46.21" y2="4.51" stroke={color} strokeWidth={3} />
      <Line x1="33.45" y1="10.69" x2="33.41" y2="4.96" stroke={color} strokeWidth={3} />
      <Line x1="24.29" y1="12.09" x2="21.62" y2="4.51" stroke={color} strokeWidth={3} />
      <Line x1="17.99" y1="17.03" x2="12.96" y2="14.29" stroke={color} strokeWidth={3} />
      <Line x1="15.78" y1="23.97" x2="8.03" y2="22.66" stroke={color} strokeWidth={3} />

      {/* Corpo da lâmpada */}
      <Path
        d="M26.22,45.47c0-5.16-3.19-9.49-4.91-12.69A12.24,12.24,0,0,1,19.85,27c0-6.79,6.21-12.3,13-12.3"
        stroke={color}
        strokeWidth={3}
      />
      <Path
        d="M39.48,45.47c0-5.16,3.19-9.49,4.91-12.69A12.24,12.24,0,0,0,45.85,27c0-6.79-6.21-12.3-13-12.3"
        stroke={color}
        strokeWidth={3}
      />

      {/* Base */}
      <Rect
        x="23.63"
        y="45.19"
        width="18.93"
        height="4.25"
        rx="2.12"
        stroke={color}
        strokeWidth={3}
      />
      <Rect
        x="24.79"
        y="49.43"
        width="16.61"
        height="4.25"
        rx="2.12"
        stroke={color}
        strokeWidth={3}
      />

      {/* Detalhe inferior */}
      <Path
        d="M36.32,53.68v.84a3.23,3.23,0,1,1-6.44,0v-.84"
        stroke={color}
        strokeWidth={3}
      />

      {/* Filamento */}
      <Path
        d="M24.57,26.25a7.5,7.5,0,0,1,7.88-7.11"
        stroke={color}
        strokeWidth={3}
      />
    </Svg>
  );
}
