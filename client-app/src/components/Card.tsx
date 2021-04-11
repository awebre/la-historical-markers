import React from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
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
    margin: 20,
  },
  header: {
    backgroundColor: colors.primary,
    display: "flex",
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 15,
  },
  body: {
    padding: 10,
    flexGrow: 0,
    flexShrink: 1,
    backgroundColor: colors.lightBackground,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    height: 50,
    alignSelf: "stretch",
    justifyContent: "space-evenly",
    backgroundColor: colors.grey,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingBottom: Platform.OS == "android" ? 10 : 0,
  },
});
