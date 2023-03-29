import { A } from "@expo/html-elements";
import { FontAwesome } from "@expo/vector-icons";
import classnames from "classnames";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, Linking, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import FeedbackForm from "settings/FeedbackForm";
import { useTailwind } from "tailwind-rn";

const { websiteUrl, privacyPolicyUrl, githubUrl } =
  Constants.expoConfig?.extra ?? {};
export default function SettingScreen({}) {
  const tailwind = useTailwind();
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
const LinkItem = ({ text, url, icon, color = "black" }: LinkItemProps) => {
  const tailwind = useTailwind();
  const { color: effectiveColor }: any = tailwind(`text-${color}-500`);
  return (
    <View
      style={tailwind("flex flex-row items-center justify-between mb-5")}
      onTouchEnd={() => Linking.openURL(url)}
    >
      <View style={tailwind("flex flex-row items-center")}>
        <FontAwesome
          name={icon}
          style={tailwind("mr-4 w-5")}
          size={20}
          color={color === "black" ? "black" : effectiveColor}
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
        color={color === "black" ? "black" : effectiveColor}
      />
    </View>
  );
};

const Heading = ({ text }: { text: string }) => {
  const tailwind = useTailwind();
  return (
    <View style={tailwind("mt-8")}>
      <Text style={tailwind("text-3xl font-bold")}>{text}</Text>
      <View style={tailwind("border-b-2 border-brown mb-5")} />
    </View>
  );
};
