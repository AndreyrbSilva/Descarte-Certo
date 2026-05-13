import Svg, { Path } from "react-native-svg";

export function IconLightning({ color = "#000", size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 11.74a1 1 0 0 0-.52-.63l-3.39-1.68L15 3.14a1 1 0 0 0-1.78-.75l-7 9a1 1 0 0 0-.18.87 1.05 1.05 0 0 0 .6.67l4.27 1.71L10 20.86a1 1 0 0 0 .63 1.07A.92.92 0 0 0 11 22a1 1 0 0 0 .83-.45l6-9A1 1 0 0 0 18 11.74Z"
        fill={color}
      />
    </Svg>
  );
}
