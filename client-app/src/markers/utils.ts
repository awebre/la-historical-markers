import { MarkerType } from "types";
import { colors } from "utils";

function getMarkerColor(type: MarkerType) {
  switch (type) {
    case MarkerType.other:
      return colors.secondaryPin;
    case MarkerType.official:
    default:
      return colors.primaryDark;
  }
}

function getMarkerTypeDescription(type: MarkerType | null) {
  switch (type) {
    case MarkerType.other:
      return "Other";
    case MarkerType.official:
      return "LA Historical Marker";
    default:
      return "";
  }
}

export { getMarkerColor, getMarkerTypeDescription };
