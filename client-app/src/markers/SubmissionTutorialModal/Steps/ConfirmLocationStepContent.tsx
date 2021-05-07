import MapWithBorder from "components/MapWithBorder";
import React from "react";
import { View, Text, Button } from "react-native";
import { Marker } from "react-native-maps";
import { StepContentProps } from "./types";

export default function ConfirmLocationStepContent({
  requestLocation,
  location,
}: StepContentProps) {
  return (
    <View>
      {location ? (
        <>
          <Text style={{ fontSize: 20, paddingBottom: 10 }}>
            Does this location look correct?
          </Text>
          <MapWithBorder
            showsUserLocation={true}
            initialRegion={{
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
              ...location,
            }}
          >
            {location && <Marker coordinate={{ ...location }} />}
          </MapWithBorder>
          <Text style={{ fontSize: 16, paddingTop: 10 }}>
            If so, hit Next to set the location.
          </Text>
          <Text style={{ fontSize: 16 }}>
            If not, hit Update Marker Location, then Next.
          </Text>
        </>
      ) : (
        <Text style={{ fontSize: 20 }}>
          Click the button below to load your location.
        </Text>
      )}
      <Button title="Update Marker Location" onPress={requestLocation} />
    </View>
  );
}
