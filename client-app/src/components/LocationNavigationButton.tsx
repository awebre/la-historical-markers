import React from "react";
import {
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  Text,
  StyleSheet,
} from "react-native";
import { showLocation } from "react-native-map-link";
import { FontAwesome5 } from "@expo/vector-icons";

type NavButtonProps = {
  style?: StyleProp<ViewStyle>;
  latitude: number;
  longitude: number;
};

const LocationNavigationButton: React.FC<NavButtonProps> = ({
  style,
  latitude,
  longitude,
}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        showLocation({
          latitude,
          longitude,
          alwaysIncludeGoogle: true,
        })
      }
      style={[style, styles.goButton]}
    >
      <FontAwesome5 name="directions" size={24} color="white" />
      <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
        GO
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  goButton: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#0099ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LocationNavigationButton;
