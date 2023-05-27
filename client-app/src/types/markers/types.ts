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
  photos: MarkerPhotoDto[];
} & Location;

export interface MarkerPhotoDto {
  fileGuid: string;
  fileName: string;
}

export enum MarkerType {
  official,
  other,
}

export interface MarkerPhotoUpload {
  uri: string;
  height: number;
  width: number;
  fileSize?: number;
  guid?: string | undefined;
  uploadState: "pending" | "uploading" | "success" | "error"
}

export interface PostPhotoResponse
{
    photoGuid: string;
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
  | Visited
  | Authored
  | ForLater
  | CustomCategory;

export type Visited = { type: "Visited" };
export type Authored = { type: "Authored" };
export type ForLater = { type: "For Later" };
export type CustomCategory = { type: "Custom"; value: string };
