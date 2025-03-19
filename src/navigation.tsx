import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import ScanScreen from './ScanScreen';
import ContactForm from './ContactForm';
import ScanHistoryScreen from './ScanHistoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#ff9800' },
        tabBarActiveTintColor: 'white',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ) 
        }}
      />
      <Tab.Screen 
        name="Scan" 
        component={ScanScreen} 
        options={{ 
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="barcode-scan" size={24} color={color} />
          ) 
        }}
      />
       <Tab.Screen 
        name="Scan History" 
        component={ScanHistoryScreen} 
        options={{ 
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="history" size={24} color={color} />
          ) 
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ContactForm" component={ContactForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
