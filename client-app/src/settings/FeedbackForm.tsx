import { FormGroup } from "components/forms";
import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { getColor, tailwind } from "tailwind-util";
import { url } from "utils";

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <View>
      <Text style={tailwind("text-lg")}>Have feedback about the app?</Text>
      <Text style={tailwind("text-lg")}>We'd love to hear from you.</Text>
      <FormGroup
        label="Email (Optional):"
        value={email}
        onChangeText={setEmail}
        containerStyle={{ flexDirection: "column" }}
        placeholder="dev@lahistoricalmarkers.com"
        editable={!isSubmitting}
      />
      <FormGroup
        label="Feedback:"
        value={feedback ?? undefined}
        onChangeText={setFeedback}
        containerStyle={{ flexDirection: "column" }}
        placeholder="I'd like to see..."
        multiline={true}
        editable={!isSubmitting}
        inputStyle={{ height: 100 }}
      />
      <Button
        title={isSubmitting ? "Submitting..." : "Submit Feedback"}
        disabled={feedback === "" || isSubmitting}
        onPress={async () => {
          //   setError(false);
          setIsSubmitting(true);
          try {
            const resp = await fetch(`${url}/api/feedback`, {
              headers: {
                "Content-Type": "application/json",
              },
              method: "post",
              body: JSON.stringify({ email, feedback }),
            });
            setIsSubmitting(false);
          } catch {
            // setError(true);
            setIsSubmitting(false);
          }
        }}
        color={getColor("red-500")}
      />
    </View>
  );
}
