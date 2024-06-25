// src/navigations/HomeStackNavigation.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import MovieDetail from '../screens/MovieDetail';

const Stack = createStackNavigator();

const HomeStackNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="MovieDetail"
      component={MovieDetail}
      options={{ title: 'Movie Detail' }}
    />
  </Stack.Navigator>
);

export default HomeStackNavigation;
