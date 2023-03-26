import { ScrollView } from "react-native-gesture-handler";
import { Linking, Text, View } from "react-native";
import { getColor, tailwind } from "tailwind-util";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import { A } from "@expo/html-elements";
import { colors } from "utils";
const privacyPolicy = "https://lahistoricalmarkers.com/privacy-policy";
const homepage = "https://lahistoricalmarkers.com";
export default function SettingScreen({}) {
  return (
    <ScrollView style={tailwind("bg-brown-light h-full pt-16 px-5")}>
      <StatusBar style="dark" />
      <Text style={tailwind("text-3xl font-bold")}>Links</Text>
      <View style={tailwind("border-b-2 border-brown mb-10")} />
      <View
        style={tailwind("flex flex-row items-center justify-between mb-5")}
        onTouchEnd={() => Linking.openURL(homepage)}
      >
        <A href={homepage} style={tailwind("text-lg")}>
          Our Website
        </A>
        <FontAwesome name="external-link" size={20} />
      </View>
      <View
        style={tailwind("flex flex-row items-center justify-between")}
        onTouchEnd={() => Linking.openURL(privacyPolicy)}
      >
        <A href={privacyPolicy} style={tailwind("text-lg text-red-500")}>
          Privacy Policy
        </A>
        <FontAwesome
          name="external-link"
          size={20}
          color={getColor("red-500")}
        />
      </View>
    </ScrollView>
  );
}
