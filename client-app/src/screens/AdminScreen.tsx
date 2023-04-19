import {
  Alert,
  DismissKeyboard,
  LoadingIndicator,
  PhotoCarousel,
} from "components";
import { FormGroup, Label } from "components/forms";
import LocationNavigationButton from "components/LocationNavigationButton";
import MapWithBorder from "components/MapWithBorder";
import { MarkerSelector } from "components/markers";
import { useMarker } from "hooks";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { Marker } from "react-native-maps";
import { MarkerDto, MarkerType, RootParams } from "types";
import { colors, url } from "utils";
import { photosUrl } from "utils/urls";

import { StackScreenProps } from "@react-navigation/stack";

type Props = StackScreenProps<RootParams, "Admin">;

export default function AdminScreen({ route, navigation }: Props) {
  const { markerId, otp } = route.params || {};
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { marker, isLoading, hasError } = useMarker({ id: markerId });
  const [markerDto, setMarkerDto] = useState<MarkerDto | null>(null);
  useEffect(() => setMarkerDto(marker ?? null), [marker]);
  const submit = async () => {
    try {
      setError("");
      setSubmitting(true);
      const { id, ...rest } = markerDto || {};
      const queryParams = queryString.stringify({ otp });
      const resp = await fetch(`${url}/api/markers/${id}?${queryParams}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...rest }),
      });

      if (resp.ok) {
        navigation.goBack();
        return;
      }

      switch (resp.status) {
        case 401:
          setError(
            "The supplied OTP was invalid. You are not authorized to make changes."
          );
          break;
        default:
          setError("An error occured. Please try again.");
          break;
      }
    } catch (e) {
      setError("An error occured. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="position">
      <DismissKeyboard>
        <>
          <ScrollView style={styles.scrollview}>
            <View style={styles.scrollContent}>
              {!!error && (
                <Alert alertText={error} cancel={() => setError("")} />
              )}
              {isLoading && !hasError && <LoadingIndicator size={100} />}
              {!isLoading && !hasError && markerDto && (
                <View>
                  <MapWithBorder
                    containerStyle={styles.mapContainer}
                    style={styles.map}
                    initialRegion={{
                      latitude: markerDto.latitude,
                      longitude: markerDto.longitude,
                      latitudeDelta: 0.1,
                      longitudeDelta: 0.1,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: markerDto.latitude,
                        longitude: markerDto.longitude,
                      }}
                    />
                  </MapWithBorder>
                  <LocationNavigationButton
                    latitude={markerDto.latitude}
                    longitude={markerDto.longitude}
                    style={styles.goButton}
                  />

                  {
                    <PhotoCarousel
                      photos={
                        markerDto.photos.length > 0
                          ? markerDto.photos
                          : [
                              {
                                fileGuid: markerDto.imageFileName ?? "",
                                fileName: marker?.imageFileName ?? "",
                              },
                            ]
                      }
                    />
                  }
                  <MarkerSelector
                    type={markerDto?.type ?? MarkerType.official}
                    setType={(type) =>
                      setMarkerDto({
                        ...(markerDto ? markerDto : ({} as MarkerDto)),
                        type,
                      })
                    }
                  />
                  <FormGroup
                    label="Name:"
                    value={markerDto?.name}
                    onChangeText={(name) =>
                      setMarkerDto({
                        ...(markerDto ? markerDto : ({} as MarkerDto)),
                        name,
                      })
                    }
                    editable={true}
                  />
                  <FormGroup
                    label="Description:"
                    value={markerDto?.description}
                    onChangeText={(description) =>
                      setMarkerDto({
                        ...(markerDto ? markerDto : ({} as MarkerDto)),
                        description,
                      })
                    }
                    multiline={true}
                    editable={true}
                  />
                  <View style={styles.switchContainer}>
                    <Label>Approved: </Label>
                    <Switch
                      trackColor={{ true: colors.accent, false: colors.grey }}
                      value={markerDto?.isApproved}
                      onValueChange={(isApproved) =>
                        setMarkerDto({
                          ...(markerDto ? markerDto : ({} as MarkerDto)),
                          isApproved,
                        })
                      }
                    />
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <Button
              title={submitting ? "Submitting..." : "Submit"}
              onPress={async () => {
                await submit();
              }}
              color={colors.primary}
              disabled={submitting}
            />
          </View>
        </>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    margin: 10,
  },
  map: {
    height: 250,
  },
  goButton: {
    position: "absolute",
    top: 180,
    right: 15,
  },
  scrollview: {
    height: Dimensions.get("window").height - 175,
    backgroundColor: colors.lightBackground,
  },
  scrollContent: {
    padding: 15,
  },
  switchContainer: {
    marginTop: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footer: {
    paddingTop: 10,
    height: 75,
    backgroundColor: colors.grey,
  },
});
