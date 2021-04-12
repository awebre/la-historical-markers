import React, { useEffect, useState } from "react";
import { Alert, Platform, View, Button, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageSource } from "types";
import { colors } from "utils";

interface ImagePreviewPickerProps {
  image: ImageSource | null;
  setImage: (image: ImageSource | null) => void;
  disabled?: boolean;
  imageHeight?: number;
}

export default function ImagePreviewPicker({
  image,
  setImage,
  disabled = false,
  imageHeight = 150,
}: ImagePreviewPickerProps) {
  const [imageWidth, setImageWidth] = useState<number>(0);

  useEffect(() => {
    //TODO: this should also handle a maxWidth
    if (image !== null) {
      const widthByHeight = image.width / image.height;
      const newWidth = widthByHeight * imageHeight;
      if (newWidth !== imageWidth) {
        setImageWidth(newWidth);
      }
    }
  }, [image, imageHeight]);

  async function pickImage() {
    Alert.alert("Select Image", "How would you like to select the image?", [
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
    <>
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
          disabled={disabled}
        />
        {image && (
          <Button
            title="Clear Image"
            onPress={() => setImage(null)}
            color={colors.alert}
            disabled={disabled}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
