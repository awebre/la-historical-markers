import { FormGroup } from "components/forms";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { useTailwind } from "tailwind-rn";
import { url } from "utils";

interface FeedbackFormProps {
  onSuccess: () => void;
}

export default function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tailwind = useTailwind();
  const { color: red }: any = tailwind("text-red-500");

  return (
    <View style={tailwind("mb-10")}>
      <Text style={tailwind("text-lg")}>Have feedback about the app?</Text>
      <Text style={tailwind("text-lg")}>We'd love to hear from you.</Text>
      <FormGroup
        label="Email (Optional):"
        value={email ?? undefined}
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
            setEmail("");
            setFeedback("");
            onSuccess();
          } catch {
            // setError(true);
            setIsSubmitting(false);
          }
        }}
        color={red}
      />
    </View>
  );
}
