import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Location, MarkerDto } from "types";
import { MarkersSearchView, SubmitMarkerView, useMarkers } from "markers";
import { useDebounce, useLocation } from "hooks";
import { colors } from "utils";
import Toast from "react-native-easy-toast";
import TermsAndConditionsModal from "terms/TermsAndConditionsModal";

export default function App() {
  const [region, setRegion] = useState({
    latitude: 30.9843,
    longitude: -91.9623,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });
  const toast = useRef<Toast>(null);
  const map = useRef<MapView>(null);

  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerDto | null>(null);
  const [openMarker, setOpenMarker] = useState<MarkerDto | null>(null);
  const [lastRegion, setLastRegion] = useState(region);
  const [isAdding, setIsAdding] = useState(false);
  const [shouldNavigateToUser, setShouldNavigateToUser] = useState(true);
  const [newMarker, setNewMarker] = useState<Location | null>(null);

  const debouncedUserLocation = useDebounce(userLocation, 1000);

  const debouncedRegion = useDebounce(region, 500);
  useLocation({
    location: userLocation,
    setLocation: setUserLocation,
  });

  useEffect(() => {
    if (shouldNavigateToUser && userLocation !== null) {
      map.current?.animateToRegion({
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
        ...userLocation,
      });
      setShouldNavigateToUser(false);
    }
  }, [shouldNavigateToUser, userLocation]);

  const loadableMarkers = useMarkers({
    region: debouncedRegion,
    userLocation: debouncedUserLocation,
  });
  return (
    <KeyboardAvoidingView style={styles.container} behavior="position">
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
          <Marker coordinate={{ ...newMarker }} />
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
            selectedMarker ? styles.viewCard : styles.searchCard,
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
          onSuccess={(name) => {
            setIsAdding(false);
            toast.current?.show(`We received your submission of ${name}`, 3000);
            setNewMarker(null);
          }}
          updateMapMarker={setNewMarker}
        />
      )}
      <Toast ref={toast} />
      <TermsAndConditionsModal />
    </KeyboardAvoidingView>
  );

  function selectMarkerAndNavigate(marker: MarkerDto | null) {
    setSelectedMarker(marker);
    if (marker != null) {
      setLastRegion(region);
      const { latitude, longitude } = marker;
      map.current?.animateToRegion({
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        latitude,
        longitude,
      });
    } else {
      map.current?.animateToRegion(lastRegion);
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
    maxHeight: Dimensions.get("window").height * 0.4 - 50,
  },
  viewCard: {
    maxHeight: Dimensions.get("window").height * 0.75 - 50,
  },
  map: {
    width: Dimensions.get("window").width,
  },
  searchMap: {
    height: Dimensions.get("window").height * 0.6,
  },
  viewMap: { height: Dimensions.get("window").height * 0.25 },
  toast: {},
  toastText: {},
});
