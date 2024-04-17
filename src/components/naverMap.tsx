import NaverMapView, {Marker, Path} from 'react-native-nmap';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {dummyData} from '../dummy/data';
import OmwMarker from './markers/OmwMarker';
import {ANAM, BOMUN, BUSAN, GANGNEUNG} from '../dummy/coord'; //using dummy as of now
import {useRecoilState} from 'recoil';
import {modalState} from '../atoms/modalState';
import {Coordinate} from '../config/types/coordinate';
import Geolocation from '@react-native-community/geolocation';

export default function NaverMap() {
  //use SetModalVisible from recoil
  const [, setModalVisible] = useRecoilState<boolean>(modalState);
  const [curPosition, setCurPosition] = useState<Coordinate>(ANAM);

  const coordinates = dummyData.path.map(item => {
    return {
      latitude: item[1],
      longitude: item[0],
    };
  });

  const getCurPosition = useCallback(() => {
    Geolocation.getCurrentPosition(
      info => {
        setCurPosition({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      console.error, //FIXME: 현위치 가져오기에 실패한경우 alert + 권한 확인 묻기 등 예외처리
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);

  useEffect(() => {
    //FIXME: add permission inquiry for clients (심사에 필요) -> 강의 참고 (중요)
    getCurPosition();
  }, [getCurPosition]);

  return (
    <View className="relative w-full h-full">
      <NaverMapView
        style={{
          width: '100%',
          height: '100%',
        }}
        zoomControl={false}
        center={{...curPosition, zoom: 14}} //TODO: utilize "(start latitude + end latitude) / 2" later
        onMapClick={e => setModalVisible(false)}
        scaleBar
        mapType={0} //0 : Basic, 1 : Navi, 4 : Terrain, etc..
      >
        <OmwMarker coordList={[ANAM, BOMUN, GANGNEUNG, BUSAN]} />
        <Path color="#04c75b" coordinates={coordinates} />
      </NaverMapView>
    </View>
  );
}
