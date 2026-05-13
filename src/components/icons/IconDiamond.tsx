import Svg, { Path, Polygon } from "react-native-svg";

export function IconDiamond({ color = "#000", size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      {/* Faceta inferior (corpo do diamante) */}
      <Polygon
        points="512,178.746 256,459.089 0,178.976 17.546,153.148 493.952,153.148"
        fill={color}
        opacity={0.3}
      />
      {/* Faceta superior (topo do diamante) */}
      <Polygon
        points="493.952,153.148 17.546,153.148 70.467,75.288 85.671,52.911 423.265,52.911 440.978,78.038"
        fill={color}
        opacity={0.5}
      />
      {/* Linhas internas — reflexos */}
      <Path
        d="M257.401,76.229 L335.262,153.148 H174.396 L257.401,76.229Z"
        fill={color}
        opacity={0.7}
      />
      <Path
        d="M257.401,415.935 L153.389,184.518 H359.291 L257.401,415.935Z"
        fill={color}
        opacity={0.6}
      />
      {/* Contorno */}
      <Polygon
        points="512,178.746 506.761,184.518 284.975,428.744 258.008,458.441 257.422,459.089 257.401,459.068 256.178,457.751 254.829,456.276 225.979,424.875 5.103,184.518 0,178.976 17.546,153.148 70.467,75.288 85.671,52.911 423.265,52.911 440.978,78.038 493.952,153.148"
        stroke={color}
        strokeWidth={12}
        fill="none"
      />
    </Svg>
  );
}
