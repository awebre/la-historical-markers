import useSwr from "swr";
import queryString from "query-string";
import { url, fetcher } from "utils";
import { LoadableMarkers, Location, MarkerDto, MarkerType } from "types";

interface MarkerSearchRequest {
  region: MarkerRegionSearch;
  userLocation: Location | null;
  filters: MarkerType[];
}

interface MarkerRegionSearch {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function useMarkers(
  request: MarkerSearchRequest
): LoadableMarkers {
  const parameters = queryString.stringify({
    region: JSON.stringify(request.region),
    userLocation: JSON.stringify(request.userLocation),
    typeFilters: JSON.stringify(request.filters),
  });
  const { data, error } = useSwr<MarkerDto[], boolean>(
    `${url}/api/markers?${parameters}`,
    fetcher
  );
  return {
    markers: data,
    isLoading: !error && !data,
    hasError: error,
  };
}
