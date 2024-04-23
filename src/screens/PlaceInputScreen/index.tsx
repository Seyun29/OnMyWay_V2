import React from 'react';
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Text,
  Platform,
  Pressable,
  Keyboard,
} from 'react-native';
import PlaceInputHeader from '../../components/headers/placeInputHeader';
import NoHistorySVG from '../../assets/images/noHistory.svg';

export default function PlaceInputScreen() {
  //FIXME: choose what to edit
  //FIXME: add 'keyboard.dismiss()' when user clicks outside of the input box
  //FIXME: use keyboardavoidingview so that the SVG is located differently when the keyboard is open
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
