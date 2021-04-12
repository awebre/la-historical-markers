import { Alert } from "react-native";

export default function confirm(message: string, onConfirm: () => void) {
  Alert.alert("Confirm", message, [
    {
      text: "Yes",
      onPress: onConfirm,
    },
    {
      text: "No",
      style: "cancel",
    },
  ]);
}
