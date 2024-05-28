import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  Touchable,
  Alert,
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
import {setMinMaxValue} from '../config/helpers/route';
import BackToListSVG from '../assets/images/backToList.svg';
import {listModalState} from '../atoms/listModalState';

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
  const [, setListModalVisible] = useRecoilState<boolean>(listModalState);

  const [value, setValue] = useState<number>(1);
  const [isRangeOn, setIsRangeOn] = useState<boolean>(true);
  const [minMax, setMinMax] = useState<number[]>([0, 20]);

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
    const radius = value > 20 ? 20000 : value * 1000;
    const totalDistance = selectedRoute?.distance;
    const data = await searchOnPath({query, path, totalDistance, radius});
    if (data && data.length > 0) {
      const resultList = data.map((res: PlaceDetail) => ({
        ...res,
        coordinate: {latitude: res.y, longitude: res.x},
      }));
      setResult(resultList);
      setListModalVisible(true);
    } else {
      Alert.alert('검색 결과가 없습니다.');
      setResult(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (result && result.length > 0) {
      setShowAlternative(true);
    }
  }, [result]);

  useEffect(() => {
    if (selectedRoute) {
      const res = setMinMaxValue(selectedRoute.distance);
      setMinMax(res);
      setValue(res[0]);
    }
  }, [selectedRoute]);

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
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            className="rounded-full bg-white pl-5 pr-3 py-1.5 border-2 flex-row"
            style={{
              borderColor: '#9CC7FF',
            }}
            onPress={() => {
              setShowAlternative(false);
              setModalVisible(false);
              setListModalVisible(false);
              //@ts-ignore
              setTimeout(() => inputRef.current.focus(), 300);
            }}>
            <View className="border-r pr-2 mr-2 border-slate-500">
              <Text className="font-bold text-xs">검색어</Text>
            </View>
            <Text className="text-xs mr-3">{query}</Text>
            <KewordSearchButtonSVG height={'18px'} width={'18px'} />
          </TouchableOpacity>
          {/* <TouchableOpacity className="bg-white rounded-full ml-2 border-3 border-gray-700">
            <BackToListSVG height={27} width={27} />
          </TouchableOpacity> */}
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={70} // 여기서 조정
          className="flex-1 absolute bottom-10 px-[16px] w-full">
          {isRangeOn && (
            <View className="px-[16px] bg-white mb-[12px] h-[88px] flex-row items-center justify-between rounded-[20px] shadow-md">
              <View className="flex flex-col w-full">
                <View className="flex-row justify-between w-full pb-1">
                  <Text className="text-[#A8A8A8] text-[12px] font-bold">
                    검색 반경
                  </Text>
                  <Text className="text-[#3D3D3D] text-[12px] font-semibold">
                    {value}km
                  </Text>
                </View>
                <Slider
                  value={value}
                  onValueChange={setValue}
                  step={0.5}
                  minimumValue={minMax[0]}
                  maximumValue={minMax[1]}
                  trackStyle={{
                    height: 4,
                    backgroundColor: '#9CC7FF',
                    borderCurve: 'circular',
                  }}
                  thumbSize={17}
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
                <View className="flex-row justify-between w-full">
                  <Text
                    className={`text-[12px] ${
                      value >= Math.floor(minMax[0])
                        ? 'text-[#3D3D3D]'
                        : 'text-[#A8A8A8]'
                    }`}>
                    {`${minMax[0].toFixed(1)}km`}
                  </Text>
                  <Text
                    className={`text-[12px] ${
                      value >=
                      Math.floor(minMax[0] + (minMax[1] - minMax[0]) / 4)
                        ? 'text-[#3D3D3D]'
                        : 'text-[#A8A8A8]'
                    }`}>
                    {`${(minMax[0] + (minMax[1] - minMax[0]) / 4).toFixed(
                      1,
                    )}km`}
                  </Text>
                  <Text
                    className={`text-[12px] ${
                      value >=
                      Math.floor(minMax[0] + (2 * (minMax[1] - minMax[0])) / 4)
                        ? 'text-[#3D3D3D]'
                        : 'text-[#A8A8A8]'
                    }`}>
                    {`${(minMax[0] + (2 * (minMax[1] - minMax[0])) / 4).toFixed(
                      1,
                    )}km`}
                  </Text>
                  <Text
                    className={`text-[12px] ${
                      value >=
                      Math.floor(minMax[0] + (3 * (minMax[1] - minMax[0])) / 4)
                        ? 'text-[#3D3D3D]'
                        : 'text-[#A8A8A8]'
                    }`}>
                    {`${(minMax[0] + (3 * (minMax[1] - minMax[0])) / 4).toFixed(
                      1,
                    )}km`}
                  </Text>
                  <Text
                    className={`text-[12px] ${
                      value >= Math.floor(minMax[1])
                        ? 'text-[#3D3D3D]'
                        : 'text-[#A8A8A8]'
                    }`}>
                    {`${minMax[1].toFixed(1)}km`}
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
