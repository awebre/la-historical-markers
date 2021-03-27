import React from "react";
import { View } from "react-native";

export default function FlatListItemSeparator() {
  return (
    <View
      style={{
        height: 0.5,
        width: "100%",
        backgroundColor: "#000",
        opacity: 0.3,
      }}
    />
  );
}
