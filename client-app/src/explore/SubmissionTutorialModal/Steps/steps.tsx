import React from "react";
import { Button, Text } from "react-native";
import { useTailwind } from "tailwind-rn";
import { colors } from "utils";

import ConfirmLocationStepContent from "./ConfirmLocationStepContent";
import DescriptionStepContent from "./DescriptionStepContent";
import keys from "./keys";
import ManualLocationStepContent from "./ManualLocationStepContent";
import StartStepContent from "./StartStepContent";
import TakePhotoStepContent from "./TakePhotoStepContent";
import { NextButtonProps } from "./types";

const PictureHeader = () => {
  const tailwind = useTailwind();
  return (
    <Text style={tailwind("text-lg mt-4")}>
      Click "Add Image" to select an image or take a photo of the marker.
    </Text>
  );
};

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
    HeaderContent: PictureHeader,
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
