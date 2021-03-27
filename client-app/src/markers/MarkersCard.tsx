import React from "react";
import {
  View,
  FlatList,
  Text,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { Card, FlatListItemSeparator } from "components";
import { LoadableMarkers, MarkerDto } from "./useMarkers";
import MarkerListItem from "./MarkerListItem";

interface MarkersCardProps extends LoadableMarkers {
  style: StyleProp<ViewStyle>;
  setSelectedMarker: (item: MarkerDto) => void;
}

export default function MarkersCard({
  style,
  isLoading,
  isError,
  markers,
  setSelectedMarker,
}: MarkersCardProps) {
  return (
    <Card style={[styles.card, style]}>
      <Card.Header style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>Nearby Historical Markers</Text>
      </Card.Header>
      {!isLoading && !isError && (
        <FlatList
          data={markers}
          renderItem={({ item }) => (
            <MarkerListItem
              marker={item}
              onPress={() => setSelectedMarker(item)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={FlatListItemSeparator}
        />
      )}
      {isLoading && (
        <View style={styles.listItem}>
          <Text>Looking for nearby markers...</Text>
        </View>
      )}
      {!isLoading && (!markers || markers.length === 0) && (
        <View style={styles.listItem}>
          <Text>No markers found</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f2ec",
  },
  cardHeader: {
    backgroundColor: "#996633",
  },
  cardHeaderText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  listItem: {
    padding: 10,
  },
});
