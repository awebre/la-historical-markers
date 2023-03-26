import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  Dimensions,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomCategory, SavedMarker, SavedMarkerCategory } from "types";
import { colors } from "utils";
import { useSavedMarkers } from "hooks";
import { getIconFromCategory, getLabel } from "./utils";
import { Typeahead } from "components/forms";

type SavedMarkerModalProps = {
  marker: SavedMarker;
  visible: boolean;
  setVisible: (v: boolean) => void;
};

const isActive = (
  category: SavedMarkerCategory,
  selected: SavedMarkerCategory[]
) => {
  return selected.findIndex((c) => c.type === category.type) !== -1;
};

export default function SavedMarkerModal({
  marker,
  visible,
  setVisible,
}: SavedMarkerModalProps) {
  const initialCustom = (marker.categories.find(
    (x) => x.type === "Custom"
  ) as CustomCategory) ?? {
    type: "Custom",
    value: "",
  };
  const [customCategory, setCustomCategory] =
    useState<CustomCategory>(initialCustom);
  const [savedMarker, setSavedMarker] = useState<SavedMarker>(marker);

  const { updateMarker, removeMarker, markers } = useSavedMarkers();
  const customCategories = markers
    .flatMap((m) => m.categories)
    .reduce((custom, category) => {
      if (
        category?.type === "Custom" &&
        !custom.find((c) => c === category.value)
      ) {
        return [...custom, category.value];
      }
      return custom;
    }, new Array<string>());

  const updateCategories = (category: SavedMarkerCategory) => {
    const index = savedMarker.categories.findIndex(
      (c) => c.type == category.type
    );
    if (index !== -1) {
      const newCategories = savedMarker.categories.filter(
        (c) => c.type !== category.type
      );
      if (category.type === "Custom") {
        setCustomCategory({ type: category.type, value: "" });
      }
      setSavedMarker({ ...savedMarker, categories: newCategories });
    } else {
      const newCategories = [...savedMarker.categories, category];
      setSavedMarker({ ...savedMarker, categories: newCategories });
    }
  };

  useEffect(() => {
    if (isActive(customCategory, savedMarker.categories)) {
      const otherCategories = savedMarker.categories.filter(
        (c) => c.type !== customCategory.type
      );
      setSavedMarker({
        ...savedMarker,
        categories: [...otherCategories, customCategory],
      });
    }
  }, [customCategory]);

  return (
    <Modal visible={visible}>
      <KeyboardAvoidingView behavior="position">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <SafeAreaView style={styles.containers}>
            <Text style={styles.heading}>{marker.name}</Text>
            <Text style={{ padding: 10, textAlign: "center" }}>
              You have saved this marker to your map. Select one or more of the
              categories below.
            </Text>
            <View style={styles.categories}>
              <CategorySelector
                category={{ type: "Visited" }}
                selectedCategories={savedMarker.categories}
                updateCategories={updateCategories}
              />
              <CategorySelector
                category={{ type: "Authored" }}
                selectedCategories={savedMarker.categories}
                updateCategories={updateCategories}
              />
              <CategorySelector
                category={{ type: "For Later" }}
                selectedCategories={savedMarker.categories}
                updateCategories={updateCategories}
              />
              <CategorySelector
                category={customCategory}
                selectedCategories={savedMarker.categories}
                updateCategories={updateCategories}
                style={styles.customCategory}
              />
              {isActive(customCategory, savedMarker.categories) && (
                <Typeahead
                  placeholder="Find or Add Custom Category"
                  text={customCategory.value ?? undefined}
                  onChangeText={(val) =>
                    setCustomCategory({ ...customCategory, value: val })
                  }
                  options={customCategories}
                />
              )}
            </View>
            <View style={styles.actions}>
              <Button
                title="Delete"
                color={colors.alert}
                onPress={() => {
                  removeMarker(savedMarker.id);
                  setVisible(false);
                }}
              />
              <Button
                title="Done"
                color={colors.primary}
                disabled={savedMarker.categories.length < 1}
                onPress={() => {
                  updateMarker(savedMarker);
                  setVisible(false);
                }}
              />
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type CategorySelectorProps = {
  category: SavedMarkerCategory;
  selectedCategories: SavedMarkerCategory[];
  updateCategories: (c: SavedMarkerCategory) => void;
  style?: ViewStyle;
};

const CategorySelector = ({
  category,
  selectedCategories,
  updateCategories,
  style,
}: CategorySelectorProps) => {
  const active = isActive(category, selectedCategories);
  const icon = getIconFromCategory(category);
  return (
    <TouchableOpacity
      style={[styles.category, active ? styles.active : null, style]}
      onPress={() => updateCategories(category)}
    >
      {active && (
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
        color={active ? colors.accent : colors.darkGrey}
        backgroundColor={colors.lightBackground}
      />
      <Text>{getLabel(category)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containers: {
    backgroundColor: colors.mediumBackground,
    height: "100%",
    display: "flex",
    flexDirection: "column",
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
    paddingVertical: 50,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    zIndex: 1,
  },
  category: {
    margin: 10,
    borderRadius: 5,
    borderWidth: 2,
    flex: 1,
    borderColor: colors.darkGrey,
    minWidth: 100,
    minHeight: 100,
    backgroundColor: colors.lightBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  customCategory: {
    flex: 3,
  },
  input: {
    width: Dimensions.get("window").width - 20,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: colors.primary,
    backgroundColor: colors.lightBackground,
    margin: 5,
    padding: 5,
    fontSize: 16,
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
