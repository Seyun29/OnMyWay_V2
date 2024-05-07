import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import NaverMap from '../../components/maps/naverMap';
import MainBottomSheet from '../../components/mainBotttomSheet';
import {useRecoilState, useRecoilValue} from 'recoil';
import {modalState} from '../../atoms/modalState';
import MainHeader from '../../components/headers/mainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
// import {RootStackParam} from '../../navigations';
import {Drawer} from 'react-native-drawer-layout';
import {drawerState} from '../../atoms/drawerState';
import KeywordSearchBox from '../../components/keywordSearchBox';
import {onSelectRouteState} from '../../atoms/onSelectRouteState';
import SelectRouteMap from '../../components/maps/selectRouteMap';
import {RouteDetail, Routes} from '../../config/types/routes';
import {Coordinate} from '../../config/types/coordinate';

export const HomeScreen = () => {
  const modalVisible = useRecoilValue<boolean>(modalState);
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState<boolean>(drawerState);
  const onSelectRoute = useRecoilValue<boolean>(onSelectRouteState);
  const [selectedRoute, setSelectedRoute] = useState<RouteDetail | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-white w-full h-full">
      {/* <Drawer
        open={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => setIsDrawerOpen(false)}
        drawerType="front"
        renderDrawerContent={() => {
          return <View className="w-full h-full bg-gray-200" />;
        }}> */}
      <Pressable
        className="flex-1"
        onPress={() => {
          setIsDrawerOpen(false);
        }}>
        <View className="flex-1">
          {onSelectRoute ? (
            <SelectRouteMap setSelectedRoute={setSelectedRoute} />
          ) : (
            <NaverMap selectedRoute={selectedRoute} />
          )}
        </View>
        <View className="top-0 absolute w-full overflow-hidden pb-[8px]">
          <MainHeader setSelectedRoute={setSelectedRoute} />
        </View>
        {modalVisible && (
          <View className="absolute bottom-0 left-0 h-1/4 w-full">
            <MainBottomSheet />
          </View>
        )}
      </Pressable>
      {/* </Drawer> */}
    </SafeAreaView>
  );
};
