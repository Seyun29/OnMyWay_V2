import React from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import ShowMapSVG from '../assets/images/showMap.svg';

export default function PlaceQueryResult({
  placeName,
  roadAddressName,
  addressName,
  onPress,
}: {
  placeName?: string;
  roadAddressName?: string;
  addressName: string;
  onPress: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between px-[16px] py-[16px] border-b border-gray-300">
      <TouchableOpacity className="flex-1" onPress={onPress}>
        {placeName && <Text className={'text-lg '}>{placeName}</Text>}
        <Text
          className={
            placeName ? 'text-sm text-gray-500 font-light' : 'text-lg '
          }>
          {addressName}
        </Text>
        {roadAddressName && (
          <Text className="text-sm text-gray-500 font-light">
            {roadAddressName}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          Alert.alert('show map here (추후 구현)');
        }}>
        <ShowMapSVG width={35} height={35} />
      </TouchableOpacity>
    </View>
  );
}
