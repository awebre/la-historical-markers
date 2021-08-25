import React from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { SavedMarker } from "types";
import { colors } from "utils";
import { getIconFromCategory } from "./utils";

type CategoryGroup = {
  key: string;
  type: "Visited" | "Authored" | "For Later" | "Custom";
  label: string;
};

type SavedMarkerStatsProps = {
  markers: SavedMarker[];
};

export default function SavedMarkerStats({ markers }: SavedMarkerStatsProps) {
  const allCategories = markers
    .flatMap((m) => m.categories)
    .map((c) => ({
      key: c.type !== "Custom" ? c.type : `${c.type}-${c.value}}`,
      type: c.type,
      label: c.type !== "Custom" ? c.type : c.value,
    }));
  const distinctKeys = [...new Set(allCategories.map((c) => c.key))];
  const categories = distinctKeys
    .map((k) => allCategories.find((c) => c.key == k))
    .filter((c) => c !== undefined) as CategoryGroup[];
  const categoryStats = categories
    .map((c) => {
      const markerCount = markers.filter(
        (m) =>
          m.categories.find(
            (cat) =>
              cat.type === c.type &&
              (c.type !== "Custom" ||
                cat.type !== "Custom" ||
                c.label === cat.value)
          ) !== undefined
      )?.length;
      return {
        key: c.key,
        markerCount,
        category: c.type,
        label: c.label,
      };
    })
    .sort((a, b) => b.markerCount - a.markerCount)
    .sort((a, b) => {
      if (a.category !== "Custom" && b.category === "Custom") {
        return -1;
      } else if (a.category === "Custom" && b.category !== "Custom") {
        return 1;
      }
      return 0;
    });

  return (
    <ScrollView
      style={{ height: "25%", backgroundColor: colors.mediumBackground }}
      contentContainerStyle={styles.statsContainer}
    >
      {categoryStats &&
        categoryStats.length > 0 &&
        categoryStats.map((s) => (
          <View key={s.key} style={styles.stat}>
            <View style={styles.statIcon}>
              <FontAwesome5
                name={getIconFromCategory({
                  type: s.category,
                  value: "",
                })}
                size={40}
                color={colors.primary}
                backgroundColor={colors.lightBackground}
              />
              <Text>{s.label}</Text>
            </View>
            <View style={styles.statBubble}>
              <Text style={{ fontSize: 16, color: colors.white }}>
                {s.markerCount}
              </Text>
            </View>
          </View>
        ))}
      {(!categoryStats || categoryStats.length < 1) && (
        <View
          style={{
            marginTop: 50,
          }}
        >
          <Text
            style={{ fontSize: 16, fontWeight: "bold", color: colors.primary }}
          >
            Nothing to see here yet...
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mediumBackground,
  },
  stat: {
    minWidth: "25%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    margin: 10,
    padding: 10,
    color: colors.black,
    backgroundColor: colors.lightBackground,
  },
  statIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  statBubble: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.accent,
  },
});
