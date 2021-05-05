import React, { ReactChildren } from "react";
import { TextProps, Text, StyleSheet } from "react-native";

const Label: React.FC<TextProps> = ({ style, ...rest }) => (
  <Text style={[styles.label, style]} {...rest} />
);

export default Label;

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: "500",
    margin: 5,
  },
});
