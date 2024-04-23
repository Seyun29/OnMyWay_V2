import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../screens/HomeScreen';
import {TestScreen} from '../screens/TestScreen';
import {SelectMapScreen} from '../screens/SelectMapScreen';
import PlaceInputScreen from '../screens/PlaceInputScreen';

const Stack = createNativeStackNavigator();

export type RootStackParam = {
  Home: undefined;
  Test: undefined;
  SelectMap: undefined;
  PlaceInput: undefined;
  PlaceInputDetail: undefined;
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
        {/* FIXME: add bottom-up modal like animations when screen transition */}
        <Stack.Screen name="PlaceInput" component={PlaceInputScreen} />

        <Stack.Screen name="Test" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
