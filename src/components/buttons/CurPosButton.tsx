import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import CurPosButtonSVG from '../../assets/images/curPosButton.svg';

export default function CurPosButton({onPress}: {onPress: () => void}) {
  return (
    <TouchableOpacity
      className="absolute right-2.5 bottom-2.5"
      onPress={onPress}
      activeOpacity={0.2}>
      <CurPosButtonSVG height="50px" width="50px" />
      {/* <Text className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold">
        ㅎㅇ
      </Text> */}
    </TouchableOpacity>
  );
}
