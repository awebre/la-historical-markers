import React, { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedMarker } from "types";

type SavedMarkersProviderProps = {
  children: React.ReactNode;
};

type SavedMarkers = {
  markers: SavedMarker[];
  addMarker: (marker: SavedMarker) => void;
  removeMarker: (id: number) => void;
  updateMarker: (marker: SavedMarker) => void;
};

const SAVED_MARKERS = "SAVED_MARKERS";
const SavedMarkersContext = React.createContext<SavedMarkers | null>(null);
export default SavedMarkersContext;

export function SavedMarkersProvider({ children }: SavedMarkersProviderProps) {
  const [savedMarkers, setSavedMarkers] = useState<SavedMarker[]>([]);

  useEffect(() => {
    const getSavedMarkers = async (
      setSavedMarkers: React.Dispatch<React.SetStateAction<SavedMarker[]>>
    ) => {
      const result = (await AsyncStorage.getItem(SAVED_MARKERS)) ?? "";
      const markers: SavedMarker[] = JSON.parse(result);
      setSavedMarkers(markers);
    };

    getSavedMarkers(setSavedMarkers);
  }, [setSavedMarkers]);

  const saveMarkers = useCallback(
    async (markers: SavedMarker[]) => {
      await AsyncStorage.setItem(
        SAVED_MARKERS,
        JSON.stringify(markers),
        (error) => {
          if (error !== undefined) {
            setSavedMarkers(markers);
          }
        }
      );
    },
    [setSavedMarkers]
  );

  const addMarker = useCallback(
    async (marker: SavedMarker) => {
      const isDuplicate =
        savedMarkers.find((m) => m.id == marker.id) !== undefined;
      if (isDuplicate) {
        return;
      }

      const updatedMarkers = [marker, ...savedMarkers];
      saveMarkers(updatedMarkers);
    },
    [savedMarkers, saveMarkers]
  );

  const updateMarker = useCallback(
    async (marker: SavedMarker) => {
      const removeIndex = savedMarkers.findIndex((m) => m.id == marker.id);
      if (removeIndex === -1) {
        saveMarkers([...savedMarkers, marker]);
      } else {
        saveMarkers([...savedMarkers.splice(removeIndex + 1, 1), marker]);
      }
    },
    [savedMarkers, saveMarkers]
  );

  const removeMarker = useCallback(
    async (id: number) => {
      const removeIndex = savedMarkers.findIndex((m) => m.id == id);
      if (removeIndex === -1) {
        return;
      }
      const updatedMarkers = savedMarkers.splice(removeIndex + 1, 1);
      saveMarkers(updatedMarkers);
    },
    [savedMarkers, saveMarkers]
  );
  const context = {
    markers: savedMarkers,
    addMarker,
    removeMarker,
    updateMarker,
  };

  return (
    <SavedMarkersContext.Provider value={context}>
      {children}
    </SavedMarkersContext.Provider>
  );
}
