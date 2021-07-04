import React, { useEffect, useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  ViewStyle,
} from "react-native";
import { colors } from "utils";
import Fuse from "fuse.js";

type TypeaheadProps = {
  text: string;
  options: string[];
  onChangeText: (s: string) => void;
  style?: ViewStyle;
};

export function Typeahead({
  text,
  options,
  onChangeText,
  style,
}: TypeaheadProps) {
  const [searchResults, setSearchResults] = useState<string[]>();
  useEffect(() => {
    const fuse = new Fuse(options);
    const result = fuse.search(text);
    setSearchResults(result.map((r) => r.item));
  }, [options, text]);

  return (
    <View style={style}>
      <TextInput
        value={text}
        onChangeText={onChangeText}
        style={styles.input}
      />
      {searchResults &&
        searchResults.length > 0 &&
        (searchResults.length > 1 || searchResults.find((r) => r !== text)) && (
          <View style={[styles.dropdown]}>
            {searchResults.map((item) => (
              <Pressable
                key={item}
                style={styles.dropdownItemContainer}
                onPressIn={() => onChangeText(item)}
              >
                <Text style={styles.dropdownItem}>{item}</Text>
              </Pressable>
            ))}
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: Dimensions.get("window").width - 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    backgroundColor: colors.lightBackground,
    margin: 5,
    padding: 5,
    fontSize: 16,
    height: 30,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    left: 5,
    padding: 10,
    maxHeight: 100,
    borderRadius: 5,
    backgroundColor: colors.white,
    width: "100%",
  },
  dropdownItemContainer: {},
  dropdownItem: {
    marginVertical: 5,
    fontSize: 16,
  },
});
