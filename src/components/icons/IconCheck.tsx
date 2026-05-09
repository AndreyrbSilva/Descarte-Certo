import Svg, { Path } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
};

export function IconCheck({
  size = 24,
  color = "#000",
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M4 12.6111L8.92308 17.5L20 6.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
