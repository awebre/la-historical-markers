import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAvoidingView, Linking, Text, View } from "react-native";
import { getColor, tailwind } from "tailwind-util";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import { A } from "@expo/html-elements";
import classnames from "classnames";
import Constants from "expo-constants";
import FeedbackForm from "settings/FeedbackForm";

const { websiteUrl, privacyPolicyUrl, githubUrl } =
  Constants.expoConfig?.extra ?? {};
export default function SettingScreen({}) {
  return (
    <KeyboardAvoidingView behavior="position">
      <ScrollView style={tailwind("bg-brown-light h-full pt-8 px-5")}>
        <StatusBar style="dark" />
        <Heading text="Links" />
        <LinkItem text="Our Website" url={websiteUrl} icon="laptop" />
        <LinkItem text="Source Code on GitHub" url={githubUrl} icon="github" />
        <LinkItem
          text="Privacy Policy"
          url={privacyPolicyUrl}
          color={"red"}
          icon="legal"
        />
        <Heading text="Feedback" />
        <FeedbackForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface LinkItemProps {
  color?: "red" | "black";
  text: string;
  url: string;
  icon: "laptop" | "github" | "legal";
}
const LinkItem = ({ text, url, icon, color = "black" }: LinkItemProps) => (
  <View
    style={tailwind("flex flex-row items-center justify-between mb-5")}
    onTouchEnd={() => Linking.openURL(url)}
  >
    <View style={tailwind("flex flex-row items-center")}>
      <FontAwesome
        name={icon}
        style={tailwind("mr-4 w-5")}
        size={20}
        color={color === "black" ? "black" : getColor(`${color}-500`)}
      />
      <A
        href={url}
        style={tailwind(
          classnames("text-lg", { "text-red-500": color === "red" })
        )}
      >
        <Text>{text}</Text>
      </A>
    </View>
    <FontAwesome
      name="external-link"
      size={20}
      color={color === "black" ? "black" : getColor(`${color}-500`)}
    />
  </View>
);

const Heading = ({ text }: { text: string }) => (
  <View style={tailwind("mt-8")}>
    <Text style={tailwind("text-3xl font-bold")}>{text}</Text>
    <View style={tailwind("border-b-2 border-brown mb-5")} />
  </View>
);
