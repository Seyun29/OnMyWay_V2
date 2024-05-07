import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Slider} from '@react-native-assets/slider';
import SelectRangeButtonOffSVG from '../assets/images/selectRangeButtonOff.svg';
import SelectRangeButtonOnSVG from '../assets/images/selectRangeButtonOn.svg';
import KewordSearchButtonSVG from '../assets/images/kewordSearchButton.svg';
import {searchOnPath} from '../api/searchOnPath';
import {Coordinate} from '../config/types/coordinate';
import {RouteDetail} from '../config/types/routes';
import {useRecoilState} from 'recoil';
import {loadingState} from '../atoms/loadingState';
import Toast from 'react-native-toast-message';

export default function KeywordSearchBox({
  selectedRoute,
  setResult,
}: {
  selectedRoute: RouteDetail | null;
  setResult: any;
}) {
  const [, setLoading] = useRecoilState<boolean>(loadingState);
  const [value, setValue] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [isRangeOn, setIsRangeOn] = useState<boolean>(true);
  const handleSelectRangeButton = () => {
    setIsRangeOn(!isRangeOn);
  };

  const onSubmit = async () => {
    setLoading(true);
    const path: number[][] = [];
    selectedRoute?.path?.map(coord => {
      path.push([coord.longitude, coord.latitude]);
    });
    const radius = value * 1000;
    const totalDistance = selectedRoute?.distance;
    const data = await searchOnPath({query, path, totalDistance, radius});
    if (data && data.length > 0) {
      const coords = data.map((result: any) => ({
        latitude: result.y,
        longitude: result.x,
      }));
      setResult(coords);
    } else
      Toast.show({
        type: 'error',
        text1: '검색 결과가 없습니다.',
        topOffset: 200,
      });
    setLoading(false);
  };

  if (!selectedRoute) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80} // 여기서 조정
      className="flex-1 absolute bottom-10 px-[16px] w-full">
      {isRangeOn && (
        <View className="px-[16px] bg-white mb-[12px] h-[88px] flex-row items-center justify-between rounded-[12px] shadow-md">
          <View className="flex flex-col w-full">
            <View className="flex-row justify-between w-full">
              <Text className="text-[#A8A8A8] text-[12px]">검색 반경</Text>
              <Text className="text-[#3D3D3D] text-[12px]">{value}km</Text>
            </View>
            <Slider
              value={value}
              onValueChange={setValue}
              step={1}
              minimumValue={0}
              maximumValue={20}
              trackStyle={{
                height: 4,
                backgroundColor: '#9CC7FF',
                borderCurve: 'circular',
              }}
              thumbSize={20}
              thumbStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#B5B9BD',
                borderWidth: 0.5,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 1,
              }}
            />
            <View className="flex-row justify-between w-[100%]">
              <Text
                className={`text-[12px] ${
                  value >= 0 ? 'text-[#3D3D3D]' : 'text-[#A8A8A8]'
                }`}>
                0km
              </Text>
              <Text
                className={`text-[12px] ${
                  value >= 5 ? 'text-[#3D3D3D]' : 'text-[#A8A8A8]'
                }`}>
                5km
              </Text>
              <Text
                className={`text-[12px] ${
                  value >= 10 ? 'text-[#3D3D3D]' : 'text-[#A8A8A8]'
                }`}>
                10km
              </Text>
              <Text
                className={`text-[12px] ${
                  value >= 15 ? 'text-[#3D3D3D]' : 'text-[#A8A8A8]'
                }`}>
                15km
              </Text>
              <Text
                className={`text-[12px] ${
                  value >= 20 ? 'text-[#3D3D3D]' : 'text-[#A8A8A8]'
                }`}>
                20km
              </Text>
            </View>
          </View>
        </View>
      )}
      <View className="w-full h-[56px] bg-white rounded-[12px] shadow-md flex-row items-center px-[16px] justify-between">
        <TouchableOpacity onPress={handleSelectRangeButton} className="">
          {isRangeOn ? (
            <SelectRangeButtonOnSVG height={'24px'} width={'24px'} />
          ) : (
            <SelectRangeButtonOffSVG height={'24px'} width={'24px'} />
          )}
        </TouchableOpacity>

        <TextInput
          className="w-[80%]"
          placeholder="검색어 입력"
          value={query}
          onChangeText={setQuery}
          autoFocus
          onSubmitEditing={onSubmit}
        />
        <TouchableOpacity onPress={onSubmit}>
          <KewordSearchButtonSVG height={'24px'} width={'24px'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
