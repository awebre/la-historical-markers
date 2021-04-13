import { DismissKeyboard } from "components";
import MarkerForm from "markers/MarkerForm";
import React from "react";
import { Text, View } from "react-native";
import { colors } from "utils";
import { StepContentProps } from "./types";

export default function DescriptionStepContent({
  marker,
  setMarker,
}: StepContentProps) {
  return marker ? (
    <DismissKeyboard>
      <View style={{ maxHeight: 500, backgroundColor: colors.lightBackground }}>
        <Text style={{ fontSize: 20 }}>
          Enter the name and description as they appear on the marker.
        </Text>
        <Text style={{ fontSize: 16, paddingTop: 10 }}>
          When you're done, hit Review, to finish up your submission.
        </Text>
        <MarkerForm marker={marker} setMarker={setMarker} />
      </View>
    </DismissKeyboard>
  ) : (
    <>
      <Text style={{ fontSize: 20 }}>It looks like something went wrong.</Text>
      <Text style={{ fontSize: 16, paddingTop: 10 }}>
        Hit skip to complete the marker manually, or hit cancel and start over.
      </Text>
    </>
  );
}
