import { useEffect, useCallback, useState } from "react";
import * as LocationManager from "expo-location";
import { Location } from "types";

interface UseLocationProps {
  autoExecute?: boolean;
  location: Location | null;
  setLocation: (location: Location) => void;
}

export default function useLocation({
  autoExecute = true,
  location,
  setLocation,
}: UseLocationProps) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const requestAndWatchLocation = useCallback(async () => {
    const {
      status,
    } = await LocationManager.requestForegroundPermissionsAsync();
    if (status !== LocationManager.PermissionStatus.GRANTED) {
      setPermissionGranted(false);
      return;
    }
    setPermissionGranted(true);
    await LocationManager.watchPositionAsync(
      { distanceInterval: 500 },
      ({ coords }) => setLocation(coords)
    );
  }, [setLocation]);

  useEffect(() => {
    if (autoExecute && location === null) {
      requestAndWatchLocation();
    }
  }, [location]);

  return { requestLocation: requestAndWatchLocation, permissionGranted };
}
