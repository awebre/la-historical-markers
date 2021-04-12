import React from "react";
import { MarkerDto } from "types";
import { FormGroup } from "components/forms";

interface MarkerFormProps {
  marker: MarkerDto;
  setMarker: (marker: MarkerDto) => void;
  editable?: boolean;
}

export default function MarkerForm({
  marker,
  setMarker,
  editable = false,
}: MarkerFormProps) {
  return (
    <>
      <FormGroup
        label="Name:"
        value={marker?.name}
        onChangeText={(name) =>
          setMarker(marker ? { ...marker, name } : ({ name } as MarkerDto))
        }
        editable={editable}
        placeholder="Skirmish of Boutte Station"
      />
      <FormGroup
        label="Description:"
        value={marker?.description}
        onChangeText={(description) =>
          setMarker(
            marker ? { ...marker, description } : ({ description } as MarkerDto)
          )
        }
        containerStyle={{ flexDirection: "column" }}
        placeholder="Union train with sixty men..."
        multiline={true}
        editable={editable}
        inputStyle={{ height: 100 }}
      />
    </>
  );
}
