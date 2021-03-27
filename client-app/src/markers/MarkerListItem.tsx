import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { MarkerDto } from "./useMarkers";
import { distanceToMiles } from "utils";

interface MarkerListItemProps {
  marker: MarkerDto;
  onPress?: (event: GestureResponderEvent) => void;
}

export default function MarkerListItem({
  marker,
  onPress,
}: MarkerListItemProps) {
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <Text>{marker.name}</Text>
      <Text>{distanceToMiles(marker.distance)} miles</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
