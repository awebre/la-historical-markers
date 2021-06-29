import { SavedMarkerCategory, Visited } from "types";

export function getIconFromCategory(category: SavedMarkerCategory) {
  switch (category.type) {
    case "Visited":
      return "map-marked";
    case "Authored":
      return "feather-alt";
    case "Save For Later":
      return "bookmark";
    case "Custom":
      return "list-alt";
  }
}
