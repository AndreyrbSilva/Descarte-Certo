import Svg, { Path, Circle, Polygon } from "react-native-svg";

type Medal = "gold" | "silver" | "bronze";

const COLORS: Record<Medal, { ribbon: string; outer: string; inner: string }> = {
  gold:   { ribbon: "#E24255", outer: "#FFC54D", inner: "#E8B04B" },
  silver: { ribbon: "#FFBF4B", outer: "#EDEDED", inner: "#BCBCBC" },
  bronze: { ribbon: "#C4C4C4", outer: "#E5B97F", inner: "#C19A6B" },
};

const STAR = "M61.2,31.2l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,62.6c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,30.2,60.7,30.2,61.2,31.2z";

export function IconMedal({ type, size = 40 }: { type: Medal; size?: number }) {
  const c = COLORS[type];
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Polygon
        points="79.7,45.6 60,55.5 40.3,45.6 15.9,94.3 31.1,92.8 38.9,105.9 60,63.9 81.1,105.9 88.9,92.8 104.1,94.3"
        fill={c.ribbon}
      />
      <Circle cx="60" cy="46.4" r="32.2" fill={c.outer} />
      <Circle cx="60" cy="46.4" r="25.3" fill={c.inner} />
      <Path d={STAR} fill="#FFFFFF" />
    </Svg>
  );
}
