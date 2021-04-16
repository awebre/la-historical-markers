import React from "react";
import {
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  Text,
  Dimensions,
} from "react-native";
import { colors } from "utils";

interface BaseTutorialProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

interface TutorialHeaderProps {
  style?: StyleProp<ViewStyle>;
  text: string;
}

const Tutorial: React.FC<BaseTutorialProps> & TutorialSubComponents = ({
  style,
  children,
}) => <View style={[styles.tutorial, style]}>{children}</View>;

const Header: React.FC<TutorialHeaderProps> = ({ style, text }) => (
  <View style={[styles.header, style]}>
    <Text style={[styles.heading]}>{text}</Text>
  </View>
);

const Content: React.FC<BaseTutorialProps> = ({ style, children }) => (
  <View style={[styles.content, style]}>{children}</View>
);

const Footer: React.FC<BaseTutorialProps> = ({ style, children }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

type TutorialSubComponents = {
  Header: typeof Header;
  Content: typeof Content;
  Footer: typeof Footer;
};

Tutorial.Header = Header;
Tutorial.Content = Content;
Tutorial.Footer = Footer;

export default Tutorial;

const styles = StyleSheet.create({
  tutorial: {
    height: "100%",
    display: "flex",
    justifyContent: "flex-start",
    paddingTop: 100,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: colors.lightBackground,
  },
  header: {},
  heading: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  content: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 25,
  },
});
