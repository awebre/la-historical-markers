import { ImagePreviewPicker } from "components";
import React from "react";
import { View, Text, Dimensions } from "react-native";
import { StepContentProps } from "./types";

export default function TakePhotoStepContent({
  image,
  setImage,
}: StepContentProps) {
  return (
    <View>
      <ImagePreviewPicker
        image={image}
        setImage={setImage}
        imageHeight={Dimensions.get("window").height - 600}
      />
      <Text style={{ fontSize: 20 }}>
        Click Add Image to select an image or take a photo of the marker.
      </Text>
      <Text style={{ fontSize: 16, paddingTop: 10 }}>
        If you don't have an image or can't safely take a photo of the marker,
        that's okay! Just hit Next.
      </Text>
    </View>
  );
}
