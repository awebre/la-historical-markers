export function metersToMiles(meters: number) {
  return meters * 0.000621371192;
}

export function milesToFeet(miles: number) {
  return miles * 5280;
}

export default function humanizedDistance(meters: number) {
  const miles = metersToMiles(meters);
  const feet = milesToFeet(miles);
  return miles >= 0.01
    ? `${miles.toFixed(2)} miles`
    : feet >= 100
    ? `${feet.toFixed(0)} feet`
    : "Nearby";
}
