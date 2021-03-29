import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
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
  const map = useRef<MapView>(null);

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
      map.current?.animateToRegion({
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
        ...location,
      });
      setUserLocation(location);
    },
  });

  const loadableMarkers = useMarkers({ region: debouncedRegion, userLocation });
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="position"
      enabled={true}
    >
      <MapView
        ref={map}
        style={[
          styles.map,
          isAdding || selectedMarker ? styles.viewMap : styles.searchMap,
        ]}
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
        onCalloutPress={() => selectMarkerAndNavigate(openMarker)}
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
          setSelectedMarker={selectMarkerAndNavigate}
          setIsAdding={() => setIsAdding(true)}
          markersCardStyles={[
            styles.card,
            selectedMarker ? styles.viewCard : null,
          ]}
        />
      )}
      {isAdding && (
        <SubmitMarkerView
          cardStyles={styles.viewCard}
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
    </KeyboardAvoidingView>
  );

  function selectMarkerAndNavigate(marker: MarkerDto | null) {
    setSelectedMarker(marker);
    if (marker != null) {
      const { latitude, longitude } = marker;
      map.current?.animateToRegion({
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        latitude,
        longitude,
      });
    } else if (userLocation) {
      map.current?.animateToRegion({
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
        ...userLocation,
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mediumBackground,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  card: {
    alignSelf: "stretch",
    marginTop: -5,
  },
  searchCard: {
    maxHeight: Dimensions.get("window").height * 0.4 - 125,
  },
  viewCard: {
    maxHeight: Dimensions.get("window").height * 0.6 - 50,
  },
  map: {
    width: Dimensions.get("window").width,
  },
  searchMap: {
    height: Dimensions.get("window").height * 0.6,
  },
  viewMap: { height: Dimensions.get("window").height * 0.4 },
  toast: {},
  toastText: {},
});
