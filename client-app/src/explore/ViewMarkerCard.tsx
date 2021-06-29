import React, { useState } from "react";
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
import { MarkerDto } from "types";
import { colors, humanizedDistance } from "utils";
import { photosUrl } from "utils/urls";
import ReportMarkerModal from "./ReportMarkerModal";
import { useSavedMarkers } from "hooks";
import { AddSavedMarkerModal } from "saved-markers";

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
  const { markers: savedMarkers, removeMarker } = useSavedMarkers();
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
            isSaved ? removeMarker(marker.id) : setSaveMarkerVisible(true)
          }
          title={isSaved ? "Remove" : "Save"}
          color={colors.accent}
        />
      </Card.Footer>
      <AddSavedMarkerModal
        visible={saveMarkerVisible}
        setVisible={setSaveMarkerVisible}
        marker={marker}
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
