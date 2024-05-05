import React from 'react';
import {Text, View} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import NaverMap from '../../components/maps/naverMap';
import MainBottomSheet from '../../components/mainBotttomSheet';
import {useRecoilState, useRecoilValue} from 'recoil';
import {modalState} from '../../atoms/modalState';
import MainHeader from '../../components/headers/mainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
// import {RootStackParam} from '../../navigations';
import {drawerState} from '../../atoms/drawerState';
import KeywordSearchBox from '../../components/keywordSearchBox';

export const SelectRouteScreen = () => {
  const modalVisible = useRecoilValue<boolean>(modalState);
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState<boolean>(drawerState);

  return (
    <SafeAreaView className="flex-1 bg-white w-full h-full">
      {/* <Drawer
        open={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => setIsDrawerOpen(false)}
        drawerType="front"
        renderDrawerContent={() => {
          return <Text>Drawer content</Text>;
        }}> */}
      <View className="flex-1">
        <View className="flex-1">
          <NaverMap />
        </View>
        <View className="top-0 absolute w-full overflow-hidden pb-[8px]">
          <MainHeader />
        </View>
        {modalVisible && (
          <View className="absolute bottom-0 left-0 h-1/4 w-full">
            <MainBottomSheet />
          </View>
        )}
      </View>
      <KeywordSearchBox />
    </SafeAreaView>
  );
};
