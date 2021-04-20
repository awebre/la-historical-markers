import { useDebounce } from "hooks";
import React, { useState } from "react";
import { Dimensions, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Locations } from "utils";
import { StepContentProps } from "./types";

export default function ManualLocationStepContent({
  location,
  setLocation,
}: StepContentProps) {
  return (
    <View>
      <Text style={{ fontSize: 20, paddingBottom: 10 }}>
        Drag the Pin to set the location.
      </Text>
      <MapView
        initialRegion={{
          latitude: location?.latitude ?? Locations.center.latitude,
          longitude: location?.longitude ?? Locations.center.longitude,
          longitudeDelta: 0.5,
          latitudeDelta: 0.5,
        }}
        style={{ height: Dimensions.get("window").height * 0.5, width: "100%" }}
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
