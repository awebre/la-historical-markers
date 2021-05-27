import React from "react";
import { Button, Modal, StyleSheet, View } from "react-native";
import { colors } from "utils";

interface MarkerSearchModalProps {
  show: boolean;
  close: () => void;
}

export default function MarkerSearchModal({
  show,
  close,
}: MarkerSearchModalProps) {
  return (
    <Modal visible={show}>
      <View style={styles.container}>
        <Button onPress={close} title="Done" color={colors.primary} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    padding: 25,
  },
});
