import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RouteKey} from './RouteKey.ts';
import {LocationScreen, SettingsScreen} from '../screens';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name={RouteKey.Location} component={LocationScreen} />
        <Tab.Screen name={RouteKey.Settings} component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
