import { Image, ImageSource, ImageStyle } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import {
  DeviceMotion,
  DeviceMotionMeasurement,
  DeviceMotionOrientation,
} from "expo-sensors";
import { useEffect, useState } from "react";
import { Modal, View } from "react-native";
import { useTailwind } from "tailwind-rn";

import { FontAwesome } from "@expo/vector-icons";

import IconBadge from "./IconBadge";

interface ImagePreviewProps {
  source: ImageSource;
  style?: ImageStyle;
}

export default function ImagePreview({ source, style }: ImagePreviewProps) {
  const tailwind = useTailwind();
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const tailwindStyles = tailwind(
    "relative flex-1 rounded-lg border-4 border-brown"
  );
  const mergedStyle = style ? [style, tailwindStyles] : tailwindStyles;
  return (
    <>
      <View style={mergedStyle}>
        <Image
          source={source}
          style={tailwind("flex-1")}
          contentFit="cover"
          enableLiveTextInteraction={true}
        />
        <IconBadge
          icon="expand"
          className="bg-gray-600 top-3 right-3 opacity-90"
          onPress={() => setFullScreen(true)}
        />
      </View>
      <Modal visible={fullScreen}>
        <FullScreenImage source={source} dismiss={() => setFullScreen(false)} />
      </Modal>
    </>
  );
}

interface FullScreenImageProps {
  source: ImageSource;
  dismiss: () => void;
}

function FullScreenImage({ source, dismiss }: FullScreenImageProps) {
  const originalUri = source.uri ?? "";
  const tailwind = useTailwind();
  const [uri, setUri] = useState(originalUri);
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    const sub = DeviceMotion.addListener(handleOrientationChange);
    () => DeviceMotion.removeSubscription(sub);
  }, []);

  function handleOrientationChange(e: DeviceMotionMeasurement) {
    const { orientation } = e;
    const newRotation =
      orientation === DeviceMotionOrientation.LeftLandscape
        ? 90
        : orientation === DeviceMotionOrientation.UpsideDown
        ? 180
        : orientation === DeviceMotionOrientation.RightLandscape
        ? 270
        : 0;

    if (rotation !== newRotation) {
      setRotation(newRotation);
    }
  }

  useEffect(() => {
    if (rotation === 0) {
      setUri(originalUri);
      return;
    }
    ImageManipulator.manipulateAsync(
      uri,
      [{ rotate: rotation }], //TODO: probably want to pick the larger dimension and pair that one down instead of assuming vertical?
      {
        format: ImageManipulator.SaveFormat.PNG,
        compress: 0,
      }
    ).then((s) => setUri(s.uri));
  }, [rotation]);

  return (
    <View style={tailwind("relative flex-1 bg-black")}>
      <Image
        source={{ uri }}
        style={tailwind("flex-1")}
        contentFit="contain"
        enableLiveTextInteraction={true}
      />
      <View
        style={tailwind(
          "absolute top-16 right-4 h-12 w-12 flex items-center justify-center rounded-full bg-black opacity-60"
        )}
      >
        <FontAwesome
          name="times"
          style={tailwind("text-white")}
          size={26}
          onPress={dismiss}
        />
      </View>
    </View>
  );
}
