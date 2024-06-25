// src/navigations/BottomTabNavigation.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeStackNavigation from './HomeStackNavigation';
import Search from '../screens/Search';
import Favorite from '../screens/Favorite';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      component={HomeStackNavigation} // Menggunakan HomeStackNavigation sebagai komponen
      options={{
        tabBarIcon: ({ color }) => <Feather name="home" size={28} color={color} />,
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Search"
      component={Search}
      options={{
        tabBarIcon: ({ color }) => <Feather name="search" size={28} color={color} />,
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Favorite"
      component={Favorite}
      options={{
        tabBarIcon: ({ color }) => <Feather name="heart" size={28} color={color} />,
        headerShown: false,
      }}
    />
  </Tab.Navigator>
);

export default BottomTabNavigator;
