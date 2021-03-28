import React, { useState } from "react";
import {
  StyleProp,
  Text,
  ViewStyle,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
} from "react-native";
import { Card, headerTextStyle } from "components";
import { FormGroup } from "components/forms";
import { colors } from "utils";
import { MarkerDto } from "markers";

interface SubmitMarkerViewProps {
  cardStyles: StyleProp<ViewStyle>;
  cancel: () => void;
  submit: (m: MarkerDto) => void;
}

export default function SubmitMarkerView({
  cardStyles,
  cancel,
  submit,
}: SubmitMarkerViewProps) {
  const [marker, setMarker] = useState({} as MarkerDto);
  return (
    <Card style={cardStyles}>
      <Card.Header>
        <Text style={styles.headerText}>Submit a New Historical Marker</Text>
      </Card.Header>
      <Card.Body>
        <Text>
          Your submission will be reviewed for accuracy before it becomes
          available within the app.
        </Text>
        <ScrollView>
          <FormGroup
            label="Name: "
            value={marker.name}
            onChangeText={(name) => setMarker({ ...marker, name })}
            placeholder="Skirmish of Boutte Station"
          />
        </ScrollView>
      </Card.Body>
      <Card.Footer style={styles.footer}>
        <Button title="Cancel" onPress={cancel} color={colors.accent} />
        <Button
          title="Submit"
          onPress={() => submit(marker)}
          color={colors.primary}
        />
      </Card.Footer>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerText: { ...headerTextStyle },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
