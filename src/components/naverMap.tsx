import NaverMapView, {Marker, Path} from 'react-native-nmap';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {dummyData} from '../dummy/data';
import OmwMarker from './markers/OmwMarker';
import {ANAM} from '../dummy/coord'; //using dummy as of now
import {useRecoilState} from 'recoil';
import {modalState} from '../atoms/modalState';
import {Center, Coordinate} from '../config/types/coordinate';
import {mapCenterState} from '../atoms/mapCenterState';
import {DUMMY_COORD_DETAILS} from '../dummy/coordDetail';
import {markerCurPosUndirected} from '../config/consts/image';
import {getCurPosition} from '../config/helpers/location';

export default function NaverMap() {
  const [, setModalVisible] = useRecoilState<boolean>(modalState);
  const [curPosition, setCurPosition] = useState<Coordinate>(ANAM);
  const [center, setCenter] = useRecoilState<Center>(mapCenterState);
  const coordinates = dummyData.path.map(item => {
    return {
      latitude: item[1],
      longitude: item[0],
    };
  });

  const setCurPos = async () => {
    try {
      const curPos = await getCurPosition();
      setCurPosition(curPos);
      setCenter({...curPos, zoom: 14});
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    //FIXME: add permission inquiry for clients (심사에 필요) -> 강의 참고 (중요)
    setCurPos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="relative w-full h-full">
      <NaverMapView
        style={{
          width: '100%',
          height: '100%',
        }}
        zoomControl={false}
        center={center} //TODO: utilize "(start latitude + end latitude) / 2" later
        onMapClick={e => setModalVisible(false)}
        scaleBar
        mapType={0} //0 : Basic, 1 : Navi, 4 : Terrain, etc..
      >
        <Marker
          coordinate={curPosition}
          width={30}
          height={30}
          image={markerCurPosUndirected}
        />
        <OmwMarker coordList={DUMMY_COORD_DETAILS} />
        <Path color="#04c75b" coordinates={coordinates} />
      </NaverMapView>
    </View>
  );
}
