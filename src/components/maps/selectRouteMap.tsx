import NaverMapView from 'react-native-nmap';
import React, {useRef, useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import OmwMarker from '../markers/OmwMarker';
import {ANAM} from '../../dummy/coord'; //using dummy as of now
import {useRecoilState, useRecoilValue} from 'recoil';
import {Center, Coordinate} from '../../config/types/coordinate';
import {getCurPosition} from '../../config/helpers/location';
import CurPosMarker from '../markers/CurPosMarker';
import CurPosButton from '../buttons/CurPosButton';
import {Navigation} from '../../config/types/navigation';
import {navigationState} from '../../atoms/navigationState';
import NavMarker from '../markers/NavMarker';
import {getRoutes} from '../../api/getRoutes';
import Spinner from '../spinner';
import {onSelectRouteState} from '../../atoms/onSelectRouteState';
import Toast from 'react-native-toast-message';
import {Routes} from '../../config/types/routes';
import {ROUTE_PRIORITY_TEXT} from '../../config/consts/route';
import CandidatePaths from '../paths/candidatePaths';
import {headerRoughState} from '../../atoms/headerRoughState';
import {calculateIsInBoundary} from '../../config/helpers/route';

// @ts-ignore
const getItemLayout = (data, index) => ({
  length: Dimensions.get('window').width,
  offset: Dimensions.get('window').width * index,
  index: index,
});

export default function SelectRouteMap({
  setSelectedPath,
}: {
  setSelectedPath: any;
}) {
  const [, setOnSelectRoute] = useRecoilState<boolean>(onSelectRouteState);
  const [, setIsRough] = useRecoilState<boolean>(headerRoughState);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [curPosition, setCurPosition] = useState<Coordinate>(ANAM);
  const nav = useRecoilValue<Navigation>(navigationState);

  const prevNavRef = useRef<Navigation | null>(nav);
  const isFirstMount = useRef<boolean>(true);

  const [routes, setRoutes] = useState<Routes>([]);
  const [curRouteIdx, setCurRouteIdx] = useState<number>(0);
  const [center, setCenter] = useState<Center>({...ANAM, zoom: 14});
  const [coveringRegion, setCoveringRegion] = useState<Coordinate[]>([]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = e.nativeEvent.contentOffset.x;
    const curIdx = Math.round(scrollPosition / Dimensions.get('window').width);
    setCurRouteIdx(curIdx);
    setSelectedPath(routes[curIdx].path);
  };

  const setCurPos = async () => {
    try {
      const curPos = await getCurPosition();
      //FIXME: add permission inquiry for clients (심사에 필요) -> 강의 참고 (중요)
      setCurPosition(curPos);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: '현재 위치를 가져오는데 실패했습니다.',
      });
    }
  };

  const onUseEffectNav = async () => {
    if (nav.start && nav.end) {
      if (isFirstMount.current) {
        isFirstMount.current = false;
        setLoading(true);
        const data = await getRoutes(nav);
        setRoutes(data);
        setCenter({
          latitude:
            (nav.start.coordinate.latitude + nav.end.coordinate.latitude) / 2,
          longitude:
            (nav.start.coordinate.longitude + nav.end.coordinate.longitude) / 2,
          zoom: 14, //FIXME: adjust zoom level properly here!!!!!, start from 12, decrement by 0.5
        });
        setLoading(false);
        return;
      } else if (JSON.stringify(nav) !== JSON.stringify(prevNavRef.current)) {
        //바뀔때마다 getRoutes 호출
        setLoading(true);
        const data = await getRoutes(nav);
        setRoutes(data);
        setCenter({
          //FIXME: fix type issue here
          latitude:
            (nav.start?.coordinate.latitude + nav.end?.coordinate.latitude) / 2,
          longitude:
            (nav.start?.coordinate.longitude + nav.end?.coordinate.longitude) /
            2,
          zoom: 14, //FIXME: adjust zoom level properly here!!!!!, start from 12, decrement by 0.5
        });
        setLoading(false);
      }
    } else setOnSelectRoute(false);

    prevNavRef.current = nav;
  };

  useEffect(() => {
    onUseEffectNav();
  }, [nav]);

  useEffect(() => {
    if (routes.length > 0) {
      //adjust Zoom size here according to nav range (start, waypoints, end), so that the whole route is visible
      //FIXME: optimize rendering here (calculation cost overhead expected as of now)
      if (!calculateIsInBoundary(nav, coveringRegion))
        setCenter({
          ...center,
          zoom: center.zoom - 1,
        });
    }
  }, [coveringRegion]);

  return (
    <View className="relative w-full h-full">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <NaverMapView
            style={{
              width: '100%',
              height: '100%',
            }}
            zoomControl={false}
            center={center}
            scaleBar
            mapType={0} //0 : Basic, 1 : Navi, 4 : Terrain, etc..
            onTouch={() => {
              setIsRough(true);
            }}
            onCameraChange={e => {
              setCenter({...center, zoom: e.zoom});
              setTimeout(() => {
                setCoveringRegion(e.coveringRegion);
              }, 10);
            }}>
            <CurPosMarker curPosition={curPosition} />
            <NavMarker />
            <CandidatePaths routes={routes} curRouteIdx={curRouteIdx} />
          </NaverMapView>
          <CurPosButton onPress={setCurPos} />
          <View className="absolute w-full bottom-4 bg-transparent">
            <FlatList
              className="w-full overflow-hidden"
              horizontal
              data={routes}
              pagingEnabled
              bounces={false}
              overScrollMode="never"
              showsHorizontalScrollIndicator={false}
              scrollToOverflowEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              getItemLayout={getItemLayout}
              onScroll={handleScroll}
              renderItem={({item, index}) => {
                // Convert duration from seconds to hours and minutes
                const hours = Math.floor(item.duration / 3600);
                const minutes = Math.floor((item.duration % 3600) / 60);
                // Convert distance from meters to kilometers
                const kilometers = item.distance / 1000;
                return (
                  <View
                    style={{width: Dimensions.get('window').width}}
                    className="bg-transparent px-4 py-4 justify-center items-center">
                    <Pressable className="bg-white justify-center items-center rounded-lg py-3 w-full">
                      <Text className="text-center text-xs">
                        {ROUTE_PRIORITY_TEXT[item.priority]}
                      </Text>
                      <Text className="text-center text-xs">
                        {hours > 0
                          ? `${hours}시간 ${minutes}분`
                          : `${minutes}분`}
                      </Text>
                      <Text className="text-center text-xs">
                        {`${kilometers.toFixed(1)}km`}
                      </Text>
                      <Button
                        title="경로 선택 버튼"
                        onPress={() => {
                          Alert.alert('경로 선택 기능 구현', '검색창으로 이동');
                        }}
                      />
                    </Pressable>
                  </View>
                );
              }}
            />
          </View>
        </>
      )}
    </View>
  );
}
