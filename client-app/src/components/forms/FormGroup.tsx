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
import { useTailwind } from "tailwind-rn";
import { colors } from "utils";

import Label from "./Label";

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
  const tailwind = useTailwind();
  const { color: placeholderTextColor }: any = tailwind("text-gray-600");
  return (
    <View style={[styles.container, containerStyle]}>
      <Label>{label}</Label>
      <TextInput
        style={[styles.input, inputStyle]}
        {...inputProps}
        placeholderTextColor={placeholderTextColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    maxWidth: "100%",
  },
  input: {
    flex: 0,
    display: "flex",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: colors.primary,
    margin: 5,
    padding: 5,
  },
});
