import steps, { keys } from ".";

function getNextStep(stepKey: string, useDeviceLocation: boolean) {
  switch (stepKey) {
    case keys.start:
      if (useDeviceLocation) {
        return steps.find((x) => x.key === keys.deviceLocation);
      } else {
        return steps.find((x) => x.key === keys.manualLocation);
      }
    case keys.deviceLocation:
    case keys.manualLocation:
      return steps.find((x) => x.key === keys.image);
    case keys.image:
      return steps.find((x) => x.key === keys.description);
  }
}

export { getNextStep };
