import { DismissKeyboard, SearchBar } from "components";
import { MarkersList } from "components/markers";
import React from "react";
import {
  Button,
  Dimensions,
  Modal,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { MarkerDto } from "types";
import { colors } from "utils";

interface MarkerSearchModalProps {
  show: boolean;
  close: () => void;
  setSelectedMarker: (m: MarkerDto) => void;
}

export default function MarkerSearchModal({
  show,
  close,
}: MarkerSearchModalProps) {
  return (
    <Modal visible={show}>
      <DismissKeyboard>
        <View style={styles.container}>
          <SearchBar style={styles.searchBar}>
            <TextInput style={styles.input} autoFocus={true} />
          </SearchBar>
          <View style={styles.results}></View>
          <Button onPress={close} title="Done" color={colors.primary} />
        </View>
      </DismissKeyboard>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    paddingTop: 50,
    padding: 25,
    display: "flex",
  },
  searchBar: {
    top: 0,
    left: 0,
    position: "relative",
    width: Dimensions.get("window").width - 50,
    display: "flex",
    alignItems: "flex-start",
    flexShrink: 0,
  },
  input: {
    fontSize: 18,
    width: Dimensions.get("window").width - 125,
    marginLeft: 55,
    flexGrow: 1,
    flexShrink: 0,
  },
  results: {},
});
