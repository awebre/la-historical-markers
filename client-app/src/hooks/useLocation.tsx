import { useEffect, useCallback, useState } from "react";
import * as LocationManager from "expo-location";
import { Location } from "types";

interface UseLocationProps {
  setLocation: (location: Location) => void;
}

export default function useLocation({ setLocation }: UseLocationProps) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const requestLocationPermission = async () => {
    const {
      status,
    } = await LocationManager.requestForegroundPermissionsAsync();
    return status !== LocationManager.PermissionStatus.GRANTED ? false : true;
  };

  const requestAndUpdateLocation = useCallback(async () => {
    const locationGranted = await requestLocationPermission();
    setPermissionGranted(locationGranted);
    if (!locationGranted) {
      return;
    }

    const { coords } = await LocationManager.getCurrentPositionAsync();
    setLocation(coords);
  }, [setPermissionGranted, setLocation]);

  const requestAndWatchLocation = useCallback(async () => {
    const locationGranted = await requestLocationPermission();
    setPermissionGranted(locationGranted);
    if (!locationGranted) {
      return;
    }

    const { remove } = await LocationManager.watchPositionAsync(
      { distanceInterval: 500 },
      ({ coords }) => setLocation(coords)
    );
    return remove;
  }, [setLocation, setPermissionGranted]);

  return {
    watchLocation: requestAndWatchLocation,
    updateLocation: requestAndUpdateLocation,
    permissionGranted,
  };
}
