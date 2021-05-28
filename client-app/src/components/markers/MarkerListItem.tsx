import MarkerIconSvg from "components/markers/MarkerIconSvg";
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { MarkerDto } from "types";
import { humanizedDistance } from "utils";
import { getMarkerColor } from "../../markers/utils";

interface MarkerListItemProps {
  marker: MarkerDto;
  onPress?: (event: GestureResponderEvent) => void;
}

export default function MarkerListItem({
  marker,
  onPress,
}: MarkerListItemProps) {
  const color = getMarkerColor(marker.type);
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <MarkerIconSvg color={color} />
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
    alignItems: "center",
  },
  name: {
    flex: 3,
    paddingLeft: 10,
  },
  distance: {
    flex: 1,
    textAlign: "right",
  },
});
