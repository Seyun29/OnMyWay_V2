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
export default function KeywordSearchBox() {
  const [value, setValue] = useState<number>(0);
  const [isRangeOn, setIsRangeOn] = useState<boolean>(true);
  const handleSelectRangeButton = () => {
    setIsRangeOn(!isRangeOn);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      // keyboardVerticalOffset={80} // 여기서 조정합니다.
      className="flex-1 absolute bottom-[50px] px-[16px] w-full h-fit">
      {isRangeOn && (
        <View className="px-[16px] bg-white mb-[12px] h-[88px] flex-row items-center justify-between rounded-[12px] shadow-md">
          <View className="flex flex-col w-[85%]">
            <Text className="text-[#A8A8A8] text-[12px]">반경</Text>
            <Slider
              value={value}
              onValueChange={setValue}
              step={5}
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
                  value == 0 ? 'text-[#3D3D3D]' : 'text-[#A8A8A8]'
                }`}>
                0km
              </Text>
              <Text
                className={`text-[12px] ${
                  value == 5 ? 'text-[#3D3D3D]' : 'text-[#A8A8A8]'
                }`}>
                5km
              </Text>
              <Text
                className={`text-[12px] ${
                  value == 10 ? 'text-[#3D3D3D]' : 'text-[#A8A8A8]'
                }`}>
                10km
              </Text>
              <Text
                className={`text-[12px] ${
                  value == 15 ? 'text-[#3D3D3D]' : 'text-[#A8A8A8]'
                }`}>
                15km
              </Text>
              <Text
                className={`text-[12px] ${
                  value == 20 ? 'text-[#3D3D3D]' : 'text-[#A8A8A8]'
                }`}>
                20km
              </Text>
            </View>
          </View>
          <Text className="text-[#2D7FF9] text-[14px]">확인</Text>
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

        <TextInput className="w-[80%]" placeholder="검색어 입력" autoFocus />
        <TouchableOpacity>
          <KewordSearchButtonSVG height={'24px'} width={'24px'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
