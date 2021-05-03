import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "utils";
import { getMarkerColor, getMarkerTypeDescription } from "markers/utils";
import { MarkerType } from "types";
import MarkerIconSvg from "./MarkerIconSvg";

type MarkerFilterProps = {
  filters: MarkerFilter[];
  setFilters: (filters: MarkerFilter[]) => void;
};

type MarkerFilter = {
  id: MarkerType;
  name: string;
  isSelected: boolean;
};

export default function MarkerFilter({
  filters,
  setFilters,
}: MarkerFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const toggleShowFilter = () => setShowFilters(!showFilters);
  const toggleFilter = (id: MarkerType) => {
    const otherFilters = filters.filter((f) => f.id !== id);
    const selectedFilter = filters.find((f) => f.id === id);
    if (
      !selectedFilter ||
      (selectedFilter.isSelected && !otherFilters.find((f) => f.isSelected)) //if action would result in no filter's selected, do nothing
    ) {
      return;
    }
    const updatedFilter = {
      ...selectedFilter,
      isSelected: !selectedFilter.isSelected,
    };
    setFilters([updatedFilter, ...otherFilters].sort((a, b) => a.id - b.id));
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
    fontWeight: "700",
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
