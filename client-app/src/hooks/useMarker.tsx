import useSwr from "swr";
import { url, fetcher } from "utils";
import { LoadableMarker, MarkerDto } from "types";

interface MarkerByIdRequest {
  id: number;
}

export default function useMarkers(request: MarkerByIdRequest): LoadableMarker {
  const { id } = request;
  const { data, error } = useSwr<MarkerDto, boolean>(
    `${url}/api/markers/${id}`,
    fetcher
  );
  return {
    marker: data,
    isLoading: !error && !data,
    hasError: error,
  };
}
