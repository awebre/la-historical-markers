import { SavedMarkerCategory, Visited } from "types";

export function getIconFromCategory(category: SavedMarkerCategory) {
  switch (category.type) {
    case "Visited":
      return "map-marked";
    case "Authored":
      return "feather-alt";
    case "For Later":
      return "bookmark";
    case "Custom":
      return "list-alt";
  }
}

export function getLabel(category: SavedMarkerCategory) {
  if (category.type === "Custom" && category.value) {
    return category.value;
  }

  return category.type;
}
