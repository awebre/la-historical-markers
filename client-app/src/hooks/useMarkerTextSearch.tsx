import useSwr from "swr";
import queryString from "query-string";
import { url, fetcher } from "utils";
import { LoadableMarkers, Location, MarkerDto } from "types";

interface MarkerTextSearchRequest {
  search: string | null;
  userLocation: Location | null;
}

export default function useMarkers(
  request: MarkerTextSearchRequest
): LoadableMarkers {
  const parameters = queryString.stringify({
    userLocation: JSON.stringify(request.userLocation),
  });
  const { data, error } = useSwr<MarkerDto[], boolean>(
    request.search !== null
      ? `${url}/api/markers/search/${encodeURIComponent(
          request.search
        )}?${parameters}`
      : null,
    fetcher
  );
  return {
    markers: data,
    isLoading: !error && !data,
    hasError: error,
  };
}
