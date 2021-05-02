import { MarkerType } from "types";
import { colors } from "utils";

function getMarkerColor(type: MarkerType) {
  switch (type) {
    case MarkerType.other:
      return colors.secondaryPin;
    case MarkerType.official:
    default:
      return colors.primaryPin;
  }
}

export { getMarkerColor };
