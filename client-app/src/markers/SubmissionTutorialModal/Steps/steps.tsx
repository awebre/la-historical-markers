import React from "react";
import { Text, Button } from "react-native";
import { colors } from "utils";
import keys from "./keys";
import LocationStepContent from "./LocationStepContent";
import StartStepContent from "./StartStepContent";
import { StepContentProps, NextButtonProps } from "./types";

const steps = [
  {
    key: keys.start,
    heading: "Start Submitting a Marker",
    Content: StartStepContent,
    NextButton: ({ requestLocation, goToNextStep }: NextButtonProps) => (
      <Button
        title="Next"
        onPress={() => {
          requestLocation();
          goToNextStep();
        }}
        color={colors.primary}
      />
    ),
  },
  {
    key: keys.location,
    heading: "Check and Set the Location",
    Content: LocationStepContent,
    NextButton: ({ goToNextStep }: NextButtonProps) => (
      <Button title="Next" onPress={goToNextStep} color={colors.primary} />
    ),
  },
];

export { steps as default, keys };
