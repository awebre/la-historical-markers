import { Tutorial } from "components";
import React, { useState } from "react";
import { Button, KeyboardAvoidingView, Modal, Text, View } from "react-native";
import { colors } from "utils";

import steps from "./Steps";
import * as stepHelpers from "./Steps/helpers";
import { StepContentProps } from "./Steps/types";

type SubmissionTutorialModalProps = {
  visible: boolean;
  close: () => void;
  cancel: () => void;
} & StepContentProps;

export default function SubmissionTutorialModal({
  visible,
  close,
  cancel,
  requestLocation,
  location,
  type,
  setType,
  name,
  setName,
  description,
  setDescription,
  images: image,
  setImages: setImage,
  useDeviceLocation,
  toggleDeviceLocation,
  setLocation,
}: SubmissionTutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(steps[0]);
  function goToNextStep() {
    const nextStep = stepHelpers.getNextStep(
      currentStep.key,
      useDeviceLocation
    );
    if (nextStep) {
      setCurrentStep(nextStep);
    }
  }

  function resetAndClose() {
    setCurrentStep(steps[0]);
    close();
  }
  const { HeaderContent } = currentStep;
  return (
    <Modal visible={visible}>
      <KeyboardAvoidingView behavior="position">
        <Tutorial>
          <Tutorial.Header text={currentStep.heading}>
            {HeaderContent && <HeaderContent />}
          </Tutorial.Header>
          <Tutorial.Content>
            <currentStep.Content
              type={type}
              setType={setType}
              requestLocation={requestLocation}
              location={location}
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              images={image}
              setImages={setImage}
              useDeviceLocation={useDeviceLocation}
              toggleDeviceLocation={toggleDeviceLocation}
              setLocation={setLocation}
            />
            <Text style={{ fontSize: 14, paddingTop: 20 }}>
              Click Skip to jump to the end and complete the submission
              manually.
            </Text>
          </Tutorial.Content>
          <Tutorial.Footer>
            <Button
              title="Skip"
              onPress={resetAndClose}
              color={colors.accent}
            />
            <Button title="Cancel" onPress={cancel} color={colors.alert} />
            <currentStep.NextButton
              name={name}
              description={description}
              requestLocation={requestLocation}
              goToNextStep={goToNextStep}
              close={resetAndClose}
            />
          </Tutorial.Footer>
        </Tutorial>
      </KeyboardAvoidingView>
    </Modal>
  );
}
