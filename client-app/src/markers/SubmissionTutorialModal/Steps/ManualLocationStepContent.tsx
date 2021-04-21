import { DismissKeyboard } from "components";
import { FormGroup } from "components/forms";
import { useDebounce } from "hooks";
import React, { useEffect, useState } from "react";
import { Dimensions, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { colors, Locations } from "utils";
import { StepContentProps } from "./types";

export default function ManualLocationStepContent({
  location,
  setLocation,
}: StepContentProps) {
  useEffect(() => {
    if (!location?.latitude || !location?.longitude) {
      setLocation(Locations.center);
    } else if (
      Number(lat) !== location?.latitude ||
      Number(long) !== location?.longitude
    ) {
      setLat(`${location?.latitude}`);
      setLong(`${location?.longitude}`);
    }
  }, [location, Locations.center]);
  const [lat, setLat] = useState(`${location?.latitude}`);
  const [long, setLong] = useState(`${location?.longitude}`);
  return (
    <View style={{ backgroundColor: colors.lightBackground }}>
      <Text style={{ fontSize: 20 }}>Drag the Pin to change the location.</Text>
      <DismissKeyboard>
        <View>
          <FormGroup
            label="Latitude: "
            value={lat}
            onChangeText={(text) => {
              setLat(text);
              const lat = Number(text);
              if (!isNaN(lat)) {
                setLocation({
                  latitude: Number(text),
                  longitude: location?.longitude || 0,
                });
              }
            }}
            keyboardType="decimal-pad"
          />
          <FormGroup
            label="Longitude: "
            value={long}
            onChangeText={(text) => {
              setLong(text);
              const long = Number(text);
              if (!isNaN(long)) {
                setLocation({
                  longitude: Number(text),
                  latitude: location?.latitude || 0,
                });
              }
            }}
            keyboardType="decimal-pad"
          />
        </View>
      </DismissKeyboard>
      <MapView
        initialRegion={{
          latitude: location?.latitude ?? Locations.center.latitude,
          longitude: location?.longitude ?? Locations.center.longitude,
          longitudeDelta: 0.5,
          latitudeDelta: 0.5,
        }}
        style={{ height: Dimensions.get("window").height * 0.4, width: "100%" }}
      >
        <Marker
          draggable
          onDragEnd={(m) => setLocation(m.nativeEvent.coordinate)}
          coordinate={location ?? Locations.center}
        />
      </MapView>
    </View>
  );
}
