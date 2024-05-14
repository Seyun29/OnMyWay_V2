import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import {Slider} from '@react-native-assets/slider';
import SelectRangeButtonOffSVG from '../assets/images/selectRangeButtonOff.svg';
import SelectRangeButtonOnSVG from '../assets/images/selectRangeButtonOn.svg';
import KewordSearchButtonSVG from '../assets/images/kewordSearchButton.svg';
import {searchOnPath} from '../api/searchOnPath';
import {Coordinate, PlaceDetail} from '../config/types/coordinate';
import {RouteDetail} from '../config/types/routes';
import {useRecoilState, useRecoilValue} from 'recoil';
import {loadingState} from '../atoms/loadingState';
import Toast from 'react-native-toast-message';
import {headerRoughState} from '../atoms/headerRoughState';
import {ROUGH_HEADER_HEIGHT, WINDOW_WIDTH} from '../config/consts/style';
import {modalState} from '../atoms/modalState';

export default function KeywordSearchBox({
  selectedRoute,
  result,
  setResult,
  query,
  setQuery,
  showAlternative,
  setShowAlternative,
}: {
  selectedRoute: RouteDetail | null;
  result: PlaceDetail[] | null;
  setResult: any;
  query: string;
  setQuery: any;
  showAlternative: boolean;
  setShowAlternative: any;
}) {
  const isRough = useRecoilValue<boolean>(headerRoughState);
  const [, setLoading] = useRecoilState<boolean>(loadingState);
  const [, setModalVisible] = useRecoilState<boolean>(modalState);
  const [value, setValue] = useState<number>(2);
  const [isRangeOn, setIsRangeOn] = useState<boolean>(true);

  const inputRef = React.useRef(null);

  const handleSelectRangeButton = () => {
    setIsRangeOn(!isRangeOn);
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    setLoading(true);
    const path: number[][] = [];
    selectedRoute?.path?.map(coord => {
      path.push([coord.longitude, coord.latitude]);
    });
    const radius = value * 1000;
    const totalDistance = selectedRoute?.distance;
    const data = await searchOnPath({query, path, totalDistance, radius});
    if (data && data.length > 0) {
      const resultList = data.map((res: PlaceDetail) => ({
        ...res,
        coordinate: {latitude: res.y, longitude: res.x},
      }));
      setResult(resultList);
    } else {
      Toast.show({
        type: 'error',
        text1: '검색 결과가 없습니다.',
        topOffset: 200,
      });
      setResult(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (result && result.length > 0) {
      setShowAlternative(true);
    }
  }, [result]);

  if (!selectedRoute) return null;

  return (
    <>
      {showAlternative ? (
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'transparent',
            top: (isRough ? 1.5 : 2) * ROUGH_HEADER_HEIGHT,
            width: WINDOW_WIDTH,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            className="rounded-full bg-white pl-5 pr-3 py-1.5 border-2 flex-row"
            style={{
              borderColor: '#9CC7FF',
            }}
            onPress={() => {
              setShowAlternative(false);
              setModalVisible(false);
              //@ts-ignore
              setTimeout(() => inputRef.current.focus(), 300);
            }}>
            <View className="border-r pr-2 mr-2 border-slate-500">
              <Text className="font-bold text-xs">검색어</Text>
            </View>
            <Text className="text-xs mr-3">{query}</Text>
            <KewordSearchButtonSVG height={'18px'} width={'18px'} />
          </TouchableOpacity>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={70} // 여기서 조정
          className="flex-1 absolute bottom-10 px-[16px] w-full">
          {isRangeOn && (
            <View className="px-[16px] bg-white mb-[12px] h-[88px] flex-row items-center justify-between rounded-[20px] shadow-md">
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
          <TouchableOpacity
            className="w-full h-[45px] bg-white rounded-full shadow-md flex-row items-center px-[16px] justify-between"
            activeOpacity={0.8}
            disabled={result === null || result.length === 0}
            onPress={() => {
              setIsRangeOn(true);
              //@ts-ignore
              if (inputRef.current) inputRef.current.focus();
            }}>
            <TouchableOpacity onPress={handleSelectRangeButton} className="">
              {isRangeOn ? (
                <SelectRangeButtonOnSVG height={'24px'} width={'24px'} />
              ) : (
                <SelectRangeButtonOffSVG height={'24px'} width={'24px'} />
              )}
            </TouchableOpacity>
            <TextInput
              ref={inputRef}
              className="w-[80%] h-full pl-3"
              placeholder="검색어 입력"
              value={query}
              onChangeText={setQuery}
              // autoFocus
              onSubmitEditing={onSubmit}
              onFocus={() => setIsRangeOn(true)}
            />
            <TouchableOpacity onPress={onSubmit}>
              <KewordSearchButtonSVG height={'24px'} width={'24px'} />
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </>
  );
}
