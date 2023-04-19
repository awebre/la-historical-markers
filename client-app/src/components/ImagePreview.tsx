import { Image, ImageSource, ImageStyle } from "expo-image";
import { useState } from "react";
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
        <View style={tailwind("relative flex-1 bg-black")}>
          <Image
            source={source}
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
              onPress={() => setFullScreen(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
