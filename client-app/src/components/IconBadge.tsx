import classNames from "classnames";
import { View } from "react-native";
import { useTailwind } from "tailwind-rn";

import { FontAwesome } from "@expo/vector-icons";

interface IconBadgeProps {
  icon: "warning" | "refresh" | "trash" | "expand";
  onPress?: () => void;
  className?: string;
}

export default function IconBadge({
  icon,
  onPress,
  className,
}: IconBadgeProps) {
  const tailwind = useTailwind();
  return (
    <View
      style={[
        tailwind(
          classNames(
            "absolute flex items-center justify-center w-8 h-8 rounded-full bg-black",
            className,
            {
              "bg-yellow-400": icon === "warning",
              "bg-gray-400": icon === "refresh",
              "bg-red-400 ": icon === "trash",
            }
          )
        ),
      ]}
    >
      <FontAwesome
        name={icon}
        style={tailwind("text-white")}
        size={16}
        onPress={onPress}
      />
    </View>
  );
}
