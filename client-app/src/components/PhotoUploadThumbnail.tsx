import classNames from "classnames";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import { useEffect, useRef, useState } from "react";
import { Alert, View } from "react-native";
import { useTailwind } from "tailwind-rn";
import { ImageSource } from "types";
import { PostPhotoResponse } from "types/markers/types";
import { url } from "utils";

import { FontAwesome } from "@expo/vector-icons";

export interface PhotoUploadThumbnail extends ImageSource {
  setPhotoGuid: (uri: string, guid: string) => void;
  removePhoto: (uri: string) => void;
}

export default function PhotoUploadThumbnail(props: PhotoUploadThumbnail) {
  const tailwind = useTailwind();
  const { uri, guid, setPhotoGuid, removePhoto } = props;
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    uploadPhoto();
  }, [uri]);

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
      {hasError && <IconBadge icon="warning" onPress={handleError} />}
      {isLoading && <IconBadge icon="refresh" />}
      {(guid || hasError) && <IconBadge icon="trash" onPress={promptDelete} />}
    </View>
  );

  function handleError() {
    Alert.alert(
      "Photo Upload Issue",
      "We were unable to successfully upload your photo. Would you like to try again?",
      [{ text: "Cancel" }, { text: "Retry", onPress: () => uploadPhoto() }]
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
      removePhoto(uri);
    }
  }

  async function uploadPhoto() {
    if (!uri || !!guid) {
      return;
    }

    try {
      setIsLoading(true);
      const png = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { height: props.height > 1000 ? 1000 : props.height } }],
        {
          format: ImageManipulator.SaveFormat.PNG,
          compress: 0,
        }
      );

      const filename = png.uri.split("/").pop();
      const formData = new FormData();
      formData.append("file", {
        type: "img/png",
        uri: png.uri,
        name: filename,
      } as unknown as Blob);
      const response = await fetch(`${url}/api/marker-photos`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const photoResponse: PostPhotoResponse = await response.json();
        setPhotoGuid(uri, photoResponse.photoGuid);
        console.log(photoResponse.photoGuid);
        setHasError(false);
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
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
