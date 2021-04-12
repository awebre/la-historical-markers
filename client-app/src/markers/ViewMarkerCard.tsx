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
import Constants from "expo-constants";
import { Card, headerTextStyle } from "components";
import { MarkerDto } from "types";
import { colors, humanizedDistance } from "utils";
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
  return (
    <Card style={[styles.card, style]}>
      <Card.Header style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardHeaderText}>{marker.name}</Text>
        </View>
        <View style={styles.milesBadge}>
          <Text style={styles.milesText}>
            {humanizedDistance(marker.distance)}
          </Text>
        </View>
      </Card.Header>
      <Card.Body>
        <ScrollView>
          {marker.imageFileName && (
            <Image
              source={{
                uri: `${Constants.manifest.extra.imageBaseUrl}/${marker.imageFileName}`,
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
  milesText: {
    color: colors.lightText,
    fontWeight: "bold",
  },
  milesBadge: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderRadius: 2,
    margin: -5, //ew, negative margins
    paddingLeft: 5,
    paddingRight: 5,
  },
});
