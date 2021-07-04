import React, { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getMarkerColor } from "components/markers/utils";
import { useSavedMarkers } from "hooks";
import { SavedMarkerModal } from "saved-markers";
import { SavedMarker, SavedMarkerCategory } from "types";
import { colors, Locations } from "utils";
import { getIconFromCategory } from "saved-markers/utils";

const initialRegion = {
  ...Locations.center,
  latitudeDelta: 5,
  longitudeDelta: 5,
};
const Categories: SavedMarkerCategory[] = [
  { type: "Visited" },
  { type: "Authored" },
  { type: "Saved For Later" },
];

export default function MyMarkersScreen() {
  const [selectedMarker, setSelectedMarker] = useState<SavedMarker | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const { markers } = useSavedMarkers();
  const categoryStats = Categories.map((c) => {
    const markerCount = markers.filter(
      (m) => m.categories.find((cat) => cat.type === c.type) !== undefined
    )?.length;
    return {
      markerCount,
      category: c.type,
    };
  });
  return (
    <>
      {selectedMarker && (
        <SavedMarkerModal
          marker={selectedMarker}
          visible={modalVisible}
          setVisible={setModalVisible}
        />
      )}
      <MapView
        style={styles.map}
        showsUserLocation={true}
        onMarkerSelect={(event) =>
          setSelectedMarker(
            markers?.find((x) => x.id.toString() === event.nativeEvent.id) ??
              null
          )
        }
        onMarkerDeselect={() => setSelectedMarker(null)}
        onCalloutPress={() => {
          setModalVisible(true);
        }}
        initialRegion={initialRegion}
      >
        {markers?.map((m) => {
          return (
            <Marker
              key={m.id.toString()}
              identifier={m.id.toString()}
              coordinate={{
                latitude: m.latitude,
                longitude: m.longitude,
              }}
              title={m.name}
              pinColor={getMarkerColor(m.type)}
            />
          );
        })}
      </MapView>
      <View style={styles.statsContainer}>
        <ScrollView contentContainerStyle={styles.statsContainer}>
          {categoryStats &&
            categoryStats.length > 0 &&
            categoryStats.map((s) => (
              <View key={s.category} style={styles.stat}>
                <FontAwesome5
                  style={styles.statIcon}
                  name={getIconFromCategory({ type: s.category, value: "" })}
                  size={40}
                  color={colors.primary}
                  backgroundColor={colors.lightBackground}
                />
                <View style={styles.statBubble}>
                  <Text style={{ fontSize: 16, color: colors.white }}>
                    {s.markerCount}
                  </Text>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    height: "75%",
  },
  statsContainer: {
    height: "25%",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: colors.mediumBackground,
  },
  stat: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 125,
    borderRadius: 5,
    margin: 10,
    color: colors.black,
    backgroundColor: colors.lightBackground,
  },
  statIcon: {
    padding: 10,
  },
  statBubble: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
});
