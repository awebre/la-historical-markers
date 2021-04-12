import React from "react";
import { View, Text, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { colors } from "utils";
import { StepContentProps } from "./types";

export default function LocationStepContent({
  requestLocation,
  marker,
}: StepContentProps) {
  return (
    <View>
      {marker ? (
        <>
          <Text style={{ fontSize: 20, paddingBottom: 10 }}>
            Does this location look correct?
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.accent,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <MapView
              showsUserLocation={true}
              initialRegion={{
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
                ...marker,
              }}
              style={{ height: 200, width: "100%" }}
            >
              {marker && <Marker coordinate={{ ...marker }} />}
            </MapView>
          </View>
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
