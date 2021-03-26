import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useMarkers } from "./markers";
import { useDebounce } from "./hooks";

export default function App() {
  const [location, setLocation] = useState({
    latitude: 30.9843,
    longitude: -91.9623,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });

  const [region, setRegion] = useState(location);
  const debouncedRegion = useDebounce(region, 500);

  useEffect(() => {
    const setUserLocation = async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        console.log("here!");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation({ latitudeDelta: 0.1, longitudeDelta: 0.1, ...coords });
    };

    setUserLocation();
  }, []);

  const { markers, isLoading, isError } = useMarkers(debouncedRegion);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}
        onRegionChange={setRegion}
      >
        {!isLoading &&
          !isError &&
          markers?.map((m) => (
            <Marker
              key={m.Id.toString()}
              coordinate={{ latitude: m.Latitude, longitude: m.Longitude }}
              title={m.Name}
              description={m.Description}
            />
          ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2,
  },
});
