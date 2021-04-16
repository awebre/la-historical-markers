import React from "react";
import {
  View,
  Text,
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

interface BadgeProps {
  badgeStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  text: string;
}

const Header: React.FC<BaseCardProps> = ({ style, children }) => (
  <View style={[styles.header, style]}>{children}</View>
);

const Badge: React.FC<BadgeProps> = ({ badgeStyle, textStyle, text }) => (
  <View style={[styles.badge, badgeStyle]}>
    <Text style={[styles.badgeText, textStyle]}>{text}</Text>
  </View>
);

const Body: React.FC<BaseCardProps> = ({ style, children }) => (
  <View style={[styles.body, style]}>{children}</View>
);

const Footer: React.FC<BaseCardProps> = ({ style, children }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

interface CardSubComponents {
  Header: typeof Header;
  Badge: typeof Badge;
  Body: typeof Body;
  Footer: typeof Footer;
}

const Card: React.FC<BaseCardProps> & CardSubComponents = ({
  style,
  children,
}) => <View style={[style, styles.card]}>{children}</View>;

Card.Header = Header;
Card.Badge = Badge;
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
  badge: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderRadius: 2,
    margin: -5, //ew, negative margins
    paddingLeft: 5,
    paddingRight: 5,
  },
  badgeText: {
    color: colors.lightText,
    fontWeight: "bold",
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
    alignItems: "flex-end",
    justifyContent: "space-around",
    backgroundColor: colors.grey,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingBottom: Platform.OS == "android" ? 10 : 0,
  },
});
