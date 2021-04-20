import { ImageSource, Location } from "types";

interface StepContentProps {
  name: string | null;
  setName: (name: string | null) => void;
  description: string | null;
  setDescription: (description: string | null) => void;
  requestLocation: () => void;
  location: Location | null;
  image: ImageSource | null;
  setImage: (image: ImageSource | null) => void;
  useDeviceLocation: boolean;
  toggleDeviceLocation: () => void;
  setLocation: (location: Location) => void;
}

interface NextButtonProps {
  requestLocation: () => void;
  goToNextStep: () => void;
  close: () => void;
  name: string | null;
  description: string | null;
}

export { StepContentProps, NextButtonProps };
