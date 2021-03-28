import React from "react";
import {
  View,
  FlatList,
  Text,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Button,
} from "react-native";
import { Card, headerTextStyle, FlatListItemSeparator } from "components";
import { colors } from "utils";
import { LoadableMarkers, MarkerDto } from "./useMarkers";
import MarkerListItem from "./MarkerListItem";

interface MarkersCardProps extends LoadableMarkers {
  style: StyleProp<ViewStyle>;
  setSelectedMarker: (item: MarkerDto) => void;
  setIsAdding: () => void;
}

export default function MarkersCard({
  style,
  isLoading,
  isError,
  markers,
  setSelectedMarker,
  setIsAdding,
}: MarkersCardProps) {
  return (
    <Card style={[styles.card, style]}>
      <Card.Header style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>Nearby Historical Markers</Text>
      </Card.Header>
      <Card.Body style={styles.body}>
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
      </Card.Body>
      <Card.Footer style={styles.footer}>
        <Button
          title="Add a Marker"
          onPress={setIsAdding}
          color={colors.primary}
        />
      </Card.Footer>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {},
  cardHeader: {},
  cardHeaderText: { ...headerTextStyle },
  listItem: {
    padding: 10,
  },
  body: {
    padding: 0,
  },
  footer: {
    display: "flex",
    alignItems: "flex-end",
  },
});
