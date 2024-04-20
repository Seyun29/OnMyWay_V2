import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParam} from '../../navigations';
import SelectOnMapHeader from '../../components/headers/selectOnMapHeader';
import SelectMap from '../../components/maps/selectMap';
import {Center, Coordinate} from '../../config/types/coordinate';
import {useRecoilValue} from 'recoil';
import {lastCenterState} from '../../atoms/lastCenterState';
import {MAIN_RED_LIGHT} from '../../config/consts/style';

export const SelectMapScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const lastCenter = useRecoilValue<Center>(lastCenterState);
  const [coord, setCoord] = useState<Coordinate>(lastCenter);

  useEffect(() => {
    console.log('send API here : coord-to-address');
  }, [coord]);

  return (
    <SafeAreaView className="flex-1 bg-white w-full h-full">
      <View className="flex-1">
        <SelectOnMapHeader />
        <View className="flex-1">
          <SelectMap lastCenter={lastCenter} setCoord={setCoord} />
        </View>
        <View
          className="py-2 px-4"
          //FIXME: fix styles (draft for now)
        >
          <Text className="text-xl pb-3">강원 평창군 대화면 하안미리 1945</Text>
          <TouchableOpacity
            className="self-center w-full flex-row justify-center align-center py-1 rounded-lg"
            style={{
              backgroundColor: '#' + MAIN_RED_LIGHT,
            }}
            onPress={() => {
              navigation.goBack();
            }}>
            <Text className="text-xl text-white font-semibold">선택</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
