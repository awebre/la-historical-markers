import React, { useEffect, useState } from "react";
import {
  TextInput,
  View,
  FlatList,
  Text,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FlatListItemSeparator } from "components";
import { colors } from "utils";
import Fuse from "fuse.js";

type TypeaheadProps = {
  text: string;
  options: string[];
  onChangeText: (s: string) => void;
};

export function Typeahead({ text, options, onChangeText }: TypeaheadProps) {
  const [searchResults, setSearchResults] = useState<string[]>();
  useEffect(() => {
    const fuse = new Fuse(options);
    const result = fuse.search(text);
    setSearchResults(result.map((r) => r.item));
  }, [options, text]);

  return (
    <View>
      <TextInput
        value={text}
        onChangeText={onChangeText}
        style={styles.input}
      />
      {searchResults && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TouchableHighlight onPress={() => onChangeText(item)}>
              <Text>{item}</Text>
            </TouchableHighlight>
          )}
          keyExtractor={(item) => item}
          ItemSeparatorComponent={FlatListItemSeparator}
        />
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
  },
});
