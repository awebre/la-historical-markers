import React from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useTermsAndConditions } from "hooks";
import { colors } from "utils";

export default function TermsAndConditionsModal() {
  const { requiresAcceptance, acceptTerms } = useTermsAndConditions();
  return (
    <Modal visible={requiresAcceptance}>
      <View style={styles.content}>
        <Text style={styles.header}>
          Read and Accept the Terms and Conditions to Continue
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Read"
            onPress={async () => {
              await WebBrowser.openBrowserAsync(
                "https://www.termsfeed.com/live/306db7ec-6f34-4f1d-a1c8-c80b66986e01"
              );
            }}
          />
          <Button title="Accept" color={colors.accent} onPress={acceptTerms} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.lightBackground,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.primary,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
