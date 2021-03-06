import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { colors, url } from "utils";

type ReportMarkerModalProps = {
  markerId: number;
  isVisible: boolean;
  close: () => void;
};

export default function ReportMarkerModal({
  markerId,
  isVisible,
  close,
}: ReportMarkerModalProps) {
  const [report, setReport] = useState("");
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <Modal visible={isVisible}>
      <KeyboardAvoidingView style={styles.content} behavior="padding">
        <Text style={styles.heading}>Something wrong with this marker?</Text>
        <Text>
          Please discribe what is wrong with this marker so that it can be
          addressed.
        </Text>
        {error && (
          <Text style={{ color: colors.alert }}>
            An error occured with recording your report. Please try again.
          </Text>
        )}
        <TextInput
          style={styles.input}
          multiline
          value={report}
          onChangeText={(text) => setReport(text)}
          editable={!isSubmitting}
        />
        <View style={styles.footer}>
          <Button
            disabled={isSubmitting}
            title="Cancel"
            onPress={onClose}
            color={colors.accent}
          />
          <Button
            title={isSubmitting ? "Reporting..." : "Report Marker"}
            disabled={report === "" || isSubmitting}
            onPress={async () => {
              setError(false);
              setIsSubmitting(true);
              try {
                const resp = await fetch(`${url}/api/markers/report`, {
                  method: "post",
                  body: JSON.stringify({ markerId, report }),
                });
                setIsSubmitting(false);
                onClose();
              } catch {
                setError(true);
                setIsSubmitting(false);
              }
            }}
            color={colors.alert}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  function onClose() {
    setReport("");
    close();
  }
}

const styles = StyleSheet.create({
  content: {
    height: "100%",
    backgroundColor: colors.lightBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.primary,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  input: {
    width: "100%",
    maxHeight: 250,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    margin: 5,
    padding: 5,
  },
});
