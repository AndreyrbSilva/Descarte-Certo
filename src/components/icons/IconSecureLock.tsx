import Svg, { Path, Polygon, Rect } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
};

export function IconSecureLock({
  size = 24,
  color = "#000",
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
    >
      <Polygon
        points="11 23.18 9 21.179 7.589 22.589 11 26 17 20 15.59 18.59 11 23.18"
        fill={color}
      />

      <Path
        d="M28 30H24V28h4V16H24V8a4.0045 4.0045 0 0 0-4-4V2a6.0067 6.0067 0 0 1 6 6v6h2a2.0021 2.0021 0 0 1 2 2V28A2.0021 2.0021 0 0 1 28 30Z"
        fill={color}
      />

      <Path
        d="M20 14H18V8A6 6 0 0 0 6 8v6H4a2 2 0 0 0-2 2V28a2 2 0 0 0 2 2H20a2 2 0 0 0 2-2V16A2 2 0 0 0 20 14ZM8 8a4 4 0 0 1 8 0v6H8ZM20 28H4V16H20Z"
        fill={color}
      />

      <Rect
        width={32}
        height={32}
        fillOpacity={0}
      />
    </Svg>
  );
}
