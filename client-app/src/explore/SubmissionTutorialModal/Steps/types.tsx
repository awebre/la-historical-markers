import { ImageSource, Location, MarkerType } from "types";

interface StepContentProps extends LocationContentProps {
  type: MarkerType;
  setType: (type: MarkerType) => void;
  name: string | null;
  setName: (name: string | null) => void;
  description: string | null;
  setDescription: (description: string | null) => void;
  requestLocation: () => void;
  images: ImageSource[] | null;
  setImages: (image: ImageSource[] | null) => void;
  useDeviceLocation: boolean;
  toggleDeviceLocation: () => void;
  fileGuids: string[];
  setFileGuids: (guids: string[]) => void;
}

interface LocationContentProps {
  location: Location | null;
  setLocation: (location: Location) => void;
}

interface NextButtonProps {
  requestLocation: () => void;
  goToNextStep: () => void;
  close: () => void;
  name: string | null;
  description: string | null;
}

export { StepContentProps, LocationContentProps, NextButtonProps };
