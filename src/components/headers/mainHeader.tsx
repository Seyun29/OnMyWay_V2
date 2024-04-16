import React, {useState} from 'react';
import {Pressable, TextInput, View} from 'react-native';
import MenuIconSVG from '../../assets/images/menuIcon.svg';
import AddStopOverSVG from '../../assets/images/addStopOver.svg';
import ChangeDirectionSVG from '../../assets/images/changeDirection.svg';

export default function MainHeader() {
  const [text1, setText1] = useState<string>('');
  const [text2, setText2] = useState<string>('');

  const handlePress = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
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
      <MenuIconSVG height={'24px'} width={'24px'} />
      <View className="relative flex-row items-center justify-between w-full pr-[16px]">
        <View className="flex-col w-full pr-[10px]">
          <View className="absolute z-10 right-[20px] top-0 transform translate-y-[29px] bg-white h-[26px] w-[26px] rounded-[100px] shadow-md items-center justify-center">
            <AddStopOverSVG height={'18px'} width={'18px'} />
          </View>
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
        </View>
        <Pressable onPress={handlePress}>
          <ChangeDirectionSVG height={'24px'} width={'24px'} />
        </Pressable>
      </View>
    </View>
  );
}
