import React from "react";
import { View, Text } from "react-native";
import MapView from "react-native-maps";

export default function StartStepContent() {
  return (
    <View>
      <Text style={{ fontSize: 20 }}>
        Let's start by getting as close to the marker as possible. Once you're
        next to the marker, click Next.
      </Text>
      <MapView
        showsUserLocation={true}
        followsUserLocation={true}
        style={{ height: 200, width: "100%" }}
      />
    </View>
  );
}
