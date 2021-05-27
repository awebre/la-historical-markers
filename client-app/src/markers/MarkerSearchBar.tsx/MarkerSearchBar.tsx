import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "utils";
import MarkerSearchModal from "./MarkerSearchModal";

export default function MarkerSearchBar() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <View style={styles.searchBar}>
        <View style={styles.searchIcon}>
          <FontAwesome5 name="search" color="white" size={18} />
        </View>
        <TouchableOpacity
          style={styles.searchInput}
          onPress={() => setShowModal(true)}
        />
      </View>
      <MarkerSearchModal show={showModal} close={() => setShowModal(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    top: 50,
    left: 90,
    position: "absolute",
    height: 50,
    width: Dimensions.get("window").width - 175,
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
  searchInput: {
    height: 50,
    width: Dimensions.get("window").width - 150,
    borderRadius: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
