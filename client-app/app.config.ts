//increase this for build version bumps (internal to app stores)
const buildNumber = 13;
export default {
  name: "client-app",
  displayName: "LA Markers",
  expo: {
    name: "LA Historical Markers",
    slug: "la-historical-markers",
    version: "1.2.1",
    assetBundlePatterns: ["**/*"],
    orientation: "portrait",
    icon: "./icon.png",
    ios: {
      bundleIdentifier: "com.austinwebre.lahistoricalmarkers",
      buildNumber: `${buildNumber}`,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "This app uses your location to search for nearby markers.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "This app uses your location to search for nearby markers.",
        NSCameraUsageDescription:
          "This app uses your camera to submit photos of markers.",
        NSPhotoLibraryUsageDescription:
          "This app uses your camera roll to submit photos of markers.",
        LSApplicationQueriesSchemes: ["comgooglemaps", "waze"],
      },
    },
    android: {
      package: "com.austinwebre.lahistoricalmarkers",
      versionCode: buildNumber,
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
      ],
      config: {
        googleMaps: {
          apiKey: "",
        },
      },
    },
  },
};
