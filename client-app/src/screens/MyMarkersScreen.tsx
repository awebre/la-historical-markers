import { getMarkerColor } from "components/markers/utils";
import { useSavedMarkers } from "hooks";
import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SavedMarkerCategory } from "types";
import { colors, Locations } from "utils";

const initialRegion = {
  ...Locations.center,
  latitudeDelta: 5,
  longitudeDelta: 5,
};
const Categories: SavedMarkerCategory[] = [
  { type: "Visited" },
  { type: "Authored" },
  { type: "Save For Later" },
];

export default function MyMarkersScreen() {
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
  console.log(categoryStats);
  return (
    <>
      <MapView
        style={styles.map}
        showsUserLocation={true}
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
      <ScrollView style={styles.statsContainer}>
        {categoryStats &&
          categoryStats.length > 0 &&
          categoryStats.map((s) => (
            <View key={s.category} style={styles.stat}>
              <Text style={styles.stat}>{`${s.category}:`}</Text>
              <Text style={styles.stat}>{s.markerCount}</Text>
            </View>
          ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    height: "75%",
  },
  statsContainer: {
    height: "25%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: colors.mediumBackground,
  },
  stat: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    borderRadius: 5,
    margin: 10,
    fontSize: 24,
    color: colors.black,
    backgroundColor: colors.lightBackground,
  },
});
