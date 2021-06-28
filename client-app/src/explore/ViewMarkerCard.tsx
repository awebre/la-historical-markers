import React, { useContext, useState } from "react";
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  Button,
  Image,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Card, headerTextStyle } from "components";
import { MarkerDto, SavedMarker } from "types";
import { colors, humanizedDistance } from "utils";
import { photosUrl } from "utils/urls";
import ReportMarkerModal from "./ReportMarkerModal";
import { useSavedMarkers } from "hooks";

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
  const { markers: savedMarkers, addMarker, removeMarker } = useSavedMarkers();
  const isSaved = savedMarkers.find((m) => m.id === marker.id) !== undefined;
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
          {marker.imageFileName && (
            <Image
              source={{
                uri: `${photosUrl}/${marker.imageFileName}`,
              }}
              style={{
                width: "100%",
                aspectRatio: 1,
                resizeMode: "contain",
                marginBottom: 10,
              }}
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
          onPress={() =>
            isSaved
              ? removeMarker(marker.id)
              : addMarker({
                  id: marker.id,
                  name: marker.name,
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                  type: marker.type,
                })
          }
          title={isSaved ? "Remove" : "Save"}
          color={colors.accent}
        />
      </Card.Footer>
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
