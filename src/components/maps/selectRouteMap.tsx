import NaverMapView from 'react-native-nmap';
import React, {useRef, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  Platform,
} from 'react-native';
import {ANAM} from '../../dummy/coord'; //using dummy for initial data
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
import {Routes} from '../../config/types/routes';
import CandidatePaths, {
  DefaultPath,
  SelectedPath,
} from '../paths/candidatePaths';
import {headerRoughState} from '../../atoms/headerRoughState';
import {calculateIsInBoundary, getZoomLevel} from '../../config/helpers/route';
import SelectRouteItem from '../selectRouteItem';
import {SELECT_ROUTE_ITEM_WIDTH} from '../../config/consts/style';
import {mapCenterState} from '../../atoms/mapCenterState';
import {loadingState} from '../../atoms/loadingState';

// @ts-ignore
const getItemLayout = (data, index) => ({
  length: SELECT_ROUTE_ITEM_WIDTH,
  offset: SELECT_ROUTE_ITEM_WIDTH * index,
  index: index,
});

export default function SelectRouteMap({
  setSelectedRoute,
}: {
  setSelectedRoute: any;
}) {
  const [, setOnSelectRoute] = useRecoilState<boolean>(onSelectRouteState);
  const [, setIsRough] = useRecoilState<boolean>(headerRoughState);
  const [, setGlobalCenter] = useRecoilState<Center>(mapCenterState);
  const [isLoading, setLoading] = useRecoilState<boolean>(loadingState);

  const [curPosition, setCurPosition] = useState<Coordinate | null>(null);
  const nav = useRecoilValue<Navigation>(navigationState);

  const prevNavRef = useRef<Navigation | null>(nav);
  const isFirstMount = useRef<boolean>(true);
  const flatListRef = useRef<FlatList>(null);

  const [routes, setRoutes] = useState<Routes>([]);
  const [curRouteIdx, setCurRouteIdx] = useState<number>(0);
  const [zoomTrigger, setZoomTrigger] = useState<boolean>(false);
  const [center, setCenter] = useState<Center>({...ANAM, zoom: 14});
  const [coveringRegion, setCoveringRegion] = useState<Coordinate[]>([]);
  const [zoom, setZoom] = useState<number>(14);

  const onSelect = () => {
    setOnSelectRoute(false);
    setSelectedRoute(routes[curRouteIdx]);
    setGlobalCenter(center);
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = e.nativeEvent.contentOffset.x;
    const curIdx = Math.round(scrollPosition / SELECT_ROUTE_ITEM_WIDTH);
    setCurRouteIdx(curIdx);
  };

  const setCurPos = async () => {
    try {
      const curPos = await getCurPosition();
      //FIXME: add permission inquiry for clients (심사에 필요) -> 강의 참고 (중요)
      setCurPosition(curPos);
      setCenter({...curPos, zoom: 13}); //Cheat Shortcut for fixing centering bug
      setCenter({...curPos, zoom: zoom});
    } catch (error) {
      setCurPosition(null);
      Alert.alert(
        '현재 위치를 가져오는데 실패했습니다',
        '위치 권한을 확인해주세요',
      );
    }
  };

  const setPath = async (
    sLat: number,
    sLon: number,
    eLat: number,
    eLon: number,
  ) => {
    setLoading(true);
    const data = await getRoutes(nav);
    const initialZoom = getZoomLevel(data[0]?.distance);
    setRoutes(data);
    setCenter({
      latitude: (sLat + eLat) / 2,
      longitude: (sLon + eLon) / 2,
      zoom: initialZoom, //FIXME: adjust zoom level properly here!!!!!, start from 12, decrement by 0.5
    });
    setZoomTrigger(true);
    setLoading(false);
  };

  const sortRoutes = (routeList: Routes) => {
    //shift the current route to the first index of the list
    const sortedRoutes = routeList.slice();
    const curRoute = sortedRoutes[curRouteIdx];
    sortedRoutes.splice(curRouteIdx, 1);
    sortedRoutes.unshift(curRoute);
    return sortedRoutes;
  };

  const onUseEffectNav = async () => {
    if (nav.start && nav.end) {
      if (isFirstMount.current) {
        isFirstMount.current = false;
        await setPath(
          nav.start.coordinate.latitude,
          nav.start.coordinate.longitude,
          nav.end.coordinate.latitude,
          nav.end.coordinate.longitude,
        );
        return;
      } else if (JSON.stringify(nav) !== JSON.stringify(prevNavRef.current)) {
        //바뀔때마다 getRoutes 호출
        await setPath(
          nav.start.coordinate.latitude,
          nav.start.coordinate.longitude,
          nav.end.coordinate.latitude,
          nav.end.coordinate.longitude,
        );
      }
    } else setOnSelectRoute(false);

    prevNavRef.current = nav;
  };

  useEffect(() => {
    onUseEffectNav();
  }, [nav]);

  useEffect(() => {
    if (routes.length > 0 && zoomTrigger) {
      //adjust Zoom size here according to nav range (start, waypoints, end), so that the whole route is visible
      //FIXME: Seperate cases in more detail!!
      const isInBoundary = calculateIsInBoundary(nav, coveringRegion);
      if (!isInBoundary) {
        setCenter({
          ...center,
          zoom: center.zoom - 0.3,
        });
      } else setZoomTrigger(false);
    }
  }, [coveringRegion]);

  useEffect(() => {
    if (flatListRef.current && routes.length > 0) {
      flatListRef.current.scrollToIndex({
        index: curRouteIdx,
        animated: true,
      });
      sortRoutes(routes);
    }
  }, [curRouteIdx]);

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
              setCoveringRegion(e.coveringRegion);
              setZoom(e.zoom);
            }}>
            {curPosition && <CurPosMarker curPosition={curPosition} />}
            <NavMarker />
            <CandidatePaths routes={sortRoutes(routes)} />
          </NaverMapView>
          <CurPosButton
            onPress={setCurPos}
            style="absolute right-4 bottom-[130px]"
          />
          <View className="absolute w-full bottom-4 bg-transparent">
            <FlatList
              ref={flatListRef}
              className="w-full overflow-hidden"
              horizontal
              data={routes}
              // pagingEnabled
              bounces={false}
              overScrollMode="never"
              showsHorizontalScrollIndicator={false}
              scrollToOverflowEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              getItemLayout={getItemLayout}
              onScroll={handleScroll}
              renderItem={({item, index}) => (
                <SelectRouteItem item={item} onSelect={onSelect} />
              )}
            />
          </View>
        </>
      )}
    </View>
  );
}
