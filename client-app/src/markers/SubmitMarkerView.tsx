import React, { useState } from "react";
import {
  StyleProp,
  Text,
  ViewStyle,
  StyleSheet,
  Button,
  ScrollView,
  View,
  Alert as RNAlert,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { Alert, Card, headerTextStyle, ImagePreviewPicker } from "components";
import { colors, confirm, url } from "utils";
import { useLocation } from "hooks";
import { MarkerDto, ImageSource, Location } from "types";
import SubmissionTutorialModal from "./SubmissionTutorialModal/SubmissionTutorialModal";
import MarkerForm from "./MarkerForm";

interface SubmitMarkerViewProps {
  cardStyles: StyleProp<ViewStyle>;
  cancel: () => void;
  onSuccess: (name: string) => void;
  updateMapMarker: (m: Location | null) => void;
}

export default function SubmitMarkerView({
  cardStyles,
  cancel,
  onSuccess,
  updateMapMarker,
}: SubmitMarkerViewProps) {
  const [tutorialVisible, setTutorialVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<ImageSource | null>(null);
  const [marker, setMarker] = useState<MarkerDto | null>(null);

  const { requestLocation, permissionGranted } = useLocation({
    location: marker,
    setLocation: (location) => {
      updateMapMarker(location);
      setMarker(marker ? { ...marker, ...location } : (location as MarkerDto));
    },
  });

  async function submitMarker() {
    setIsSubmitting(true);
    if (marker) {
      try {
        let base64Image;
        const localUri = image?.uri;
        if (localUri) {
          const { base64 } = await ImageManipulator.manipulateAsync(
            localUri,
            [{ resize: { height: 500 } }],
            { format: ImageManipulator.SaveFormat.PNG, base64: true }
          );

          base64Image = base64;
        }

        const resp = await fetch(`${url}/api/markers`, {
          method: "post",
          body: JSON.stringify({ base64Image, ...marker }),
        });
        if (resp.ok) {
          setIsSubmitting(false);
          onSuccess(marker?.name);
        } else {
          setError(
            "Your submission was not accepted. Please check that the Name and Description are both entered and that the location of the marker looks correct on the map above."
          );
        }
      } catch {
        setError(
          "Looks like your submission couldn't be completed. Please try again."
        );
      } finally {
        if (!isSubmitting) {
          setIsSubmitting(false);
        }
      }
    }
  }

  function onCancel() {
    confirm("Are you sure you want to cancel this submission?", cancel);
  }

  return (
    <View>
      <Card style={cardStyles}>
        <Card.Header>
          <Text style={styles.headerText}>Review Your Submission</Text>
        </Card.Header>
        <Card.Body style={styles.body}>
          <ScrollView style={{ paddingRight: 10 }}>
            {!error && (
              <Text
                style={{
                  paddingTop: 5,
                  paddingBottom: 5,
                  textAlign: "center",
                }}
              >
                {!permissionGranted
                  ? "You must allow location services in order to submit a new Marker. We use your location to report an approximate location of the marker."
                  : "Check that the above location and the information you entered is correct, then hit Submit."}
              </Text>
            )}
            {error !== "" && (
              <Alert alertText={error} cancel={() => setError("")} />
            )}
            <View style={{ paddingBottom: 10 }}>
              <Button
                title="Update Marker Location"
                onPress={requestLocation}
                disabled={isSubmitting}
              />
              <ImagePreviewPicker
                image={image}
                setImage={setImage}
                disabled={isSubmitting}
              />
            </View>
            {marker?.latitude && marker?.longitude ? (
              <MarkerForm
                marker={marker}
                setMarker={setMarker}
                editable={!isSubmitting}
              />
            ) : (
              <Text>
                Please update the marker location in order to enter the name and
                description.
              </Text>
            )}
            {isSubmitting && (
              <Text
                style={{
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                Saving your submission...
              </Text>
            )}
          </ScrollView>
        </Card.Body>
        <Card.Footer style={styles.footer}>
          <Button
            title="Cancel"
            onPress={onCancel}
            color={colors.alert}
            disabled={isSubmitting}
          />
          <Button
            title={isSubmitting ? "Submitting..." : "Submit"}
            onPress={submitMarker}
            color={colors.primary}
            disabled={!marker || isSubmitting}
          />
        </Card.Footer>
      </Card>
      <SubmissionTutorialModal
        marker={marker}
        setMarker={setMarker}
        visible={tutorialVisible}
        requestLocation={requestLocation}
        cancel={onCancel}
        close={() => setTutorialVisible(false)}
        image={image}
        setImage={setImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: { ...headerTextStyle },
  body: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  footer: {},
});
