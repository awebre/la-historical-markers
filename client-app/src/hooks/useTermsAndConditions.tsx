import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TERMS_ACCEPTED = "TERMS_ACCEPTED";
export default function useTermsAndConditions() {
  const [hasAccepted, setHasAccepted] = useState<boolean | null>(null);
  const checkTerms = async (
    setHasAccepted: React.Dispatch<React.SetStateAction<boolean | null>>
  ) => {
    const result = await AsyncStorage.getItem(TERMS_ACCEPTED);
    setHasAccepted(result === "true");
  };

  const acceptTerms = async () => {
    await AsyncStorage.setItem(TERMS_ACCEPTED, "true", () =>
      setHasAccepted(true)
    );
  };
  useEffect(() => {
    checkTerms(setHasAccepted);
  }, [hasAccepted, setHasAccepted]);

  return { requiresAcceptance: hasAccepted === false, acceptTerms };
}
