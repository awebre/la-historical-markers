export default {
  name: "client-app",
  displayName: "LA Markers",
  expo: {
    name: "LA Historical Markers",
    slug: "la-historical-markers",
    version: "1.1.1",
    assetBundlePatterns: ["**/*"],
    orientation: "portrait",
    icon: "./icon.png",
    ios: {
      bundleIdentifier: "com.austinwebre.lahistoricalmarkers",
      buildNumber: "1.1.1",
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "This app uses your location to search for nearby markers.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "This app uses your location to search for nearby markers.",
        NSCameraUsageDescription:
          "This app uses your camera to submit photos of markers.",
        NSPhotoLibraryUsageDescription:
          "This app uses your camera roll to submit photos of markers.",
      },
    },
    android: {
      package: "com.austinwebre.lahistoricalmarkers",
      versionCode: 7,
      permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
      config: {
        googleMaps: {
          apiKey: "",
        },
      },
    },
    extra: {
      imageBaseUrl: "https://lahm-photos.thewebre.com/marker-photos",
    },
  },
};
