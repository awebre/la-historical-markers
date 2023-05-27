import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { ImageSource } from "types";
import { PostPhotoResponse } from "types/markers/types";
import { getFileName, url } from "utils";

interface PhotoSelectionContext {
  photos: ImageSource[];
  selectPhotos: () => void;
  removePhoto: (photo: ImageSource) => void;
  uploadPhoto: (photo: ImageSource) => Promise<void>;
}

const PhotoSelectionContext = React.createContext<PhotoSelectionContext | null>(
  null
);
export default PhotoSelectionContext;

export function usePhotoSelectionContext() {
  const context = useContext(PhotoSelectionContext);
  if (context === null) {
    throw Error(
      "PhotoSelectionContext must be used in the context of the PhotoSelectionProvider"
    );
  }
  return context;
}

interface PhotoSelectionProviderProps {
  children: React.ReactNode;
}

const imagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsMultipleSelection: true,
  selectionLimit: 10,
  orderedSelection: true,
  exif: false,
};

export function PhotoSelectionProvider({
  children,
}: PhotoSelectionProviderProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<ImageSource[]>([]);

  function updatePhoto(photo: ImageSource) {
    setSelectedPhotos((prev) =>
      prev.map((p) => (p.uri === photo.uri ? photo : p))
    );
  }

  function removePhoto(photo: ImageSource) {
    setSelectedPhotos((prev) => prev.filter((p) => p.uri !== photo.uri));
  }

  function selectPhotos() {
    Alert.alert("Select Photos", "How would you like to select your photos?", [
      {
        text: "Camera Roll",
        onPress: async () => {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            alert("Camera roll permissions are required to select an image.");
          }
          const result = await ImagePicker.launchImageLibraryAsync(
            imagePickerOptions
          );
          addPhotosFromResult(result);
        },
      },
      {
        text: "Take Photo",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            alert("Camera permissions are required to take a picture.");
          }
          const result = await ImagePicker.launchCameraAsync(
            imagePickerOptions
          );
          addPhotosFromResult(result);
        },
      },
    ]);
  }

  function addPhotosFromResult(result: ImagePicker.ImagePickerResult) {
    if (!result.canceled) {
      setSelectedPhotos((prev) =>
        prev.concat(
          result.assets.map((a) => ({ ...a, uploadState: "pending" }))
        )
      );
    }
  }

  async function uploadPhoto(image: ImageSource) {
    updatePhoto({ ...image, uploadState: "uploading" });
    try {
      const png = await ImageManipulator.manipulateAsync(image.uri, [], {
        format: ImageManipulator.SaveFormat.PNG,
        compress: 0,
      });

      const filename = getFileName(png.uri);

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
        updatePhoto({
          ...image,
          guid: photoResponse.photoGuid,
          uploadState: "success",
        });
      } else {
        updatePhoto({ ...image, uploadState: "error" });
      }
    } catch {
      updatePhoto({ ...image, uploadState: "error" });
    }
  }

  useEffect(() => {
    const pendingPhotos = selectedPhotos.filter(
      (x) => x.uploadState === "pending"
    );

    pendingPhotos.forEach((photo) => {
      uploadPhoto(photo);
    });
  }, [selectedPhotos]);

  return (
    <PhotoSelectionContext.Provider
      value={{ photos: selectedPhotos, selectPhotos, removePhoto, uploadPhoto }}
    >
      {children}
    </PhotoSelectionContext.Provider>
  );
}
