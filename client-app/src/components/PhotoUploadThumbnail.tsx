import classNames from "classnames";
import { Image } from "expo-image";
import { usePhotoSelectionContext } from "photos/PhotoSelectionContext";
import { Alert, View } from "react-native";
import { useTailwind } from "tailwind-rn";
import { ImageSource } from "types";
import { url } from "utils";

import { FontAwesome } from "@expo/vector-icons";

export interface PhotoUploadThumbnail extends ImageSource {}

export default function PhotoUploadThumbnail(props: PhotoUploadThumbnail) {
  const tailwind = useTailwind();
  const { uri, guid, uploadState } = props;
  const { uploadPhoto, removePhoto } = usePhotoSelectionContext();

  return (
    <View
      style={tailwind(
        "relative w-36 h-36 m-2 border-brown border-4 rounded bg-gold"
      )}
    >
      <Image
        style={tailwind("flex-1")}
        contentFit="cover"
        source={props}
        enableLiveTextInteraction={true}
      />
      {uploadState === "error" && (
        <IconBadge icon="warning" onPress={handleError} />
      )}
      {uploadState === "uploading" && <IconBadge icon="refresh" />}
      {uploadState !== "uploading" && (
        <IconBadge icon="trash" onPress={promptDelete} />
      )}
    </View>
  );

  function handleError() {
    Alert.alert(
      "Photo Upload Issue",
      "We were unable to successfully upload your photo. Would you like to try again?",
      [{ text: "Cancel" }, { text: "Retry", onPress: () => uploadPhoto(props) }]
    );
  }

  function promptDelete() {
    Alert.alert(
      "Remove Photo",
      "Are you sure you would like to delete this photo?",
      [{ text: "Cancel" }, { text: "Delete", onPress: handleDelete }]
    );
  }

  function handleDelete() {
    try {
      if (guid) {
        fetch(`${url}/api/marker-photos/${guid}`, {
          method: "DELETE",
        });
      }
    } finally {
      removePhoto(props);
    }
  }
}

interface IconBadgeProps {
  icon: "warning" | "refresh" | "trash";
  onPress?: () => void;
}

function IconBadge({ icon, onPress }: IconBadgeProps) {
  const tailwind = useTailwind();
  return (
    <View
      style={tailwind(
        classNames(
          "absolute flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400",
          {
            "top-[-12px] right-[-12px]": icon !== "warning",
            "bg-yellow-400 bottom-3 left-3": icon === "warning",
            "bg-gray-400": icon === "refresh",
            "bg-red-400 ": icon === "trash",
          }
        )
      )}
    >
      <FontAwesome
        name={icon}
        style={tailwind("text-white")}
        size={16}
        onPress={onPress}
      />
    </View>
  );
}
