import React from "react";
import { MarkerType } from "types";
import { FormGroup } from "components/forms";
import { MarkerSelector } from "components/markers";

interface MarkerFormProps {
  type: MarkerType;
  setType: (type: MarkerType) => void;
  name: string | null;
  setName: (name: string | null) => void;
  description: string | null;
  setDescription: (description: string | null) => void;
  editable?: boolean;
}

export default function MarkerForm({
  type,
  setType,
  name,
  setName,
  description,
  setDescription,
  editable = true,
}: MarkerFormProps) {
  return (
    <>
      <MarkerSelector type={type} setType={setType} />
      <FormGroup
        label="Name:"
        value={name ?? undefined}
        onChangeText={setName}
        editable={editable}
        placeholder="Skirmish of Boutte Station"
      />
      <FormGroup
        label="Description:"
        value={description ?? undefined}
        onChangeText={setDescription}
        containerStyle={{ flexDirection: "column" }}
        placeholder="Union train with sixty men..."
        multiline={true}
        editable={editable}
        inputStyle={{ height: 100 }}
      />
    </>
  );
}
