import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../screens/HomeScreen';
import {TestScreen} from '../screens/TestScreen';
import {SelectMapScreen} from '../screens/SelectMapScreen';

const Stack = createNativeStackNavigator();

export type RootStackParam = {
  Home: undefined;
  Test: undefined;
  SelectMap: undefined;
};

export default function RootStackNavigation() {
  return (
    <NavigationContainer>
      {/* FIXME: update animation on screen transition (Android, IOS) */}
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SelectMap" component={SelectMapScreen} />
        <Stack.Screen name="Test" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
