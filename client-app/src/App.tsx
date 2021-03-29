import React, { useState, useRef } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Location, MarkerDto } from "types";
import { MarkersSearchView, SubmitMarkerView, useMarkers } from "markers";
import { useDebounce, useLocation } from "hooks";
import { colors } from "utils";
import Toast from "react-native-easy-toast";

export default function App() {
  //TODO: move this into a component (called something like MarkersGeoSearch)
  const [region, setRegion] = useState({
    latitude: 30.9843,
    longitude: -91.9623,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });
  const toast = useRef<Toast>(null);

  //note: debounce user location if you ever subscribe to updates
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerDto | null>(null);
  const [openMarker, setOpenMarker] = useState<MarkerDto | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newMarker, setNewMarker] = useState<MarkerDto | null>(null);

  const debouncedRegion = useDebounce(region, 500);
  useLocation({
    location: userLocation,
    setLocation: (location) => {
      setRegion({ latitudeDelta: 0.1, longitudeDelta: 0.1, ...location });
      setUserLocation(location);
    },
  });

  const loadableMarkers = useMarkers({ region: debouncedRegion, userLocation });
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        onRegionChangeComplete={setRegion}
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
        {!isAdding &&
          loadableMarkers?.markers?.map((m) => (
            <Marker
              key={m.id.toString()}
              identifier={m.id.toString()}
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              title={m.name}
              description={m.description}
            />
          ))}
        {isAdding && newMarker && newMarker.latitude && newMarker.longitude && (
          <Marker
            coordinate={{ ...newMarker }}
            title={newMarker.name}
            description={newMarker.description}
          />
        )}
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
            setNewMarker(null);
          }}
          onSuccess={() => {
            setIsAdding(false);
            toast.current?.show(
              `We received your submission of ${newMarker?.name}`,
              3000
            );
            setNewMarker(null);
          }}
          marker={newMarker}
          setMarker={setNewMarker}
        />
      )}
      <Toast ref={toast} />
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
  toast: {},
  toastText: {},
});
