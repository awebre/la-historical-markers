import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useMarkers } from "./markers";
import { useDebounce } from "./hooks";

export default function App() {
  //TODO: move this into a component (called something like MarkersGeoSearch)
  const [region, setRegion] = useState({
    latitude: 30.9843,
    longitude: -91.9623,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });
  const debouncedRegion = useDebounce(region, 500);

  useEffect(() => {
    const setUserLocation = async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setRegion({ latitudeDelta: 0.1, longitudeDelta: 0.1, ...coords });
    };

    setUserLocation();
  }, []);

  const { markers, isLoading, isError } = useMarkers(debouncedRegion);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        onRegionChange={setRegion}
      >
        {!isLoading &&
          !isError &&
          markers?.map((m) => (
            <Marker
              key={m.Id.toString()}
              coordinate={{ latitude: m.Latitude, longitude: m.Longitude }}
              title={m.Name}
              description={m.Description}
            />
          ))}
      </MapView>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>Nearby Historical Markers</Text>
        </View>
        {!isLoading &&
          !isError &&
          markers?.map((m, index) => (
            <View
              key={m.Id}
              style={
                index + 1 < markers.length
                  ? styles.listItemWithBorder
                  : styles.listItem
              }
            >
              <Text>{m.Name}</Text>
            </View>
          ))}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecd9c6",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  card: {
    borderRadius: 5,
    backgroundColor: "#f9f2ec",
    alignSelf: "stretch",
    justifyContent: "space-around",
    margin: 20,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: { width: 1, height: 1 },
  },
  cardHeader: {
    backgroundColor: "#996633",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 10,
  },
  cardHeaderText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  listItemWithBorder: {
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    padding: 10,
  },
  listItem: {
    padding: 10,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
  },
});
