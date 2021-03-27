import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";

interface CardHeaderProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const Header: React.FC<CardHeaderProps> = ({ style, children }) => (
  <View style={[styles.header, style]}>{children}</View>
);

interface CardProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

interface CardSubComponents {
  Header: typeof Header;
}
const Card: React.FC<CardProps> & CardSubComponents = ({ style, children }) => (
  <View style={[style, styles.card]}>{children}</View>
);

Card.Header = Header;
export default Card;

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    alignSelf: "stretch",
    justifyContent: "space-around",
    margin: 20,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: { width: 1, height: 1 },
  },
  header: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 10,
  },
});
