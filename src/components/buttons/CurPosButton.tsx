import React from 'react';
import {TouchableOpacity} from 'react-native';
import CurPosButtonSVG from '../../assets/images/curPosButton.svg';

export default function CurPosButton({
  onPress,
  style,
}: {
  onPress: () => void;
  style?: string;
}) {
  return (
    <TouchableOpacity
      className={style || 'absolute right-2.5 bottom-2.5'}
      onPress={onPress}
      activeOpacity={0.2}>
      <CurPosButtonSVG height="50px" width="50px" />
    </TouchableOpacity>
  );
}
