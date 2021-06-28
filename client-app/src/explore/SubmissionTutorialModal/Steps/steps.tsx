import React from "react";
import { Button } from "react-native";
import { colors } from "utils";
import DescriptionStepContent from "./DescriptionStepContent";
import keys from "./keys";
import ConfirmLocationStepContent from "./ConfirmLocationStepContent";
import StartStepContent from "./StartStepContent";
import TakePhotoStepContent from "./TakePhotoStepContent";
import { NextButtonProps } from "./types";
import ManualLocationStepContent from "./ManualLocationStepContent";

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
    key: keys.deviceLocation,
    heading: "Check and Set the Location",
    Content: ConfirmLocationStepContent,
    NextButton: ({ goToNextStep }: NextButtonProps) => (
      <Button title="Next" onPress={goToNextStep} color={colors.primary} />
    ),
  },
  {
    key: keys.manualLocation,
    heading: "Move the Pin to Set the Location",
    Content: ManualLocationStepContent,
    NextButton: ({ goToNextStep }: NextButtonProps) => (
      <Button title="Next" onPress={goToNextStep} color={colors.primary} />
    ),
  },
  {
    key: keys.image,
    heading: "Take a Picture",
    Content: TakePhotoStepContent,
    NextButton: ({ goToNextStep }: NextButtonProps) => (
      <Button title="Next" onPress={goToNextStep} color={colors.primary} />
    ),
  },
  {
    key: keys.description,
    heading: "Name and Description",
    Content: DescriptionStepContent,
    NextButton: ({ close, name, description }: NextButtonProps) => (
      <Button
        title="Review"
        onPress={close}
        color={colors.primary}
        disabled={!name || !description}
      />
    ),
  },
];

export { steps as default, keys };
