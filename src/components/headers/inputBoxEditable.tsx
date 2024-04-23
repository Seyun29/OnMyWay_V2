import React from 'react';
import {TextInput, Text, View} from 'react-native';

export default function InputBoxEditable({
  text,
  altText,
  children,
}: {
  text?: null | string;
  altText?: string;
  children?: React.ReactNode;
}) {
  //FIXME: add, update proper source of nav states (start, end , waypoints)
  return (
    <View className="w-full pr-[16px]">
      <TextInput
        placeholder="출발지 입력 (임시)"
        className={
          'w-full h-[40px] bg-[#F2F2F2] mb-[2px] px-[12px] flex-row items-center rounded-sm'
        }
        autoFocus
      />
    </View>
  );
}
