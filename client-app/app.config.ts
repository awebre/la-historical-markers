import "dotenv/config";
export default {
  name: "client-app",
  displayName: "LA Markers",
  expo: {
    name: "LAHM",
    slug: "la-historical-markers",
    version: process.env.VERSION,
    assetBundlePatterns: ["**/*"],
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "lahm",
    updates: {
      enabled: false,
    },
    ios: {
      icon: "./assets/icon.png",
      bundleIdentifier: "com.austinwebre.lahistoricalmarkers",
      buildNumber: `${process.env.BUILD_NUMBER}`,
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
      icon: "./assets/icon.png",
      adaptiveIcon: {
        foregroundImage: "./assets/android-icon.png",
        backgroundColor: "#754e27",
      },
      package: "com.austinwebre.lahistoricalmarkers",
      versionCode: parseInt(process.env.BUILD_NUMBER ?? "0"),
      permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION", "CAMERA"],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    extra: {
      eas: {
        projectId: "04c2ee8a-e8a3-4c98-b06e-772e30346c96",
      },
      apiUrl: process.env.API_URL,
      photosUrl: process.env.PHOTOS_URL,
    },
  },
};
