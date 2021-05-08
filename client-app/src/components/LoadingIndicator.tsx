import React, { useEffect } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "utils";

interface Props {
  size: number;
  color?: string | undefined;
}

export default function LoadingIndicator({
  size,
  color = colors.primary,
}: Props) {
  const spinValue = new Animated.Value(0);
  const animateSpin = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => animateSpin());
  };
  useEffect(() => {
    animateSpin();
  }, []);
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
      <FontAwesome5 name="spinner" size={size} color={color} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
