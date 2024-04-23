import React from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {navigationState} from '../../atoms/navigationState';
import {useRecoilState} from 'recoil';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParam} from '../../navigations';
import InputBoxEditable from './inputBoxEditable';
import CancelSVG from '../../assets/images/cancel.svg';

export default function PlaceInputHeader() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const [nav, setNav] = useRecoilState(navigationState);
  return (
    <View
      style={{
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      }}
      className="bg-white w-full justify-start items-start px-[16px] pt-[16px] pb-[13px] gap-y-[13px]">
      <View className="relative w-full flex-row items-center justify-around">
        <InputBoxEditable text={nav.start} altText={'출발지 입력'} />
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <CancelSVG height={25} width={25} />
        </TouchableOpacity>
      </View>
      <View className="flex-row w-full items-center justify-between">
        <Button title="최근검색" />
        <Button title="즐겨찾기" />
        <Button
          title="지도에서 선택 Test"
          onPress={() => {
            //FIXME: pass state, setState to SelectMap screen
            navigation.navigate('SelectMap');
          }}
        />
      </View>
    </View>
  );
}
