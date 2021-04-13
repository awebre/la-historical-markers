import React, { useState } from "react";
import { Modal, Text, View, Button, KeyboardAvoidingView } from "react-native";
import { Tutorial } from "components";
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
  marker,
  setMarker,
  requestLocation,
  image,
  setImage,
}: SubmissionTutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(steps[0]);
  function goToNextStep() {
    const nextStep = stepHelpers.getNextStep(currentStep.key);
    if (nextStep) {
      setCurrentStep(nextStep);
    }
  }
  return (
    <Modal visible={visible}>
      <KeyboardAvoidingView behavior="padding">
        <Tutorial>
          <Tutorial.Header text={currentStep.heading} />
          <Tutorial.Content>
            <View>
              <currentStep.Content
                requestLocation={requestLocation}
                marker={marker}
                setMarker={setMarker}
                image={image}
                setImage={setImage}
              />
              <Text style={{ fontSize: 14, paddingTop: 20 }}>
                Click Skip to jump to the end and complete the submission
                manually.
              </Text>
            </View>
          </Tutorial.Content>
          <Tutorial.Footer>
            <Button title="Skip" onPress={close} color={colors.accent} />
            <Button title="Cancel" onPress={cancel} color={colors.alert} />
            <currentStep.NextButton
              marker={marker}
              requestLocation={requestLocation}
              goToNextStep={goToNextStep}
              close={close}
            />
          </Tutorial.Footer>
        </Tutorial>
      </KeyboardAvoidingView>
    </Modal>
  );
}
