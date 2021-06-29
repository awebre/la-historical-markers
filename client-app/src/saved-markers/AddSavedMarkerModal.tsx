import React, { useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { MarkerDto, SavedMarker, SavedMarkerCategory } from "types";
import { colors } from "utils";
import { useSavedMarkers } from "hooks";

type AddSavedMarkerModalProps = {
  marker: MarkerDto;
  visible: boolean;
  setVisible: (v: boolean) => void;
};

export default function AddSavedMarkerModal({
  marker,
  visible,
  setVisible,
}: AddSavedMarkerModalProps) {
  const [savedMarker, setSavedMarker] = useState<SavedMarker>({
    id: marker.id,
    name: marker.name,
    type: marker.type,
    latitude: marker.latitude,
    longitude: marker.longitude,
    categories: [],
  });

  const { addMarker } = useSavedMarkers();

  const updateCategories = (category: SavedMarkerCategory) => {
    const index = savedMarker.categories.findIndex((c) => c == category);
    if (index !== -1) {
      const newCategories = savedMarker.categories.filter(
        (c) => c !== category
      );
      setSavedMarker({ ...savedMarker, categories: newCategories });
    } else {
      const newCategories = [...savedMarker.categories, category];
      setSavedMarker({ ...savedMarker, categories: newCategories });
    }
  };

  return (
    <Modal visible={visible}>
      <SafeAreaView style={styles.containers}>
        <Text style={styles.heading}>
          How would you categorize {marker.name}?
        </Text>
        <Text>You may select more than one.</Text>
        <View style={styles.categories}>
          <CategorySelector
            category="Visited"
            selectedCategories={savedMarker.categories}
            updateCategories={updateCategories}
          />
          <CategorySelector
            category="Authored"
            selectedCategories={savedMarker.categories}
            updateCategories={updateCategories}
          />
          <CategorySelector
            category="Save For Later"
            selectedCategories={savedMarker.categories}
            updateCategories={updateCategories}
          />
        </View>
        <View style={styles.actions}>
          <Button
            title="Cancel"
            color={colors.alert}
            onPress={() => setVisible(false)}
          />
          <Button
            title="Save"
            color={colors.primary}
            onPress={() => {
              addMarker(savedMarker);
              setVisible(false);
            }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

type CategorySelectorProps = {
  category: SavedMarkerCategory;
  selectedCategories: SavedMarkerCategory[];
  updateCategories: (c: SavedMarkerCategory) => void;
};

const CategorySelector = ({
  category,
  selectedCategories,
  updateCategories,
}: CategorySelectorProps) => {
  const isActive = selectedCategories.findIndex((c) => c === category) !== -1;
  const icon =
    category === "Visited"
      ? "map-marked"
      : category === "Authored"
      ? "feather-alt"
      : category === "Save For Later"
      ? "bookmark"
      : "list-alt";
  return (
    <TouchableOpacity
      style={[styles.category, isActive ? styles.active : null]}
      onPress={() => updateCategories(category)}
    >
      {isActive && (
        <FontAwesome5
          name="check-circle"
          size={24}
          color="#5cb85c"
          style={styles.checkMark}
        />
      )}
      <FontAwesome5
        name={icon}
        size={48}
        color={isActive ? colors.accent : colors.darkGrey}
        backgroundColor={colors.lightBackground}
      />
      <Text>{category}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containers: {
    backgroundColor: colors.mediumBackground,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.primary,
  },
  categories: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  category: {
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.darkGrey,
    width: 100,
    height: 100,
    backgroundColor: colors.lightBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    borderColor: colors.accent,
  },
  checkMark: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-evenly",
  },
});
