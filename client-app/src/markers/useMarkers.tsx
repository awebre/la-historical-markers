import useSwr from "swr";
import queryString from "query-string";
import { url, fetcher } from "utils/";

export type MarkerDto = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  isApproved: boolean;
  createdTimestamp: Date;
  distance: number;
};

export type UserLocation = {
  latitude: number;
  longitude: number;
};

interface MarkerSearchRequest {
  region: MarkerRegionSearch;
  userLocation: UserLocation | null;
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
