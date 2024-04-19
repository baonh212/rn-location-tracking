import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RouteKey} from './RouteKey.ts';
import {
  LocationDetailsScreen,
  LocationScreen,
  SettingsScreen,
} from '../screens';
import {createStackNavigator} from '@react-navigation/stack';
import {AppStackParamList} from './types.ts';

const Stack = createStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator();

const LocationStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={RouteKey.Location} component={LocationScreen} />
      <Stack.Screen
        name={RouteKey.LocationDetails}
        component={LocationDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name={RouteKey.LocationStack} component={LocationStack} />
        <Tab.Screen name={RouteKey.Settings} component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
