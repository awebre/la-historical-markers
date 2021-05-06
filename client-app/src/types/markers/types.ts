import { Loadable } from "types/loadables/types";

export type Location = {
  latitude: number;
  longitude: number;
};

export type MarkerDto = {
  id: number;
  name: string;
  description: string;
  imageFileName?: string;
  isApproved: boolean;
  createdTimestamp: Date;
  distance: number;
  type: MarkerType;
} & Location;

export enum MarkerType {
  official,
  other,
}

export interface ImageSource {
  uri: string;
  height: number;
  width: number;
}

export type LoadableMarkers = {
  markers: MarkerDto[] | undefined;
} & Loadable;

export type LoadableMarker = {
  marker: MarkerDto | undefined;
} & Loadable;
