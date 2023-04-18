import { usePhotoSelectionContext } from "photos/PhotoSelectionContext";
import { Alert, View } from "react-native";
import { useTailwind } from "tailwind-rn";
import { ImageSource } from "types";
import { url } from "utils";

import IconBadge from "./IconBadge";
import ImagePreview from "./ImagePreview";

export interface PhotoUploadThumbnail extends ImageSource {}

export default function PhotoUploadThumbnail(props: PhotoUploadThumbnail) {
  const tailwind = useTailwind();
  const { uri, guid, uploadState } = props;
  const { uploadPhoto, removePhoto } = usePhotoSelectionContext();

  return (
    <View style={tailwind("relative w-36 h-36 m-2 rounded-lg bg-gold")}>
      <ImagePreview source={props} />
      {uploadState === "error" && (
        <IconBadge
          icon="warning"
          className="top-[-12px] right-[-12px]"
          onPress={handleError}
        />
      )}
      {uploadState === "uploading" && (
        <IconBadge icon="refresh" className="top-3 left-3" />
      )}
      {uploadState !== "uploading" && (
        <IconBadge
          icon="trash"
          className="top-[-12px] right-[-12px]"
          onPress={promptDelete}
        />
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
