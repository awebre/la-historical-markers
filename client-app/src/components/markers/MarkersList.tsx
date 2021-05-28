import React from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { LoadableMarkers, MarkerDto } from "types";
import FlatListItemSeparator from "../FlatListItemSeparator";
import MarkerListItem from "./MarkerListItem";

interface MarkersListProps extends LoadableMarkers {
  setSelectedMarker: (m: MarkerDto) => void;
}

export default function MarkersList({
  isLoading,
  markers,
  hasError,
  setSelectedMarker,
}: MarkersListProps) {
  return (
    <>
      {isLoading && (
        <View style={styles.listItem}>
          <Text>Looking for nearby markers...</Text>
        </View>
      )}
      {markers && markers.length > 0 && !hasError && (
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
      {!isLoading && (!markers || markers.length === 0 || hasError) && (
        <View style={styles.listItem}>
          <Text>No Markers Found</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  listItem: {
    padding: 15,
  },
});
