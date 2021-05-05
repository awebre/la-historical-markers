type Location = {
  latitude: number;
  longitude: number;
};

type MarkerDto = {
  id: number;
  name: string;
  description: string;
  imageFileName?: string;
  isApproved: boolean;
  createdTimestamp: Date;
  distance: number;
  type: MarkerType;
} & Location;

enum MarkerType {
  official,
  other,
}

interface ImageSource {
  uri: string;
  height: number;
  width: number;
}

export { Location, MarkerDto, ImageSource, MarkerType };
