import { getMarkerColor } from "components/markers/utils";
import { useSavedMarkers } from "hooks";
import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Locations } from "utils";

const initialRegion = {
  ...Locations.center,
  latitudeDelta: 5,
  longitudeDelta: 5,
};
export default function MyMarkersScreen() {
  const { markers } = useSavedMarkers();
  console.log(markers);
  return (
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
  );
}

const styles = StyleSheet.create({
  map: {
    height: "100%",
  },
});
