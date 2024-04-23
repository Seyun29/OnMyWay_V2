import React from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
} from 'react-native';
import PlaceInputHeader from '../../components/headers/placeInputHeader';
import NoHistorySVG from '../../assets/images/noHistory.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const store = async () => {
//   try {
//     await AsyncStorage.setItem('key', 'value');
//   } catch (e) {
//     // saving error
//   }
// };

// const get = async () => {
//   try {
//     const value = await AsyncStorage.getItem('key');
//     console.log('value: ', value);
//     if (value !== null) {
//       // value previously stored
//       return value;
//     }
//   } catch (e) {
//     // error reading value
//   }
//   return false;
// };

export default function PlaceInputScreen() {
  //FIXME: choose what to edit
  //FIXME: add 'keyboard.dismiss()' when user clicks outside of the input box
  //FIXME: use keyboardavoidingview so that the SVG is located differently when the keyboard is open

  //TODO: use asyncstorage => Use JSON.stringify() and JSON.parse() to store and retrieve objects and arrays.
  return (
    <SafeAreaView className="flex-1 bg-white w-full h-full">
      <PlaceInputHeader />
      {/* FIXME: use keyboardavoidingview only when there's NO history!!!! */}
      <Pressable
        className="flex-1"
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <KeyboardAvoidingView
          className="flex-1 justify-center items-center"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <NoHistorySVG height={130} width={130} />
        </KeyboardAvoidingView>
      </Pressable>
    </SafeAreaView>
  );
}
