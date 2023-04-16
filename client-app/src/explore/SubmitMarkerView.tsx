import {
  Alert,
  Card,
  headerTextStyle,
  ImagePreviewPicker,
  Tutorial,
} from "components";
import LocationEntrySwitch from "components/location";
import * as ImageManipulator from "expo-image-manipulator";
import * as Linking from "expo-linking";
import { useLocation, useSavedMarkers } from "hooks";
import React, { useEffect, useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { ImageSource, Location, MarkerDto, MarkerType } from "types";
import { colors, confirm, routes, url } from "utils";

import MarkerForm from "./MarkerForm";
import ManualLocationStepContent from "./SubmissionTutorialModal/Steps/ManualLocationStepContent";
import SubmissionTutorialModal from "./SubmissionTutorialModal/SubmissionTutorialModal";

interface SubmitMarkerViewProps {
  cardStyles: StyleProp<ViewStyle>;
  cancel: () => void;
  onSuccess: (name: string) => void;
  updateMapMarker: (m: Location | null) => void;
}

const deepLink = Linking.createURL(`/${routes.adminMarker}/`);

export default function SubmitMarkerView({
  cardStyles,
  cancel,
  onSuccess,
  updateMapMarker,
}: SubmitMarkerViewProps) {
  const [tutorialVisible, setTutorialVisible] = useState(true);
  const [useDeviceLocation, setUseDeviceLocation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<ImageSource[] | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [type, setType] = useState<MarkerType>(MarkerType.official);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { addMarker } = useSavedMarkers();

  const { updateLocation, permissionGranted } = useLocation({
    setLocation: (location) => {
      if (useDeviceLocation) {
        updateMapMarker(location);
        setLocation(location);
      }
    },
  });

  useEffect(() => {
    updateLocation();
  }, [useDeviceLocation]);

  function manuallyUpdateMarkerLocation(coords: Location) {
    updateMapMarker(coords);
    setLocation(coords);
  }

  function toggleDeviceLocation() {
    setUseDeviceLocation(!useDeviceLocation);
  }

  async function submitMarker() {
    setIsSubmitting(true);
    if (location && name && description) {
      try {
        const resp = await fetch(`${url}/api/markers`, {
          method: "post",
          body: JSON.stringify({
            imageGuids: images?.map((x) => x.guid) ?? [],
            ...location,
            type,
            name,
            description,
            deepLinkBaseUrl: deepLink,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (resp.ok) {
          setIsSubmitting(false);
          const json = await resp.json();
          const newMarker = json as MarkerDto;
          //TODO: this means that we will need to refetch the list every so often to make sure it is correct
          addMarker({
            id: newMarker.id,
            name: newMarker.name,
            type: newMarker.type,
            latitude: newMarker.latitude,
            longitude: newMarker.longitude,
            categories: [{ type: "Authored" }, { type: "Visited" }],
          });
          onSuccess(name);
        } else {
          setError(
            "Your submission was not accepted. Please check that the Name and Description are both entered and that the location of the marker looks correct on the map above."
          );
          setIsSubmitting(false);
        }
      } catch (e) {
        setError(
          "Looks like your submission couldn't be completed. Please try again."
        );
        setIsSubmitting(false);
      }
    }
  }

  function onCancel() {
    confirm("Are you sure you want to cancel this submission?", cancel);
  }

  return (
    <View>
      <Card style={cardStyles}>
        <Card.Header>
          <Text style={styles.headerText}>
            Review and Submit Your Submission
          </Text>
        </Card.Header>
        <Card.Body style={styles.body}>
          <ScrollView style={{ paddingRight: 10 }}>
            {!error && (
              <Text
                style={{
                  paddingTop: 5,
                  paddingBottom: 5,
                  textAlign: "center",
                }}
              >
                {!permissionGranted && useDeviceLocation
                  ? "You must allow location services in order to submit a new Marker. We use your location to report an approximate location of the marker."
                  : "Check that the above location and the information you entered is correct, then hit Submit."}
              </Text>
            )}
            {error !== "" && (
              <Alert alertText={error} cancel={() => setError("")} />
            )}
            <View>
              <Text style={{ fontWeight: "bold", paddingBottom: 10 }}>
                How would you like to set the marker's location?
              </Text>
              <LocationEntrySwitch
                useDeviceLocation={useDeviceLocation}
                toggleDeviceLocation={toggleDeviceLocation}
              />
            </View>
            <View style={{ paddingBottom: 10 }}>
              {useDeviceLocation ? (
                <Button
                  title="Update Marker Location"
                  onPress={updateLocation}
                  disabled={isSubmitting}
                />
              ) : (
                <Button
                  title="Change Marker Location"
                  onPress={() => setIsModalVisible(true)}
                />
              )}
              <ImagePreviewPicker
                images={images}
                setImages={setImages}
                disabled={isSubmitting}
              />
            </View>
            {location?.latitude && location?.longitude ? (
              <MarkerForm
                type={type}
                setType={setType}
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                editable={!isSubmitting}
              />
            ) : (
              <Text>
                Please update the marker location in order to enter the name and
                description.
              </Text>
            )}
            {isSubmitting && (
              <Text
                style={{
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                Saving your submission...
              </Text>
            )}
          </ScrollView>
        </Card.Body>
        <Card.Footer style={styles.footer}>
          <Button
            title="Cancel"
            onPress={onCancel}
            color={colors.alert}
            disabled={isSubmitting}
          />
          <Button
            title={isSubmitting ? "Submitting..." : "Submit"}
            onPress={submitMarker}
            color={colors.primary}
            disabled={!location || isSubmitting}
          />
        </Card.Footer>
      </Card>
      <Modal
        visible={isModalVisible}
        style={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <KeyboardAvoidingView behavior="padding">
          <Tutorial>
            <Tutorial.Header text="Update the Marker's Location" />
            <Tutorial.Content>
              <View>
                <ManualLocationStepContent
                  setLocation={manuallyUpdateMarkerLocation}
                  location={location}
                />
              </View>
            </Tutorial.Content>
            <Tutorial.Footer style={{ justifyContent: "flex-end" }}>
              <Button
                title="Save"
                onPress={() => setIsModalVisible(false)}
                color={colors.primary}
              />
            </Tutorial.Footer>
          </Tutorial>
        </KeyboardAvoidingView>
      </Modal>
      <SubmissionTutorialModal
        type={type}
        setType={setType}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        visible={tutorialVisible}
        location={location}
        requestLocation={updateLocation}
        cancel={onCancel}
        close={() => setTutorialVisible(false)}
        images={images}
        setImages={setImages}
        useDeviceLocation={useDeviceLocation}
        toggleDeviceLocation={toggleDeviceLocation}
        setLocation={manuallyUpdateMarkerLocation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: { ...headerTextStyle },
  body: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  footer: {},
});
