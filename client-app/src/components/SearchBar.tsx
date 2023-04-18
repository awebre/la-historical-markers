import React, { ReactNode } from "react";
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "utils";

import { FontAwesome5 } from "@expo/vector-icons";

type SearchBarProps = {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode | undefined;
};

const SearchBar: React.FC<SearchBarProps> = ({ style, children }) => {
  return (
    <View style={[styles.searchBar, style]}>
      <View style={styles.searchIcon}>
        <FontAwesome5 name="search" color="white" size={18} />
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    top: 50,
    left: 90,
    position: "absolute",
    height: 50,
    width: Dimensions.get("window").width - 150,
    borderRadius: 25,
    backgroundColor: colors.white,
    borderColor: colors.darkGrey,
    borderWidth: 0.5,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchIcon: {
    backgroundColor: colors.accent,
    width: 50,
    height: 50,
    borderRadius: 25,
    position: "absolute",
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchBar;
