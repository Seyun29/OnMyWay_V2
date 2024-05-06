import NaverMapView, {Path} from 'react-native-nmap';
import React, {useRef, useEffect, useState} from 'react';
import {View} from 'react-native';
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
import {ROUTE_PRIORITY_LIST} from '../../config/consts/route';
import CandidatePaths from '../paths/candidatePaths';
import {headerRoughState} from '../../atoms/headerRoughState';

export default function SelectRouteMap({
  setSelectedPath,
}: {
  setSelectedPath: any;
}) {
  const [, setIsOnSelectRoute] = useRecoilState<boolean>(onSelectRouteState);
  const [, setIsRough] = useRecoilState<boolean>(headerRoughState);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [curPosition, setCurPosition] = useState<Coordinate>(ANAM);
  const nav = useRecoilValue<Navigation>(navigationState);

  const prevNavRef = useRef<Navigation | null>(nav);
  const isFirstMount = useRef<boolean>(true);

  const [routes, setRoutes] = useState<Routes>([]);
  const [curRouteIdx, setCurRouteIdx] = useState<number>(0);
  const [center, setCenter] = useState<Center>({...ANAM, zoom: 14});

  const setCurPos = async () => {
    try {
      const curPos = await getCurPosition();
      //FIXME: add permission inquiry for clients (심사에 필요) -> 강의 참고 (중요)
      setCurPosition(curPos);
    } catch (error) {
      console.error(error);
      //FIXME: fix Toast here
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: '현재 위치를 가져오는데 실패했습니다.',
      });
    }
  };
  const onUseEffect = async () => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      setLoading(true);
      const data = await getRoutes(nav);
      setRoutes(data);
      setCenter({
        //FIXME: fix type issue here
        latitude:
          (nav.start?.coordinate.latitude + nav.end?.coordinate.latitude) / 2,
        longitude:
          (nav.start?.coordinate.longitude + nav.end?.coordinate.longitude) / 2,
        zoom: 9.5, //FIXME: adjust zoom level properly here!!!!!, start from 12, decrement by 0.5
      });
      setLoading(false);
      return;
    } else {
      if (nav.start && nav.end) {
        if (JSON.stringify(nav) !== JSON.stringify(prevNavRef.current)) {
          //바뀔때마다 getRoutes 호출
          setLoading(true);
          const data = await getRoutes(nav);
          setRoutes(data);
          setCenter({
            //FIXME: fix type issue here
            latitude:
              (nav.start?.coordinate.latitude + nav.end?.coordinate.latitude) /
              2,
            longitude:
              (nav.start?.coordinate.longitude +
                nav.end?.coordinate.longitude) /
              2,
            zoom: 9.5, //FIXME: adjust zoom level properly here!!!!!, start from 12, decrement by 0.5
          });
          setLoading(false);
        }
      } else setIsOnSelectRoute(false);
    }
    prevNavRef.current = nav;
  };

  useEffect(() => {
    //on Initial Mount only
    onUseEffect();
  }, [nav]);

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
            }}>
            <CurPosMarker curPosition={curPosition} />
            <NavMarker />
            <CandidatePaths routes={routes} curRouteIdx={curRouteIdx} />
          </NaverMapView>
          <CurPosButton onPress={setCurPos} />
        </>
      )}
    </View>
  );
}
