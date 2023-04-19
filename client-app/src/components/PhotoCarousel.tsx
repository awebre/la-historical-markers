import classNames from "classnames";
import { useState } from "react";
import { Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useTailwind } from "tailwind-rn";
import { MarkerPhotoDto } from "types/markers/types";
import { photosUrl } from "utils/urls";

import ImagePreview from "./ImagePreview";

interface PhotoCarouselProps {
  photos: MarkerPhotoDto[];
}

export default function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const tailwind = useTailwind();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  return (
    <>
      {photos.length > 0 && (
        <PagerView
          initialPage={0}
          style={tailwind("w-full h-80")}
          onPageSelected={(e) => setSelectedPhotoIndex(e.nativeEvent.position)}
        >
          {photos.map((photo) => (
            <View style={tailwind("flex-1")} key={photo.fileGuid}>
              <ImagePreview
                source={{
                  uri: `${photosUrl}/${photo.fileName}`,
                }}
              />
            </View>
          ))}
        </PagerView>
      )}
      <View
        style={tailwind("flex flex-row items-center justify-center w-full")}
      >
        {photos.map((photo, i) => (
          <View
            key={i}
            style={tailwind(
              classNames(
                "flex items-center justify-center rounded-full w-2 h-2 m-2",
                {
                  "bg-gold w-2 h-2": i !== selectedPhotoIndex,
                  "bg-brown w-3 h-3": i === selectedPhotoIndex,
                }
              )
            )}
          ></View>
        ))}
      </View>
    </>
  );
}
