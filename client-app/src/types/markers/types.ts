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

export type SavedMarker = {
  id: number;
  name: string;
  type: MarkerType;
  categories: SavedMarkerCategory[];
} & Location;

export type SavedMarkerCategory =
  | "Visited"
  | "Authored"
  | "Save For Later"
  | CustomCategory;

export type CustomCategory = string;
