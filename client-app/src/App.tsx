import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import { MarkersScreen } from "screens";
import * as Linking from "expo-linking";
import AdminScreen from "screens/AdminScreen";

const Stack = createStackNavigator();
const prefix = Linking.createURL("/");

export default function App() {
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Markers: {
          path: "markers",
        },
        Admin: {
          path: "admin",
        },
      },
    },
  };
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Markers">
        <Stack.Screen
          name="Markers"
          component={MarkersScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ headerTitle: "Administrate Marker" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
