import { ImageSource, Location } from "types";

interface StepContentProps extends LocationContentProps {
  name: string | null;
  setName: (name: string | null) => void;
  description: string | null;
  setDescription: (description: string | null) => void;
  requestLocation: () => void;
  image: ImageSource | null;
  setImage: (image: ImageSource | null) => void;
  useDeviceLocation: boolean;
  toggleDeviceLocation: () => void;
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
