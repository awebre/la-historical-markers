import { getMarkerColor } from "components/markers/utils";
import { useSavedMarkers } from "hooks";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { colors, Locations } from "utils";

const initialRegion = {
  ...Locations.center,
  latitudeDelta: 5,
  longitudeDelta: 5,
};
export default function MyMarkersScreen() {
  const { markers } = useSavedMarkers();
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
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.stat}>{`${markers.length} markers saved`}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    height: "90%",
  },
  statsContainer: {
    height: "10%",
    backgroundColor: colors.mediumBackground,
  },
  stat: {
    borderRadius: 5,
    margin: 10,
    fontSize: 24,
    color: colors.black,
    backgroundColor: colors.lightBackground,
  },
});
