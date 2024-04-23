import React from 'react';
import {Button, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParam} from '../../navigations';
import InputBoxEditable from './inputBoxEditable';
import CancelSVG from '../../assets/images/cancel.svg';
import {placeQuery} from '../../api/placeQuery';

export default function PlaceInputHeader({
  setResultList,
  setIsResult,
}: {
  setResultList: any;
  setIsResult: any;
}) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const handleSubmit = async (query: string) => {
    console.log('handleSubmit');
    if (query.length === 0) return;
    //FIXME: 입력값이 '확실한' 주소일 경우, 주소만 resultList로 보여줘야함
    const response = await placeQuery(query);
    //FIXME: Exception handling required here
    const newList = response.map((res: any) => ({
      placeName: res.place_name,
      addressName: res.address_name,
      roadAddressName: res.road_address_name,
      coordinate: {
        latitude: res.y,
        longitude: res.x,
      },
    }));
    setResultList(newList);
    setIsResult(true);
  };
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
        <InputBoxEditable handleSubmit={handleSubmit} />
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
