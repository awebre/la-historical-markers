import useSwr from "swr";
import { LoadableMarker, MarkerDto } from "types";
import { fetcher, url } from "utils";

interface MarkerByIdRequest {
  id: number;
}

export default function useMarkers(request: MarkerByIdRequest): LoadableMarker {
  const { id } = request;
  const resp = useSwr<MarkerDto, boolean>(`${url}/api/markers/${id}`, fetcher);
  const { data, error } = resp;
  return {
    marker: data,
    isLoading: !error && !data,
    hasError: error,
  };
}
