import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { colors } from "utils";

interface LocationEntrySwitchProps {
  useDeviceLocation: boolean;
  toggleDeviceLocation: () => void;
}

export default function LocationEntrySwitch({
  useDeviceLocation,
  toggleDeviceLocation,
}: LocationEntrySwitchProps) {
  return (
    <View style={styles.switchContainer}>
      <Text>I would like to use my location</Text>
      <Switch
        thumbColor={colors.white}
        trackColor={{ true: colors.accent, false: colors.grey }}
        value={useDeviceLocation}
        onValueChange={toggleDeviceLocation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
