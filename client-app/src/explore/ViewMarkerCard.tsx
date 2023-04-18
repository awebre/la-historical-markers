import classNames from "classnames";
import { Card, headerTextStyle } from "components";
import { Image } from "expo-image";
import { useSavedMarkers } from "hooks";
import React, { useState } from "react";
import {
  Button,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import PagerView from "react-native-pager-view";
import { SavedMarkerModal } from "saved-markers";
import { useTailwind } from "tailwind-rn";
import { MarkerDto } from "types";
import { colors, humanizedDistance } from "utils";
import { photosUrl } from "utils/urls";

import ReportMarkerModal from "./ReportMarkerModal";

interface ViewMarkerCardProps {
  style: StyleProp<ViewStyle>;
  marker: MarkerDto;
  onCancel: () => void;
}

export default function ViewMarkerCard({
  style,
  marker,
  onCancel,
}: ViewMarkerCardProps) {
  const [reportVisible, setReportVisible] = useState(false);
  const [saveMarkerVisible, setSaveMarkerVisible] = useState(false);
  const { markers: savedMarkers } = useSavedMarkers();
  const savedMarker = savedMarkers.find((m) => m.id === marker.id);
  const tailwind = useTailwind();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  return (
    <Card style={[styles.card, style]}>
      <Card.Header style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardHeaderText}>{marker.name}</Text>
        </View>
        <Card.Badge text={humanizedDistance(marker.distance)} />
      </Card.Header>
      <Card.Body>
        <ScrollView>
          {marker.photos.length > 0 && (
            <PagerView
              initialPage={0}
              style={tailwind("w-full h-96")}
              onPageSelected={(e) =>
                setSelectedPhotoIndex(e.nativeEvent.position)
              }
            >
              {marker.photos.map((photo) => (
                <View style={tailwind("flex-1")}>
                  <Image
                    key={photo.fileGuid}
                    source={{
                      uri: `${photosUrl}/${photo.fileName}`,
                    }}
                    style={tailwind("flex-1 rounded-lg border-4 border-brown")}
                    contentFit="cover"
                    enableLiveTextInteraction={true}
                  />
                </View>
              ))}
            </PagerView>
          )}
          <View style={tailwind("flex flex-row justify-center w-full")}>
            {marker.photos.map((photo, i) => (
              <View
                style={tailwind(
                  classNames(
                    "flex items-center justify-center rounded-full w-6 h-6 m-2",
                    {
                      "bg-gold": i !== selectedPhotoIndex,
                      "bg-brown": i === selectedPhotoIndex,
                    }
                  )
                )}
              >
                <Text style={tailwind("text-white")}>{i + 1}</Text>
              </View>
            ))}
          </View>
          {marker.photos.length === 0 && marker.imageFileName && (
            <Image
              source={{
                uri: `${photosUrl}/${marker.imageFileName}`,
              }}
              contentFit="cover"
              enableLiveTextInteraction={true}
              style={[
                {
                  width: "100%",
                  aspectRatio: 1,
                },
                tailwind("mb-2 rounded-lg border-4 border-brown"),
              ]}
            />
          )}
          <Text>{marker.description}</Text>
        </ScrollView>
      </Card.Body>
      <Card.Footer>
        <Button
          onPress={() => setReportVisible(true)}
          title="Report"
          color={colors.alert}
        />
        <Button onPress={onCancel} title="Done" color={colors.primary} />
        <Button
          onPress={() => setSaveMarkerVisible(true)}
          title={savedMarker !== undefined ? "View Saved" : "Save"}
          color={colors.accent}
        />
      </Card.Footer>
      <SavedMarkerModal
        visible={saveMarkerVisible}
        setVisible={setSaveMarkerVisible}
        marker={
          savedMarker !== undefined
            ? savedMarker
            : {
                id: marker.id,
                name: marker.name,
                type: marker.type,
                latitude: marker.latitude,
                longitude: marker.longitude,
                categories: [],
              }
        }
      />
      <ReportMarkerModal
        markerId={marker.id}
        isVisible={reportVisible}
        close={() => setReportVisible(false)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: -5,
  },
  cardHeader: {},
  cardHeaderText: { ...headerTextStyle },
});
