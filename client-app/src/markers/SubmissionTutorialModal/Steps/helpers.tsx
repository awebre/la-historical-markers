import steps, { keys } from ".";

function getNextStep(stepKey: string) {
  switch (stepKey) {
    case keys.start:
      return steps.find((x) => x.key === keys.location);
    case keys.location:
      return steps.find((x) => x.key === keys.image);
    case keys.image:
      return steps.find((x) => x.key === keys.description);
  }
}

export { getNextStep };
