import React, { ReactNode } from "react";
import {
  Dimensions,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useTailwind } from "tailwind-rn";
import { colors } from "utils";

interface BaseTutorialProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

interface TutorialHeaderProps {
  style?: StyleProp<ViewStyle>;
  text: string;
  children?: ReactNode | undefined;
}

const Tutorial: React.FC<BaseTutorialProps> & TutorialSubComponents = ({
  style,
  children,
}) => {
  const tailwind = useTailwind();
  return (
    <View style={[tailwind("pt-16"), styles.tutorial, style]}>{children}</View>
  );
};

const Header: React.FC<TutorialHeaderProps> = ({ style, text, children }) => (
  <View style={[styles.header, style]}>
    <Text style={[styles.heading]}>{text}</Text>
    {children}
  </View>
);

const Content: React.FC<BaseTutorialProps> = ({ style, children }) => (
  <ScrollView contentContainerStyle={[styles.content, style]}>
    {children}
  </ScrollView>
);

const Footer: React.FC<BaseTutorialProps> = ({ style, children }) => {
  const tailwind = useTailwind();
  return (
    <View style={[tailwind("flex flex-row justify-between py-4"), style]}>
      {children}
    </View>
  );
};

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
});
