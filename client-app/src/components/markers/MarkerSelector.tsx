import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { StyleSheet, View, Text } from "react-native";
import { getMarkerTypeDescription } from "markers/utils";
import { MarkerType } from "types";
import { Label } from "components/forms";
import { colors } from "utils";

interface IMarkerSelectorProps {
  type: MarkerType;
  setType: (type: MarkerType) => void;
}

export default function MarkerSelector({
  type,
  setType,
}: IMarkerSelectorProps) {
  const markerOptions = [
    {
      label: getMarkerTypeDescription(MarkerType.official),
      value: MarkerType.official,
    },
    {
      label: getMarkerTypeDescription(MarkerType.other),
      value: MarkerType.other,
    },
  ];
  return (
    <View style={styles.container}>
      <Label>Marker Type:</Label>
      <RNPickerSelect
        style={{
          inputIOSContainer: {
            borderRadius: 5,
            borderWidth: 1,
            borderColor: colors.primary,
            margin: 5,
            padding: 5,
          },
        }}
        value={type}
        onValueChange={setType}
        items={markerOptions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
