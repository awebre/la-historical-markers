import React from "react";
import { MarkerDto } from "types";
import { FormGroup } from "components/forms";

interface MarkerFormProps {
  name: string | null;
  setName: (name: string | null) => void;
  description: string | null;
  setDescription: (description: string | null) => void;
  editable?: boolean;
}

export default function MarkerForm({
  name,
  setName,
  description,
  setDescription,
  editable = true,
}: MarkerFormProps) {
  return (
    <>
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
