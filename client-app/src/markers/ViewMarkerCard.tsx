import React from "react";
import { Text, ScrollView, View, StyleSheet, Button } from "react-native";
import { Card } from "components";
import { MarkerDto } from "markers";
import { distanceToMiles } from "utils";

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
        <View style={styles.milesBade}>
          <Text style={styles.milesText}>
            {distanceToMiles(marker.distance)} miles
          </Text>
        </View>
      </Card.Header>
      <ScrollView style={styles.content}>
        <Text>{marker.description}</Text>
      </ScrollView>
      <Button onPress={onCancel} title="Done" color="#dab574" />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: -5,
    backgroundColor: "#f9f2ec",
  },
  cardHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#996633",
  },
  cardHeaderText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  milesText: {
    color: "white",
    fontWeight: "bold",
  },
  milesBade: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#dab574",
    borderRadius: 2,
    margin: -5, //ew, negative margins
    paddingLeft: 5,
    paddingRight: 5,
  },
  content: {
    padding: 10,
  },
});
