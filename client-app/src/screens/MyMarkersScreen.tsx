import { getMarkerColor } from "components/markers/utils";
import { useSavedMarkers } from "hooks";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SavedMarkerModal, SavedMarkerStats } from "saved-markers";
import { SavedMarker, SavedMarkerCategory } from "types";
import { Locations } from "utils";

const initialRegion = {
  ...Locations.center,
  latitudeDelta: 5,
  longitudeDelta: 5,
};

export default function MyMarkersScreen() {
  const [selectedMarker, setSelectedMarker] = useState<SavedMarker | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const { markers } = useSavedMarkers();

  return (
    <>
      {selectedMarker && (
        <SavedMarkerModal
          marker={selectedMarker}
          visible={modalVisible}
          setVisible={setModalVisible}
        />
      )}
      <MapView
        style={styles.map}
        showsUserLocation={true}
        onMarkerSelect={(event) =>
          setSelectedMarker(
            markers?.find((x) => x.id.toString() === event.nativeEvent.id) ??
              null
          )
        }
        onMarkerDeselect={() => setSelectedMarker(null)}
        onCalloutPress={() => {
          setModalVisible(true);
        }}
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
      <SavedMarkerStats markers={markers} />
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    height: "75%",
  },
});
