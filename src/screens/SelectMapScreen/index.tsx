import React from 'react';
import {Button, Text, View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import NaverMap from '../../components/naverMap';
import MainBottomSheet from '../../components/mainBotttomSheet';
import {useRecoilState} from 'recoil';
import {modalState} from '../../atoms/modalState';
import MainHeader from '../../components/headers/mainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParam} from '../../navigations';

export const SelectMapScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const [modalVisible, setModalVisible] = useRecoilState<boolean>(modalState);

  return (
    <SafeAreaView className="flex-1 bg-white w-full h-full">
      <View className="flex-1">
        <View className="flex-1">
          <NaverMap />
        </View>
        <View className="top-0 absolute w-full overflow-hidden pb-[8px]">
          <MainHeader />
        </View>
        {modalVisible && (
          <View className="absolute bottom-0 left-0 h-1/4 w-full">
            <MainBottomSheet />
          </View>
        )}
      </View>
      <Button
        title="Modal Test"
        onPress={() => setModalVisible(!modalVisible)}
      />
    </SafeAreaView>
  );
};
