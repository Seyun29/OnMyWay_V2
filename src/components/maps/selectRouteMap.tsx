import NaverMapView, {Path} from 'react-native-nmap';
import React, {useRef, useEffect, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {dummyData} from '../../dummy/data';
import OmwMarker from '../markers/OmwMarker';
import {ANAM} from '../../dummy/coord'; //using dummy as of now
import {useRecoilState, useRecoilValue} from 'recoil';
import {Center, Coordinate} from '../../config/types/coordinate';
import {DUMMY_COORD_DETAILS} from '../../dummy/coordDetail';
import {getCurPosition} from '../../config/helpers/location';
import CurPosMarker from '../markers/CurPosMarker';
import CurPosButton from '../buttons/CurPosButton';
import {Navigation} from '../../config/types/navigation';
import {navigationState} from '../../atoms/navigationState';
import NavMarker from '../markers/NavMarker';
import {headerRoughState} from '../../atoms/headerRoughState';
import {getRoutes} from '../../api/getRoutes';
import Spinner from '../spinner';
import {onSelectRouteState} from '../../atoms/onSelectRouteState';
import Toast from 'react-native-toast-message';

export default function SelectRouteMap() {
  const [, setIsRough] = useRecoilState<boolean>(headerRoughState);
  const [, setIsOnSelectRoute] = useRecoilState<boolean>(onSelectRouteState);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [curPosition, setCurPosition] = useState<Coordinate>(ANAM);
  const nav = useRecoilValue<Navigation>(navigationState);

  const prevNavRef = useRef<Navigation | null>(nav);
  const isFirstMount = useRef<boolean>(true);

  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);

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
      const routes = await getRoutes(nav);
      setLoading(false);
      return;
    } else {
      if (nav.start && nav.end) {
        if (JSON.stringify(nav) !== JSON.stringify(prevNavRef.current)) {
          //바뀔때마다 getRoutes 호출
          setLoading(true);
          const routes = await getRoutes(nav);
          const newCoord = routes[0].path.map(item => ({
            latitude: item[1],
            longitude: item[0],
          }));
          setCoordinates(newCoord);
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
            center={{
              latitude:
                (nav.start?.coordinate.latitude +
                  nav.end?.coordinate.latitude) /
                2,
              longitude:
                (nav.start?.coordinate.longitude +
                  nav.end?.coordinate.longitude) /
                2,
              zoom: 12, //FIXME: adjust zoom level properly here!!!!!
            }} //FIXME: fix type issue here
            scaleBar
            mapType={0} //0 : Basic, 1 : Navi, 4 : Terrain, etc..
          >
            <CurPosMarker curPosition={curPosition} />
            <NavMarker />
            <Path
              color="#04c75b"
              coordinates={coordinates} //FIXME: add more options, styles, dynamically render it
            />
          </NaverMapView>
          <CurPosButton onPress={setCurPos} />
        </>
      )}
    </View>
  );
}
