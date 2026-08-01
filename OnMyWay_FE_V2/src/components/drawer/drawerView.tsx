import React from 'react';
import {Text, View} from 'react-native';
import {APP_NAME} from '@env';
import ProfileSVG from '../../assets/images/profile.svg';

const DrawerView = () => {
  return (
    <View className="w-full h-full bg-white items-center py-10">
      <Text className="text-2xl font-bold text-[#616060] mb-7">
        {APP_NAME || 'OnMyWay'}
      </Text>
      <View className="w-4/5 flex-row items-center pl-2">
        <ProfileSVG width={70} height={70} color={'black'} />
        <View className="flex-1 justify-center px-5 pb-2">
          <Text className="text-base text-[#616060]">
            경로 주변 장소 검색을 한눈에
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DrawerView;
