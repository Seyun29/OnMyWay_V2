import React from 'react';
import {TouchableOpacity, View, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParam} from '../../navigations';
import InputBoxEditable from './inputBoxEditable';
import CancelSVG from '../../assets/images/cancel.svg';
import {placeQuery} from '../../api/placeQuery';
import SelectOnMapSVG from '../../assets/images/selectOnMap.svg';
import CurPosInputSVG from '../../assets/images/curPosInput.svg';
import FavoriteSVG from '../../assets/images/favorite.svg';
import Toast from 'react-native-toast-message';

export default function PlaceInputHeader({
  setResultList,
  setIsResult,
  onCurPosPress,
}: {
  setResultList: any;
  setIsResult: any;
  onCurPosPress: () => void;
}) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const handleSubmit = async (query: string) => {
    if (query.length === 0) return;
    //FIXME: 입력값이 '확실한' 주소일 경우, 주소만 resultList로 보여줘야함
    const response = await placeQuery(query);
    if (response.length === 0) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: '검색 결과가 없습니다',
        topOffset: Dimensions.get('window').height / 5,
      });
      return;
    }
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
      className="bg-white w-full justify-start items-start px-[16px] pt-[16px] ">
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
        <TouchableOpacity onPress={onCurPosPress}>
          <CurPosInputSVG />
        </TouchableOpacity>
        <TouchableOpacity>
          <FavoriteSVG />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            //FIXME: pass state, setState to SelectMap screen
            navigation.navigate('SelectMap');
          }}>
          <SelectOnMapSVG />
        </TouchableOpacity>
      </View>
    </View>
  );
}
