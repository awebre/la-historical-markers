import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { LoadableMarkers } from "markers";
import { MarkerDto } from "types";
import MarkersCard from "./MarkersCard";
import ViewMarkerCard from "./ViewMarkerCard";

interface MarkersSearchViewProps {
  loadableMarkers: LoadableMarkers;
  selectedMarker: MarkerDto | null;
  setSelectedMarker: (marker: MarkerDto | null) => void;
  setIsAdding: () => void;
  markersCardStyles: StyleProp<ViewStyle>;
}

export default function MarkersSearchView({
  loadableMarkers,
  selectedMarker,
  setSelectedMarker,
  setIsAdding,
  markersCardStyles,
}: MarkersSearchViewProps) {
  return (
    <>
      {!selectedMarker && (
        <MarkersCard
          style={markersCardStyles}
          setIsAdding={setIsAdding}
          setSelectedMarker={setSelectedMarker} //TODO: maybe this should cause the map to focus on the selected markers?
          {...loadableMarkers}
        />
      )}
      {selectedMarker && (
        <ViewMarkerCard
          style={markersCardStyles}
          marker={selectedMarker}
          onCancel={() => setSelectedMarker(null)}
        />
      )}
    </>
  );
}
