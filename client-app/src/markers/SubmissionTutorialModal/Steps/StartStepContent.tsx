import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { StepContentProps } from "./types";
import { Locations } from "utils";

export default function StartStepContent({
  location,
  useDeviceLocation,
  toggleDeviceLocation,
}: StepContentProps) {
  const initialRegion = location ?? Locations.center;
  return (
    <View>
      <View>
        <Text style={styles.header}>
          How would you like to enter the location of the marker?
        </Text>
        <View style={styles.switchContainer}>
          <Text>
            {useDeviceLocation
              ? "I would like to use my location."
              : "I would like to drop a pin."}
          </Text>
          <Switch
            value={useDeviceLocation}
            onValueChange={toggleDeviceLocation}
          />
        </View>
      </View>
      {useDeviceLocation ? (
        <>
          <Text style={styles.header}>
            Let's start by getting as close to the marker as possible. Once
            you're next to the marker, click Next.
          </Text>
          <MapView
            initialRegion={{
              ...initialRegion,
              latitudeDelta: location ? 0.5 : 5,
              longitudeDelta: location ? 0.5 : 5,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
            style={styles.map}
          />
        </>
      ) : (
        <>
          <Text style={styles.header}>
            You're all set. Click next to go to the next step.
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    marginBottom: 10,
  },
  map: {
    height: 200,
    width: "100%",
  },
  switchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
