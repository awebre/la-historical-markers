import React, { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTailwind } from "tailwind-rn";
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
  const tailwind = useTailwind();
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
          style={tailwind(
            "border-2 w-full rounded-md m-1.5 p-1.5 border-brown max-h-64 h-24"
          )}
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
                  headers: {
                    "Content-Type": "application/json",
                  },
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
});
