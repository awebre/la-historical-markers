import { Card, headerTextStyle, PhotoCarousel } from "components";
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
          <PhotoCarousel
            photos={
              marker.photos.length === 0
                ? [
                    {
                      fileName: marker.imageFileName ?? "",
                      fileGuid: marker.imageFileName ?? "",
                    },
                  ]
                : marker.photos
            }
          />
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
