import React from "react";
import { StyleSheet, View, Text, Button, Platform } from "react-native";
import { colors } from "utils";

interface AlertProps {
  alertText: string;
  cancel?: () => void;
}

export default function Alert({ alertText, cancel }: AlertProps) {
  return (
    <View style={styles.alert}>
      <Text style={[styles.text, styles.header]}>
        Looks like something when wrong!
      </Text>
      <Text style={styles.text}>{alertText}</Text>
      {cancel && (
        <View>
          <Button
            title="Dismiss"
            onPress={cancel}
            color={Platform.OS === "ios" ? colors.lightText : colors.darkGrey}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: colors.alert,
    padding: 10,
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
  },
  text: {
    color: colors.lightText,
  },
});
