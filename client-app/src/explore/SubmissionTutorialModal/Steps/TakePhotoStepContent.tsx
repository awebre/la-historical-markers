import { ImagePreviewPicker } from "components";
import React from "react";
import { Text, View } from "react-native";
import { useTailwind } from "tailwind-rn";

export default function TakePhotoStepContent() {
  const tailwind = useTailwind();
  return (
    <View>
      <ImagePreviewPicker />
      <Text style={tailwind("text-lg pt-2")}>
        If you don't have an image or can't safely take a photo of the marker,
        that's okay! Just hit Next.
      </Text>
    </View>
  );
}
