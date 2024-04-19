import React, {useState, useEffect} from 'react';
import {
  Pressable,
  TextInput,
  View,
  LayoutAnimation,
  Text,
  TouchableOpacity,
} from 'react-native';
import MenuIconSVG from '../../assets/images/menuIcon.svg';
import AddStopOverSVG from '../../assets/images/addStopOver.svg';
import ChangeDirectionSVG from '../../assets/images/changeDirection.svg';
import HeaderLogoSVG from '../../assets/images/headerLogo.svg';
import {headerRoughState} from '../../atoms/headerRoughState';
import {useRecoilState} from 'recoil';

export default function MainHeader() {
  const [text1, setText1] = useState<string>('');
  const [text2, setText2] = useState<string>('');

  // const [isRough, setIsRough] = useState<boolean>(true);
  const [isRough, setIsRough] = useRecoilState<boolean>(headerRoughState);

  const handlePress = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  useEffect(() => {
    //apply layout animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isRough]);

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
      <View className="w-full flex-row justify-between align-center">
        <MenuIconSVG height={'24px'} width={'24px'} />
        <HeaderLogoSVG height={'24px'} />
        <View className="w-[24px] h-[24px]" />
      </View>
      <View className="relative flex-row items-center justify-between w-full pr-[16px]">
        <View className="flex-col w-full pr-[10px]">
          {!isRough && (
            <View className="absolute z-10 right-[20px] top-0 transform translate-y-[29px] bg-white h-[26px] w-[26px] rounded-[100px] shadow-md items-center justify-center">
              <AddStopOverSVG height={'18px'} width={'18px'} />
            </View>
          )}
          {isRough ? (
            <TextInput
              placeholder="간략한 헤더 (임시)"
              placeholderTextColor="#757575"
              value={text1}
              onChangeText={setText1}
              className="text-[#3D3D3D] h-[40px] bg-[#F2F2F2] mb-[2px] px-[12px]"
            />
          ) : (
            <>
              <TextInput
                placeholder="출발지 입력"
                placeholderTextColor="#757575"
                value={text1}
                onChangeText={setText1}
                className="text-[#3D3D3D] h-[40px] bg-[#F2F2F2] mb-[2px] px-[12px]"
              />
              <TextInput
                placeholder="도착지 입력"
                placeholderTextColor="#757575"
                value={text2}
                onChangeText={setText2}
                className="text-[#3D3D3D] h-[40px] bg-[#F2F2F2] px-[12px]"
              />
            </>
          )}
        </View>
        <Pressable onPress={handlePress}>
          <ChangeDirectionSVG height={'24px'} width={'24px'} />
        </Pressable>
      </View>
      <TouchableOpacity
        className="self-center"
        onPress={() => setIsRough(!isRough)}>
        <Text className="text-black">
          {isRough ? 'Expand Test' : 'Shrink Test'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
