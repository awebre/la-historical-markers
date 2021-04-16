import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

type DismissKeyboardProps = {
  children: React.ReactNode;
};

function DismissKeyboard({ children }: DismissKeyboardProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {children}
    </TouchableWithoutFeedback>
  );
}

export default DismissKeyboard;
