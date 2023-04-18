import LocationNavigationButton from "components/LocationNavigationButton";
import { MarkerFilter } from "components/markers";
import {
  getMarkerColor,
  getMarkerTypeDescription,
} from "components/markers/utils";
import { MarkersSearchView, SubmitMarkerView } from "explore";
import MarkerSearchBar from "explore/MarkerSearchBar";
import { StatusBar } from "expo-status-bar";
import { useDebounce, useLocation, useMarkers } from "hooks";
import { PhotoSelectionProvider } from "photos";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, KeyboardAvoidingView, StyleSheet } from "react-native";
import Toast from "react-native-easy-toast";
import MapView, { Marker } from "react-native-maps";
import { useTailwind } from "tailwind-rn";
import TermsAndConditionsModal from "terms/TermsAndConditionsModal";
import { Location, MarkerDto, MarkerType } from "types";
import { Locations } from "utils";

const allFilters = [
  {
    id: MarkerType.official,
    name: getMarkerTypeDescription(MarkerType.official),
    isSelected: true,
  },
  {
    id: MarkerType.other,
    name: getMarkerTypeDescription(MarkerType.other),
    isSelected: true,
  },
];

export default function ExploreScreen() {
  const tailwind = useTailwind();
  const [region, setRegion] = useState({
    ...Locations.center,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });
  const toast = useRef<Toast>(null);
  const map = useRef<MapView>(null);

  const [cachedMarkers, setCachedMarkers] = useState<MarkerDto[] | undefined>(
    undefined
  );
  const [filters, setFilters] = useState(allFilters);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerDto | null>(null);
  const [openMarker, setOpenMarker] = useState<MarkerDto | null>(null);
  const [lastRegion, setLastRegion] = useState(region);
  const [isAdding, setIsAdding] = useState(false);
  const [newMarker, setNewMarker] = useState<Location | null>(null);

  const debouncedUserLocation = useDebounce(userLocation, 1000);

  const debouncedRegion = useDebounce(region, 500);
  const { updateLocation } = useLocation({
    setLocation: (location) => {
      map.current?.animateToRegion({
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
        ...location,
      });
    },
  });

  const { watchLocation } = useLocation({
    setLocation: setUserLocation,
  });

  useEffect(() => {
    updateLocation();
    watchLocation();
  }, []);

  const {
    markers,
    isLoading,
    hasError: hasError,
  } = useMarkers({
    region: debouncedRegion,
    userLocation: debouncedUserLocation,
    filters: filters.filter((f) => f.isSelected).map((f) => f.id),
  });

  useEffect(() => {
    if (markers != undefined) {
      setCachedMarkers(markers);
    }
  }, [markers, isLoading, setCachedMarkers]);

  return (
    <>
      <StatusBar style="light" />
      {!selectedMarker && !isAdding && (
        <>
          <MarkerFilter filters={filters} setFilters={setFilters} />
          <MarkerSearchBar setSelectedMarker={selectMarkerAndNavigate} />
        </>
      )}
      <KeyboardAvoidingView
        style={tailwind("h-full bg-brown-light")}
        behavior="position"
      >
        {selectedMarker && (
          <LocationNavigationButton
            style={tailwind("absolute top-1/4 right-4 -mt-20 z-10")}
            latitude={selectedMarker.latitude}
            longitude={selectedMarker.longitude}
          />
        )}
        <MapView
          ref={map}
          style={[
            styles.map,
            isAdding || selectedMarker ? styles.viewMap : styles.searchMap,
          ]}
          showsUserLocation={true}
          onRegionChangeComplete={setRegion}
          onMarkerSelect={(event) =>
            setOpenMarker(
              cachedMarkers?.find(
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
            cachedMarkers?.map((m) => (
              <Marker
                key={m.id.toString()}
                identifier={m.id.toString()}
                coordinate={{ latitude: m.latitude, longitude: m.longitude }}
                title={m.name}
                pinColor={getMarkerColor(m.type)}
                description={m.description}
              />
            ))}
          {isAdding &&
            newMarker &&
            newMarker.latitude &&
            newMarker.longitude && <Marker coordinate={{ ...newMarker }} />}
        </MapView>
        {!isAdding && (
          <MarkersSearchView
            loadableMarkers={{ markers: cachedMarkers, isLoading, hasError }}
            selectedMarker={selectedMarker}
            setSelectedMarker={selectMarkerAndNavigate}
            setIsAdding={() => setIsAdding(true)}
            markersCardStyles={[
              tailwind("-mt-1 pb-4"),
              selectedMarker ? styles.viewCard : styles.searchCard, //TODO: figure out how to do this with Tailwind
            ]}
          />
        )}
        {isAdding && (
          <PhotoSelectionProvider>
            <SubmitMarkerView
              cardStyles={styles.viewCard}
              cancel={() => {
                setIsAdding(false);
                setNewMarker(null);
              }}
              onSuccess={(name) => {
                setIsAdding(false);
                toast.current?.show(
                  `We received your submission of ${name}`,
                  3000
                );
                setNewMarker(null);
              }}
              updateMapMarker={setNewMarkerAndNavigate}
            />
          </PhotoSelectionProvider>
        )}
        <Toast ref={toast} />
        <TermsAndConditionsModal />
      </KeyboardAvoidingView>
    </>
  );

  function setNewMarkerAndNavigate(location: Location | null) {
    setNewMarker(location);
    navigateToLocation(location);
  }

  function selectMarkerAndNavigate(marker: MarkerDto | null) {
    setSelectedMarker(marker);
    navigateToLocation(marker);
  }

  function navigateToLocation(location: Location | null) {
    if (location != null) {
      setLastRegion(region);
      const { latitude, longitude } = location;
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
  searchCard: {
    maxHeight: "40%",
  },
  viewCard: {
    maxHeight: "75%",
  },
  map: {
    width: Dimensions.get("window").width,
  },
  searchMap: {
    height: "60%",
  },
  viewMap: { height: "25%" },
  goButton: {
    marginTop: -75,
    top: "25%",
    right: 25,
    position: "absolute",
    zIndex: 1,
  },
});
