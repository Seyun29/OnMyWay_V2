import NaverMapView, {Path} from 'react-native-nmap';
import React, {useRef, useEffect, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {dummyData} from '../../dummy/data';
import OmwMarker from '../markers/OmwMarker';
import {ANAM} from '../../dummy/coord'; //using dummy as of now
import {useRecoilState, useRecoilValue} from 'recoil';
import {modalState} from '../../atoms/modalState';
import {Center, Coordinate} from '../../config/types/coordinate';
import {mapCenterState} from '../../atoms/mapCenterState';
import {lastCenterState} from '../../atoms/lastCenterState';
import {DUMMY_COORD_DETAILS} from '../../dummy/coordDetail';
import {getCurPosition} from '../../config/helpers/location';
import CurPosMarker from '../markers/CurPosMarker';
import CurPosButton from '../buttons/CurPosButton';
import {Navigation} from '../../config/types/navigation';
import {navigationState} from '../../atoms/navigationState';
import {DEFAULT_ZOOM, ENLARGE_ZOOM} from '../../config/consts/map';
import NavMarker from '../markers/NavMarker';
import {headerRoughState} from '../../atoms/headerRoughState';
import FavoriteButton from '../buttons/FavoriteButton';

const coordinates = dummyData.path.map(item => {
  return {
    latitude: item[1],
    longitude: item[0],
  };
});

export default function NaverMap() {
  const [, setModalVisible] = useRecoilState<boolean>(modalState);
  const [, setIsRough] = useRecoilState<boolean>(headerRoughState);
  const [, setLastCenter] = useRecoilState<Center>(lastCenterState);
  const nav = useRecoilValue<Navigation>(navigationState);

  const [center, setCenter] = useRecoilState<Center>(mapCenterState);
  const [curPosition, setCurPosition] = useState<Coordinate>(ANAM);

  const prevNavRef = useRef<Navigation | null>(nav);
  const isFirstMount = useRef<boolean>(true);

  const setCurPos = async () => {
    try {
      const curPos = await getCurPosition();
      setCurPosition(curPos);
      setCenter({...curPos, zoom: 12}); //Cheat Shortcut for fixing centering bug
      setCenter({...curPos, zoom: DEFAULT_ZOOM});
    } catch (error) {
      console.error(error);
    }
  };

  const onUseEffect = async () => {
    if (isFirstMount.current) {
      //FIXME: add permission inquiry for clients (심사에 필요) -> 강의 참고 (중요)
      await setCurPos();
      isFirstMount.current = false;
      prevNavRef.current = nav;
      return;
    }
    //move to corresponding location when start, end, or waypoints are updated
    if (JSON.stringify(nav) !== JSON.stringify(prevNavRef.current)) {
      if (
        JSON.stringify(nav.start) !==
          JSON.stringify(prevNavRef.current?.start) &&
        nav.start?.coordinate
      ) {
        setCenter({...nav.start.coordinate, zoom: ENLARGE_ZOOM});
      } else if (
        JSON.stringify(nav.wayPoints) !==
        JSON.stringify(prevNavRef.current?.wayPoints)
      ) {
        const wayPoints = nav.wayPoints;
        if (wayPoints.length > 0) {
          const newCenter = {
            ...wayPoints[wayPoints.length - 1].coordinate,
            zoom: ENLARGE_ZOOM,
          };
          setCenter(newCenter);
        }
      } else if (
        JSON.stringify(nav.end) !== JSON.stringify(prevNavRef.current?.end) &&
        nav.end?.coordinate
      )
        setCenter({...nav.end.coordinate, zoom: ENLARGE_ZOOM});

      prevNavRef.current = nav;

      if (nav.start && nav.end) {
        //FIXME: add path calculation API here!!!
      } else setIsRough(false);
    }
  };

  useEffect(() => {
    //on Initial Mount only
    onUseEffect();
  }, [nav]);

  return (
    <View className="relative w-full h-full">
      <NaverMapView
        style={{
          width: '100%',
          height: '100%',
        }}
        zoomControl={false}
        center={center} //TODO: utilize "(start latitude + end latitude) / 2" later
        onMapClick={e => {
          setModalVisible(false);
        }}
        onCameraChange={e => {
          setLastCenter({
            longitude: e.longitude,
            latitude: e.latitude,
            zoom: e.zoom,
          });
        }}
        onTouch={() => {
          if (nav.start && nav.end) setIsRough(true);
          Keyboard.dismiss();
        }}
        scaleBar
        mapType={0} //0 : Basic, 1 : Navi, 4 : Terrain, etc..
      >
        <CurPosMarker curPosition={curPosition} />
        <OmwMarker coordList={DUMMY_COORD_DETAILS} />
        <NavMarker />
        <Path
          color="#04c75b"
          coordinates={coordinates} //FIXME: add more options, styles, dynamically render it
        />
      </NaverMapView>
      {/* <FavoriteButton /> */}
      <CurPosButton onPress={setCurPos} />
    </View>
  );
}
