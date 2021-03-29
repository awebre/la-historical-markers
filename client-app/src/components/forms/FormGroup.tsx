import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "utils";

type FormGroupProps = {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
} & TextInputProps;

export default function FormGroup({
  label,
  labelStyle,
  containerStyle,
  inputStyle,
  ...inputProps
}: FormGroupProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput style={[styles.input, inputStyle]} {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 15,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    margin: 5,
  },
  input: {
    flex: 0,
    flexShrink: 1,
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    margin: 5,
    padding: 5,
  },
});
