import React, { useState, useEffect } from "react";
import {
  StyleProp,
  Text,
  ViewStyle,
  StyleSheet,
  Button,
  ScrollView,
  View,
  Platform,
  Image,
  Alert as ExpoAlert,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Alert, Card, headerTextStyle } from "components";
import { FormGroup } from "components/forms";
import { colors, url } from "utils";
import { useLocation } from "hooks";
import { MarkerDto } from "types";

interface SubmitMarkerViewProps {
  cardStyles: StyleProp<ViewStyle>;
  cancel: () => void;
  onSuccess: () => void;
  marker: MarkerDto | null;
  setMarker: (m: MarkerDto) => void;
}

interface ImageSource {
  uri: string;
  height: number;
  width: number;
}

const imageHeight = 150;
export default function SubmitMarkerView({
  cardStyles,
  cancel,
  onSuccess,
  marker,
  setMarker,
}: SubmitMarkerViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<ImageSource | null>(null);
  const [imageWidth, setImageWidth] = useState<number>(0);

  const { requestLocation, permissionGranted } = useLocation({
    location: marker,
    setLocation: (location) => {
      setMarker(
        marker ? { ...marker, ...location } : ({ ...location } as MarkerDto)
      );
    },
  });

  useEffect(() => {
    if (image !== null) {
      const widthByHeight = image.width / image.height;
      const newWidth = widthByHeight * imageHeight;
      if (newWidth !== imageWidth) {
        setImageWidth(newWidth);
      }
    }
  }, [image]);

  async function pickImage() {
    ExpoAlert.alert("Select Image", "How would you like to select the image?", [
      {
        text: "Camera Roll",
        onPress: async () => {
          if (Platform.OS !== "web") {
            const {
              status,
            } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              alert("Camera roll permissions are required to select an image.");
            }
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            exif: false,
          });
          if (!result.cancelled) {
            const { uri, width, height } = result;
            setImage({ uri, width, height });
          }
        },
      },
      {
        text: "Take Photo",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            alert("Camera permissions are required to take a picture.");
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            exif: false,
          });
          if (!result.cancelled) {
            const { uri, width, height } = result;
            setImage({ uri, width, height });
          }
        },
      },
    ]);
  }

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
          onSuccess();
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

  return (
    <View>
      <Card style={cardStyles}>
        <Card.Header>
          <Text style={styles.headerText}>Submit a New Historical Marker</Text>
        </Card.Header>
        <Card.Body style={styles.body}>
          <ScrollView style={{ paddingRight: 10 }}>
            {!error && (
              <Text
                style={{
                  paddingTop: 5,
                  paddingBottom: 5,
                }}
              >
                {!permissionGranted
                  ? "You must allow location services in order to submit a new Marker. We use your location to report an approximate location of the marker."
                  : 'Walk up to the marker and click "Update Marker Location" to set the location of the marker. Your submission will be reviewed for accuracy before it will become available within the app.'}
              </Text>
            )}
            {error !== "" && (
              <Alert alertText={error} cancel={() => setError("")} />
            )}
            <View style={{ paddingBottom: 10 }}>
              <Button
                title="Update Marker Location"
                onPress={requestLocation}
                color={colors.primary}
                disabled={isSubmitting}
              />

              <View style={styles.thumbnailContainer}>
                {image && (
                  <Image
                    source={image}
                    style={{ height: imageHeight, width: imageWidth }}
                  />
                )}
              </View>
              <View style={styles.imageButtonContainer}>
                <Button
                  title={`${!image ? "Add" : "Update"} Image`}
                  onPress={pickImage}
                  color={colors.accent}
                  disabled={isSubmitting}
                />
                {image && (
                  <Button
                    title="Clear Image"
                    onPress={() => setImage(null)}
                    color={colors.alert}
                    disabled={isSubmitting}
                  />
                )}
              </View>
            </View>
            {marker?.latitude && marker?.longitude ? (
              <>
                <FormGroup
                  label="Name:"
                  value={marker?.name}
                  onChangeText={(name) =>
                    setMarker(
                      marker ? { ...marker, name } : ({ name } as MarkerDto)
                    )
                  }
                  editable={!isSubmitting}
                  placeholder="Skirmish of Boutte Station"
                />
                <FormGroup
                  label="Description:"
                  value={marker?.description}
                  onChangeText={(description) =>
                    setMarker(
                      marker
                        ? { ...marker, description }
                        : ({ description } as MarkerDto)
                    )
                  }
                  containerStyle={{ flexDirection: "column" }}
                  placeholder="Union train with sixty men..."
                  multiline={true}
                  editable={!isSubmitting}
                  inputStyle={{ height: 100 }}
                />
              </>
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
            onPress={cancel}
            color={colors.accent}
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
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: { ...headerTextStyle },
  body: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  thumbnailContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 5,
  },
  imageButtonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
