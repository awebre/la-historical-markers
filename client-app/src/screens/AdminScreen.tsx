import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { MarkerDto, RootParams } from "types";
import { useMarker } from "hooks";
import { FormGroup } from "components/forms";
import { colors } from "utils";
import { DismissKeyboard, LoadingIndicator } from "components";

type Props = StackScreenProps<RootParams, "Admin">;

export default function AdminScreen({ route }: Props) {
  const { markerId, otp } = route.params || {};
  const { marker, isLoading, hasError } = useMarker({ id: markerId });
  const [markerDto, setMarkerDto] = useState<MarkerDto | null>(null);
  useEffect(() => setMarkerDto(marker ?? null), [marker]);

  return (
    <DismissKeyboard>
      <View style={styles.screen}>
        {isLoading && !hasError && <LoadingIndicator size={100} />}
        {!isLoading && !hasError && marker && (
          <View>
            <FormGroup
              label="Marker Name:"
              value={markerDto?.name}
              onChangeText={(name) =>
                setMarkerDto({
                  ...(markerDto ? markerDto : ({} as MarkerDto)),
                  name,
                })
              }
              editable={true}
            />
          </View>
        )}
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    height: "100%",
    backgroundColor: colors.lightBackground,
  },
});
