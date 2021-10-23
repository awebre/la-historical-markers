import React from "react";
import { Text, StyleProp, ViewStyle, Button } from "react-native";
import { Card, headerTextStyle } from "components";
import { colors } from "utils";
import { LoadableMarkers } from "types";
import { MarkerDto } from "types";
import { MarkersList } from "components/markers";
import { tailwind } from "tailwind-util";

interface MarkersCardProps extends LoadableMarkers {
  style: StyleProp<ViewStyle>;
  setSelectedMarker: (item: MarkerDto) => void;
  setIsAdding: () => void;
}

export default function MarkersCard({
  style,
  isLoading,
  hasError,
  markers,
  setSelectedMarker,
  setIsAdding,
}: MarkersCardProps) {
  return (
    <Card style={style}>
      <Card.Header>
        <Text style={headerTextStyle}>Nearby Historical Markers</Text>
        {markers && (
          <Card.Badge
            text={`${markers.length} result${markers.length !== 1 ? "s" : ""}`}
          />
        )}
      </Card.Header>
      <Card.Body style={tailwind("p-0")}>
        <MarkersList
          isLoading={isLoading}
          markers={markers}
          setSelectedMarker={setSelectedMarker}
          hasError={hasError}
        />
      </Card.Body>
      <Card.Footer style={tailwind("flex items-end")}>
        <Button
          title="Add a Marker"
          onPress={setIsAdding}
          color={colors.primary}
        />
      </Card.Footer>
    </Card>
  );
}
