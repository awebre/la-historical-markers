import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Button, Platform, StyleSheet, View } from "react-native";
import { useTailwind } from "tailwind-rn";
import { ImageSource } from "types";
import { colors } from "utils";

import PhotoUploadThumbnail from "./PhotoUploadThumbnail";

interface ImagePreviewPickerProps {
  images: ImageSource[] | null;
  setImages: (Images: ImageSource[] | null) => void;
  disabled?: boolean;
  imageHeight?: number;
  fileGuids: string[];
  setFileGuids: (guids: string[]) => void;
}

export default function ImagePreviewPicker({
  images,
  setImages,
  fileGuids,
  setFileGuids,
  disabled = false,
}: ImagePreviewPickerProps) {
  const tailwind = useTailwind();

  async function pickImage() {
    Alert.alert("Select Images", "How would you like to select your images?", [
      {
        text: "Camera Roll",
        onPress: async () => {
          if (Platform.OS !== "web") {
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              alert("Camera roll permissions are required to select an image.");
            }
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 10,
            orderedSelection: true,
            exif: false,
          });
          if (!result.canceled) {
            const existingImages = images ?? [];
            setImages(existingImages.concat(result.assets));
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
            allowsMultipleSelection: true,
            selectionLimit: 10,
            orderedSelection: true,
            exif: false,
          });
          if (!result.canceled) {
            if (result.assets) {
              const existingImages = images ?? [];
              setImages(existingImages.concat(result.assets));
            }
          }
        },
      },
    ]);
  }

  function setPhotoGuid(guid: string) {
    setFileGuids([...fileGuids, guid]);
  }

  function removePhoto(uri: string, guid?: string) {
    setImages(images?.filter((i) => i.uri !== uri) ?? []);
    if (!guid) {
      setFileGuids(fileGuids.filter((g) => g !== guid));
    }
  }

  return (
    <>
      <View style={tailwind("flex flex-row flex-wrap justify-evenly mt-4")}>
        {images &&
          images.map((i) => (
            <PhotoUploadThumbnail
              key={i.uri}
              {...i}
              setPhotoGuid={setPhotoGuid}
              removePhoto={removePhoto}
            />
          ))}
      </View>

      <View style={styles.imageButtonContainer}>
        <Button
          title={"Add Images"}
          onPress={pickImage}
          color={colors.accent}
          disabled={disabled}
        />
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
