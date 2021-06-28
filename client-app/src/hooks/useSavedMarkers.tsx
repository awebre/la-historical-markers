import { useContext } from "react";
import { SavedMarkersContext } from "saved-markers";

export default function useSavedMarkers() {
  const savedMarkers = useContext(SavedMarkersContext);
  if (savedMarkers === null) {
    throw "SavedMarkerProvider is required higher in the component tree";
  }
  return savedMarkers;
}
