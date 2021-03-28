import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import {
  MarkersSearchView,
  SubmitMarkerView,
  useMarkers,
  MarkerDto,
  UserLocation,
} from "markers";
import { useDebounce } from "hooks";
import { colors } from "utils";

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
  const [isAdding, setIsAdding] = useState(false);

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
      {!isAdding && (
        <MarkersSearchView
          loadableMarkers={loadableMarkers}
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          setIsAdding={() => setIsAdding(true)}
          markersCardStyles={styles.card}
          addButtonStyles={styles.addButton}
        />
      )}
      {isAdding && (
        <SubmitMarkerView
          cardStyles={styles.card}
          cancel={() => {
            setIsAdding(false);
          }}
          submit={(m) => console.log(m)} //TODO: Make this submit to Azure Functions
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mediumBackground,
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
  },
});
