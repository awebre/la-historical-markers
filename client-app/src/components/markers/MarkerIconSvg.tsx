import React from "react";
import Svg, { Circle, Rect } from "react-native-svg";
import { colors } from "utils";

interface IMarkerIconSvgProps {
  color: string;
}

export default function MarkerIconSvg({ color }: IMarkerIconSvgProps) {
  return (
    <Svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <Rect y="4" width="15" height="12" fill={color} />
      <Circle cx="7.5" cy="4" r="3.5" fill={color} />
    </Svg>
  );
}
