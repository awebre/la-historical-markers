import React, { useState } from "react";
import {
  StyleProp,
  Text,
  ViewStyle,
  StyleSheet,
  Button,
  ScrollView,
  View,
} from "react-native";
import { Alert, Card, headerTextStyle } from "components";
import { FormGroup } from "components/forms";
import { colors, url } from "utils";
import { useLocation } from "hooks";
import { MarkerDto } from "types";

interface SubmitMarkerViewProps {
  cardStyles: StyleProp<ViewStyle>;
  cancel: () => void;
  onSuccess: () => void;
  marker: MarkerDto | null;
  setMarker: (m: MarkerDto) => void;
}

export default function SubmitMarkerView({
  cardStyles,
  cancel,
  onSuccess,
  marker,
  setMarker,
}: SubmitMarkerViewProps) {
  const [error, setError] = useState("");
  const { requestLocation, permissionGranted } = useLocation({
    location: marker,
    setLocation: (location) => {
      setMarker(
        marker ? { ...marker, ...location } : ({ ...location } as MarkerDto)
      );
    },
  });
  return (
    <Card style={cardStyles}>
      <Card.Header>
        <Text style={styles.headerText}>Submit a New Historical Marker</Text>
      </Card.Header>
      <Card.Body style={styles.body}>
        <ScrollView style={{ paddingRight: 10 }}>
          {!error && (
            <Text
              style={{
                paddingBottom: 5,
              }}
            >
              {!permissionGranted
                ? "You must allow location services in order to submit a new Marker. We use your location to report an approximate location of the marker."
                : 'Walk up to the marker and click "Update Marker Location" to set the location of the marker. Your submission will be reviewed for accuracy before it will become available within the app.'}
            </Text>
          )}
          {error !== "" && (
            <Alert alertText={error} cancel={() => setError("")} />
          )}
          <View style={{ paddingBottom: 10 }}>
            <Button
              title="Update Marker Location"
              onPress={requestLocation}
              color={colors.primary}
            />
          </View>
          {permissionGranted && (
            <>
              <FormGroup
                label="Name:"
                value={marker?.name}
                onChangeText={(name) =>
                  setMarker(
                    marker ? { ...marker, name } : ({ name } as MarkerDto)
                  )
                }
                placeholder="Skirmish of Boutte Station"
              />
              <FormGroup
                label="Description:"
                value={marker?.description}
                onChangeText={(description) =>
                  setMarker(
                    marker
                      ? { ...marker, description }
                      : ({ description } as MarkerDto)
                  )
                }
                containerStyle={{ flexDirection: "column" }}
                placeholder="Union train with sixty men..."
                multiline={true}
              />
            </>
          )}
        </ScrollView>
      </Card.Body>
      <Card.Footer style={styles.footer}>
        <Button title="Cancel" onPress={cancel} color={colors.accent} />
        <Button
          title="Submit"
          onPress={async () => {
            if (marker) {
              try {
                const resp = await fetch(`${url}/api/markers`, {
                  method: "post",
                  body: JSON.stringify(marker),
                });
                if (resp.ok) {
                  onSuccess();
                } else {
                  setError(
                    "Your submission was not accepted. Please check that the Name and Description are both entered and that the location of the marker looks correct on the map above."
                  );
                }
              } catch {
                setError(
                  "Looks like your submission couldn't be completed. Please try again."
                );
              }
            }
          }}
          color={colors.primary}
          disabled={!marker}
        />
      </Card.Footer>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerText: { ...headerTextStyle },
  body: {
    paddingBottom: 0,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
