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
    marginTop: 15,
    maxWidth: "100%",
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    margin: 5,
  },
  input: {
    flex: 0,
    display: "flex",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    margin: 5,
    padding: 5,
  },
});
