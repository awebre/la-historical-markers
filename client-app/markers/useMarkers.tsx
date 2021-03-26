import useSwr from "swr";
import queryString from "query-string";
import { url, fetcher } from "../utils";

type MarkerDto = {
  Id: number;
  Name: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  ImageUrl?: string;
  IsApproved: boolean;
  CreatedTimestamp: Date;
};

interface IMarkerRegionSearch {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function useMarkers(regionSearch: IMarkerRegionSearch) {
  const parameters = queryString.stringify(regionSearch);
  const { data, error } = useSwr<MarkerDto[], boolean>(
    `${url}/api/markers?${parameters}`,
    fetcher
  );
  return { markers: data, isLoading: !error && !data, isError: error };
}
