import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import MapView, { MapViewProps } from "react-native-maps";
import { colors } from "utils";

type Props = {
  ref?: React.RefObject<MapView>;
  containerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
} & MapViewProps;

export default function MapWithBorder({
  containerStyle,
  style,
  children,
  ...rest
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <MapView style={[styles.map, style]} {...rest}>
        {children}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    height: 200,
    width: "100%",
  },
});
