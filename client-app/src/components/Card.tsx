import React from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "utils";

interface BaseCardProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const Header: React.FC<BaseCardProps> = ({ style, children }) => (
  <View style={[styles.header, style]}>{children}</View>
);

const Body: React.FC<BaseCardProps> = ({ style, children }) => (
  <View style={[styles.body, style]}>{children}</View>
);

const Footer: React.FC<BaseCardProps> = ({ style, children }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

interface CardSubComponents {
  Header: typeof Header;
  Body: typeof Body;
  Footer: typeof Footer;
}
const Card: React.FC<BaseCardProps> & CardSubComponents = ({
  style,
  children,
}) => <View style={[style, styles.card]}>{children}</View>;

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;
export { Card as default, headerTextStyle };

const headerTextStyle = {
  color: colors.lightText,
  fontSize: 15,
  fontWeight: "bold",
} as TextStyle;

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    alignSelf: "stretch",
    justifyContent: "space-around",
    margin: 20,
  },
  header: {
    backgroundColor: colors.primary,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 10,
  },
  body: {
    padding: 10,
    backgroundColor: colors.lightBackground,
  },
  footer: {
    alignSelf: "stretch",
    backgroundColor: colors.grey,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});
