import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text, FlatList } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import {
  MarkersCard,
  useMarkers,
  MarkerDto,
  UserLocation,
  ViewMarkerCard,
} from "markers";
import { useDebounce } from "hooks";

export default function App() {
  //TODO: move this into a component (called something like MarkersGeoSearch)
  const [region, setRegion] = useState({
    latitude: 30.9843,
    longitude: -91.9623,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });
  //note: debounce user location if you ever subscribe to updates
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const [selectedMarker, setSelectedMarker] = useState<MarkerDto | null>(null);
  const [openMarker, setOpenMarker] = useState<MarkerDto | null>(null);
  const debouncedRegion = useDebounce(region, 500);

  useEffect(() => {
    const requestAndSetLocation = async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setRegion({ latitudeDelta: 0.1, longitudeDelta: 0.1, ...coords });
      setUserLocation(coords);
    };

    requestAndSetLocation();
  }, []);

  const loadableMarkers = useMarkers({ region: debouncedRegion, userLocation });
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        onRegionChange={setRegion}
        onMarkerSelect={(event) =>
          setOpenMarker(
            loadableMarkers?.markers?.find(
              (x) => x.id.toString() === event.nativeEvent.id
            ) ?? null
          )
        }
        onMarkerDeselect={() => {
          setOpenMarker(null);
        }}
        onCalloutPress={() => setSelectedMarker(openMarker)}
      >
        {loadableMarkers?.markers?.map((m) => (
          <Marker
            key={m.id.toString()}
            identifier={m.id.toString()}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.name}
            description={m.description}
          />
        ))}
      </MapView>
      {!selectedMarker && (
        <MarkersCard
          style={styles.card}
          setSelectedMarker={setSelectedMarker} //TODO: maybe this should cause the map to focus on the selected markers?
          {...loadableMarkers}
        />
      )}
      {selectedMarker && (
        <ViewMarkerCard
          marker={selectedMarker}
          onCancel={() => setSelectedMarker(null)}
        />
      )}
      <View style={styles.addButton}>
        <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>
          +
        </Text>
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
    marginTop: -5,
    maxHeight: Dimensions.get("window").height * 0.4 - 20,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
  },
  addButton: {
    position: "absolute",
    top: Dimensions.get("window").height - 100,
    right: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 75,
    backgroundColor: "#dab574",
    height: 75,
    width: 75,
  },
});
