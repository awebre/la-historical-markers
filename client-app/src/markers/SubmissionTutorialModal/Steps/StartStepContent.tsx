import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { StepContentProps } from "./types";
import { colors, Locations } from "utils";
import LocationEntrySwitch from "components/location";

export default function StartStepContent({
  location,
  requestLocation,
  useDeviceLocation,
  toggleDeviceLocation,
}: StepContentProps) {
  const initialRegion = location ?? Locations.center;
  const ref = useRef<MapView>(null);
  useEffect(() => {
    if (
      location !== null &&
      location.latitude !== null &&
      location.longitude !== null
    ) {
      ref?.current?.animateToRegion({
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
        ...location,
      });
    } else if (location === null) {
      requestLocation();
    }
  }, [location]);

  return (
    <View>
      <View>
        <Text style={styles.header}>
          How would you like to enter the location of the marker?
        </Text>
      </View>
      <LocationEntrySwitch
        useDeviceLocation={useDeviceLocation}
        toggleDeviceLocation={toggleDeviceLocation}
      />
      <Text style={styles.header}>
        {useDeviceLocation
          ? "Let's start by getting as close to the marker as possible. Once you're next to the marker, click Next."
          : "Your location will be used as a starting point. Click Next to continue setting the location."}
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
          ref={ref}
          initialRegion={{
            ...initialRegion,
            latitudeDelta: location ? 0.5 : 5,
            longitudeDelta: location ? 0.5 : 5,
          }}
          showsUserLocation={true}
          style={styles.map}
        />
      </View>
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
});
