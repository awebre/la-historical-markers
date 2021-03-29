import React from "react";
import { Text, ScrollView, View, StyleSheet, Button } from "react-native";
import { Card, headerTextStyle } from "components";
import { MarkerDto } from "types";
import { colors, humanizedDistance } from "utils";

interface ViewMarkerCardProps {
  marker: MarkerDto;
  onCancel: () => void;
}

export default function ViewMarkerCard({
  marker,
  onCancel,
}: ViewMarkerCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Header style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>{marker.name}</Text>
        <View style={styles.milesBadge}>
          <Text style={styles.milesText}>
            {humanizedDistance(marker.distance)}
          </Text>
        </View>
      </Card.Header>
      <Card.Body>
        <ScrollView>
          <Text>{marker.description}</Text>
        </ScrollView>
      </Card.Body>
      <Card.Footer>
        <Button onPress={onCancel} title="Done" color={colors.accent} />
      </Card.Footer>
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
