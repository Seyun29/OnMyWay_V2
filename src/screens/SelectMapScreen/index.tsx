import React from 'react';
import {Button, Text, View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import NaverMap from '../../components/maps/naverMap';
import MainBottomSheet from '../../components/mainBotttomSheet';
import {useRecoilState} from 'recoil';
import {modalState} from '../../atoms/modalState';
import MainHeader from '../../components/headers/mainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParam} from '../../navigations';
import SelectOnMapHeader from '../../components/headers/selectOnMapHeader';
import SelectMap from '../../components/maps/selectMap';

export const SelectMapScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

  return (
    <SafeAreaView className="flex-1 bg-white w-full h-full">
      <View className="flex-1">
        <SelectOnMapHeader />
        <View className="flex-1">
          <SelectMap />
        </View>
        <Button
          title="확인"
          onPress={() => {
            console.log('click me ');
          }}
        />
      </View>
    </SafeAreaView>
  );
};
