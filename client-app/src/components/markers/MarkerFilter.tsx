import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "utils";
import { getMarkerColor, getMarkerTypeDescription } from "markers/utils";
import { MarkerType } from "types";
import MarkerIconSvg from "./MarkerIconSvg";

const allFilters = [
  {
    id: MarkerType.official,
    name: getMarkerTypeDescription(MarkerType.official),
    isSelected: true,
  },
  {
    id: MarkerType.other,
    name: getMarkerTypeDescription(MarkerType.other),
    isSelected: true,
  },
];

export default function MarkerFilter() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(allFilters);
  const toggleShowFilter = () => setShowFilters(!showFilters);
  const toggleFilter = (id: MarkerType) => {
    const otherFilters = filters.filter((f) => f.id !== id);
    const selectedFilter = filters.find((f) => f.id === id);
    if (!selectedFilter) {
      return;
    }
    const updatedFilter = {
      ...selectedFilter,
      isSelected: !selectedFilter.isSelected,
    };
    const updated = [updatedFilter, ...otherFilters];
    console.log("updated", updated);
    const sorted = [updatedFilter, ...otherFilters].sort((a, b) => a.id - b.id);
    console.log("sorted", sorted);
    setFilters(sorted);
  };
  return (
    <>
      <TouchableOpacity
        style={[
          styles.filterButton,
          {
            backgroundColor: showFilters ? colors.primaryDark : colors.primary,
          },
        ]}
        onPress={toggleShowFilter}
        activeOpacity={1}
      >
        <FontAwesome5 name="filter" color="white" />
      </TouchableOpacity>
      {showFilters && (
        <View style={styles.filterContainer}>
          <View style={styles.filterTitleContainer}>
            <Text style={styles.filterTitle}>Filter Signs by Type</Text>
          </View>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={styles.filterRow}
              onPress={() => toggleFilter(filter.id)}
            >
              <View style={styles.filterLegend}>
                <MarkerIconSvg color={getMarkerColor(filter.id)} />
                <Text style={styles.filterName}>{filter.name}</Text>
              </View>
              {filter.isSelected && (
                <FontAwesome5 name="check" color={colors.accent} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    top: 50,
    right: 25,
    position: "absolute",
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  filterContainer: {
    position: "absolute",
    top: 100,
    right: 25,
    zIndex: 1,
    backgroundColor: "white",
    padding: 10,
    marginTop: 2,
    borderRadius: 5,
  },
  filterTitleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 24,
    fontWeight: "900",
  },
  filterRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  filterLegend: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  filterName: {
    fontSize: 15,
    paddingLeft: 5,
  },
});
