import { DismissKeyboard } from "components";
import MarkerForm from "explore/MarkerForm";
import React from "react";
import { Text, View } from "react-native";
import { colors } from "utils";
import { StepContentProps } from "./types";

export default function DescriptionStepContent({
  type,
  setType,
  name,
  setName,
  description,
  setDescription,
}: StepContentProps) {
  return (
    <DismissKeyboard>
      <View style={{ backgroundColor: colors.lightBackground }}>
        <Text style={{ fontSize: 20 }}>
          Enter the name and description as they appear on the marker.
        </Text>
        <Text style={{ fontSize: 16, paddingTop: 10 }}>
          When you're done, hit Review, to finish up your submission.
        </Text>
        <MarkerForm
          type={type}
          setType={setType}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
        />
      </View>
    </DismissKeyboard>
  );
}
