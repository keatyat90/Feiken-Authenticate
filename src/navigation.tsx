// src/navigation.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "./HomeScreen";
import ScanScreen from "./ScanScreen";
import ContactForm from "./ContactForm";
import ScanHistoryScreen from "./ScanHistoryScreen";
import Help from "./HelpScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#ff9800" },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "white",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="barcode-scan" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Scan History"
        component={ScanHistoryScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="history" size={24} color={color} />
          ),
        }}
      />

      {/* NEW: Help as a tab */}
      <Tab.Screen
        name="Help"
        component={Help}
        options={{
          title: "Help & FAQ",
          tabBarLabel: "Help & FAQ",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="help-circle" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Tabs (Home, Scan, History, Help) */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* Keep ContactForm in stack for modal-like navigation */}
        <Stack.Screen name="ContactForm" component={ContactForm} />
        {/* Removed: separate Help stack screen to avoid duplicate routes */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
