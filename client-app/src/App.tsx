import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { MarkersScreen } from "screens";
import * as Linking from "expo-linking";
import AdminScreen from "screens/AdminScreen";
import { RootParams } from "types";
import { colors } from "utils";

const Stack = createStackNavigator<RootParams>();
const prefix = Linking.createURL("/");

export default function App() {
  const linking = {
    prefixes: [prefix],
    config: {
      initialRouteName: "Markers",
      screens: {
        Markers: {
          path: "markers",
        },
        Admin: {
          path: "admin/:markerId",
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
          options={{
            headerTitle: "Edit Marker",
            headerTintColor: colors.lightText,
            headerStyle: { backgroundColor: colors.primary },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
