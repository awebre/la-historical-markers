import useSwr from "swr";
import queryString from "query-string";
import { url, fetcher } from "utils";
import { Location, MarkerDto } from "types";

interface MarkerSearchRequest {
  region: MarkerRegionSearch;
  userLocation: Location | null;
}

interface MarkerRegionSearch {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface LoadableMarkers {
  markers: MarkerDto[] | undefined;
  isLoading: boolean;
  isError: boolean | undefined;
}

export default function useMarkers(
  request: MarkerSearchRequest
): LoadableMarkers {
  const parameters = queryString.stringify({
    region: JSON.stringify(request.region),
    userLocation: JSON.stringify(request.userLocation),
  });
  const { data, error } = useSwr<MarkerDto[], boolean>(
    `${url}/api/markers?${parameters}`,
    fetcher
  );
  return {
    markers: data,
    isLoading: !error && !data,
    isError: error,
  };
}
