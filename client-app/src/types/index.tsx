type Location = {
  latitude: number;
  longitude: number;
};

type MarkerDto = {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  isApproved: boolean;
  createdTimestamp: Date;
  distance: number;
} & Location;

export { Location, MarkerDto };
