import { ImageSource, MarkerDto } from "types";

interface StepContentProps {
  marker: MarkerDto | null;
  setMarker: (marker: MarkerDto) => void;
  requestLocation: () => void;
  image: ImageSource | null;
  setImage: (image: ImageSource | null) => void;
}

interface NextButtonProps {
  requestLocation: () => void;
  goToNextStep: () => void;
}

export { StepContentProps, NextButtonProps };
