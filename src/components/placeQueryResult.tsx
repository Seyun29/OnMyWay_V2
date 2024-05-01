import React from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import ShowMapSVG from '../assets/images/showMap.svg';
import FavoriteButton from './buttons/FavoriteButton';
import {Coordinate} from '../config/types/coordinate';

export default function PlaceQueryResult({
  placeName,
  roadAddressName,
  addressName,
  coordinate,
  onPress,
}: {
  placeName?: string;
  roadAddressName?: string;
  addressName: string;
  coordinate: Coordinate;
  onPress: () => void;
}) {
  const mainText = placeName || addressName;
  const subText = placeName ? addressName : roadAddressName;
  return (
    <View className="flex-row items-center justify-between px-[16px] py-[16px] border-b border-gray-300">
      <TouchableOpacity className="flex-1 overflow-hidden" onPress={onPress}>
        <View className="flex-row">
          <Text className={mainText.length > 20 ? 'text-base' : 'text-lg'}>
            {mainText}
          </Text>
          <FavoriteButton
            addressName={addressName}
            placeName={placeName}
            roadAddressName={roadAddressName}
            coordinate={coordinate}
          />
        </View>
        {subText && (
          <Text className="text-sm text-gray-500 font-light">{subText}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          Alert.alert('show map here', '추후 구현');
        }}>
        <ShowMapSVG />
      </TouchableOpacity>
    </View>
  );
}
