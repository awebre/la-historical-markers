import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import MapView, { MapViewProps } from "react-native-maps";
import { colors } from "utils";

type Props = {
  ref?: React.Ref<MapView>;
  containerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
} & MapViewProps;

export default React.forwardRef<MapView, Props>(
  ({ containerStyle, style, children, ...rest }, ref) => (
    <View style={[styles.container, containerStyle]}>
      <MapView ref={ref} style={[styles.map, style]} {...rest}>
        {children}
      </MapView>
    </View>
  )
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    height: 200,
    width: "100%",
  },
});
