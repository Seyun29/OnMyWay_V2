import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import CurPosButtonSVG from '../../assets/images/curPosButton.svg';

export default function CurPosButton({onPress}: {onPress: () => void}) {
  return (
    <TouchableOpacity
      className="absolute right-2.5 bottom-2.5"
      onPress={onPress}
      activeOpacity={0.2}>
      {/* <CurPosButtonSVG height="50px" width="50px" /> 
      FIXME: SVG not working properly, using PNG for now
      */}
      <Image
        className="w-12 h-12"
        source={require('../../assets/images/curPosButton.png')}
      />
    </TouchableOpacity>
  );
}
