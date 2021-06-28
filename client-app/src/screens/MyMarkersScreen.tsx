import React from "react";
import { StyleSheet, Text } from "react-native";
import MapView from "react-native-maps";
import { Locations } from "utils";

const initialRegion = {
  ...Locations.center,
  latitudeDelta: 5,
  longitudeDelta: 5,
};
export default function MyMarkersScreen() {
  return (
    <MapView
      style={styles.map}
      showsUserLocation={true}
      initialRegion={initialRegion}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    height: "100%",
  },
});
