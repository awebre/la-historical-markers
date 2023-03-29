import React from "react";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { ExploreScreen, AdminScreen, MyMarkersScreen } from "screens";
import { RootParams } from "types";
import { colors, routes } from "utils";
import { SavedMarkersProvider } from "saved-markers/SavedMarkersContext";
import SettingScreen from "screens/SettingScreen";
import { TailwindProvider } from "tailwind-rn";
import utilities from "../tailwind.json";

const Stack = createStackNavigator<RootParams>();
const prefix = Linking.createURL("/");
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <SavedMarkersProvider>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarStyle: [
            {
              backgroundColor: colors.mediumBackground,
            },
            null,
          ],
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            tabBarLabel: "Explore",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="compass" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="MyMarkers"
          component={MyMarkersScreen}
          options={{
            tabBarLabel: "My Markers",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="map" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="More"
          component={SettingScreen}
          options={{
            tabBarLabel: "More",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="ellipsis-h" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </SavedMarkersProvider>
  );
}

export default function App() {
  const linking: LinkingOptions<{ Home: any; Admin: any }> = {
    prefixes: [prefix],
    config: {
      initialRouteName: "Home",
      screens: {
        Home: {
          screens: {
            Explore: routes.explore,
            MyMarkers: routes.myMarkers,
            More: routes.more,
          },
        },
        Admin: {
          path: `${routes.adminMarker}/:markerId`,
        },
      },
    },
  };
  return (
    <TailwindProvider utilities={utilities}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Tabs}
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
    </TailwindProvider>
  );
}
