//@ts-ignore
import React from 'react';
import {View, Text, Image} from 'react-native';

export default function BottomSheetComponent({placeInfo}: {placeInfo: any}) {
  const {place_name, address_name, placeId, open, tags, photoUrl} = placeInfo;
  return (
    <View className="flex-1 flex-row w-full px-3">
      <Image source={{uri: photoUrl}} style={{width: 100, height: 100}} />
      <Text>{place_name}</Text>
      <Text>{address_name}</Text>
      <Text>{'placeId : ' + placeId}</Text>
      <Text>{'open : ' + open}</Text>
      <Text>{'tags : ' + tags}</Text>
      <Image
        source={
          photoUrl
            ? {uri: photoUrl}
            : require('../assets/images/defaultThumbnail.png')
        }
        style={{width: 100, height: 100}}
      />
    </View>
  );
}
