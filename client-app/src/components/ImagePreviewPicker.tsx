import { usePhotoSelectionContext } from "photos/PhotoSelectionContext";
import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { useTailwind } from "tailwind-rn";
import { colors } from "utils";

import PhotoUploadThumbnail from "./PhotoUploadThumbnail";

interface ImagePreviewPickerProps {
  disabled?: boolean;
}

export default function ImagePreviewPicker({
  disabled = false,
}: ImagePreviewPickerProps) {
  const tailwind = useTailwind();
  const { selectPhotos, photos } = usePhotoSelectionContext();

  return (
    <>
      <View style={tailwind("flex flex-row flex-wrap justify-evenly mt-4")}>
        {photos &&
          photos.map((i) => <PhotoUploadThumbnail key={i.uri} {...i} />)}
      </View>

      <View style={styles.imageButtonContainer}>
        <Button
          title={"Add Images"}
          onPress={selectPhotos}
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
