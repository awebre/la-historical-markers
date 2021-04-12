import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { MarkerDto } from "types";
import { humanizedDistance } from "utils";

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
      <Text style={styles.name}>{marker.name}</Text>
      <Text style={styles.distance}>{humanizedDistance(marker.distance)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: {
    padding: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    flex: 3,
  },
  distance: {
    flex: 1,
    textAlign: "right",
  },
});
