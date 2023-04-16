import { ImagePreviewPicker } from "components";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { useTailwind } from "tailwind-rn";

import { StepContentProps } from "./types";

export default function TakePhotoStepContent({
  images: image,
  setImages: setImage,
}: StepContentProps) {
  const tailwind = useTailwind();
  return (
    <View>
      <ImagePreviewPicker
        images={image}
        setImages={setImage}
        imageHeight={Dimensions.get("window").height - 600}
      />
      <Text style={tailwind("text-lg pt-2")}>
        If you don't have an image or can't safely take a photo of the marker,
        that's okay! Just hit Next.
      </Text>
    </View>
  );
}
