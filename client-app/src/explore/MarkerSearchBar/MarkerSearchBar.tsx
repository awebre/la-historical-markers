import { SearchBar } from "components";
import React, { useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { MarkerDto } from "types";
import MarkerSearchModal from "./MarkerSearchModal";

interface MarkerSearchBarProps {
  setSelectedMarker: (m: MarkerDto) => void;
}

export default function MarkerSearchBar({
  setSelectedMarker,
}: MarkerSearchBarProps) {
  const close = () => setShowModal(false);

  const onSelectMarker = (marker: MarkerDto) => {
    setSelectedMarker(marker);
    close();
  };
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <SearchBar>
        <TouchableOpacity
          style={styles.searchInput}
          onPress={() => setShowModal(true)}
        />
      </SearchBar>
      <MarkerSearchModal
        show={showModal}
        close={close}
        setSelectedMarker={onSelectMarker}
      />
    </>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    height: 50,
    width: Dimensions.get("window").width - 150,
    borderRadius: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
