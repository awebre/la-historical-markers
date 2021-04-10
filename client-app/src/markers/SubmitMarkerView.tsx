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
import { v4 } from "uuid";
import Constants from "expo-constants";
//@ts-ignore - eventually we should uplaod directly to the submission function instead
import { EAzureBlobStorageImage } from "react-native-azure-blob-storage";
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

  useEffect(() => {
    console.log(Constants.manifest.extra);
    const { account, container, key } = Constants.manifest.extra;
    EAzureBlobStorageImage.configure(account, key, container);
  }, []);

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

  return (
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
            />

            {image && (
              <View style={styles.thumbnailContainer}>
                <Image
                  source={image}
                  style={{ height: imageHeight, width: imageWidth }}
                />
              </View>
            )}
            <View style={styles.imageButtonContainer}>
              <Button
                title={`${!image ? "Add" : "Update"} Image`}
                onPress={pickImage}
                color={colors.accent}
              />
              {image && (
                <Button
                  title="Clear Image"
                  onPress={() => setImage(null)}
                  color={colors.alert}
                />
              )}
            </View>
          </View>
          {permissionGranted && (
            <>
              <FormGroup
                label="Name:"
                value={marker?.name}
                onChangeText={(name) =>
                  setMarker(
                    marker ? { ...marker, name } : ({ name } as MarkerDto)
                  )
                }
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
              />
            </>
          )}
        </ScrollView>
      </Card.Body>
      <Card.Footer style={styles.footer}>
        <Button title="Cancel" onPress={cancel} color={colors.accent} />
        <Button
          title="Submit"
          onPress={async () => {
            let name = "";
            if (marker) {
              try {
                const localUri = image?.uri;
                if (localUri) {
                  const guid = v4();
                  name = await EAzureBlobStorageImage.uploadFile({
                    filePath: localUri,
                    contentType: "image/png",
                    fileName: `${guid}.png`,
                  });
                }

                const resp = await fetch(`${url}/api/markers`, {
                  method: "post",
                  body: JSON.stringify({ imageFileName: name, ...marker }),
                });
                if (resp.ok) {
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
              }
            }
          }}
          color={colors.primary}
          disabled={!marker}
        />
      </Card.Footer>
    </Card>
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
  },
  imageButtonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
