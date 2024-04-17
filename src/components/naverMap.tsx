import NaverMapView, {Marker, Path} from 'react-native-nmap';
import React from 'react';
import {View} from 'react-native';
import {dummyData} from '../dummy/data';
import OmwMarker from './markers/OmwMarker';
import {ANAM} from '../dummy/coord'; //using dummy as of now
import {useRecoilState} from 'recoil';
import {modalState} from '../atoms/modalState';
import {DUMMY_COORD_DETAILS} from '../dummy/coordDetail';

export default function NaverMap() {
  //use SetModalVisible from recoil
  const [, setModalVisible] = useRecoilState<boolean>(modalState);

  const coordinates = dummyData.path.map(item => {
    return {
      latitude: item[1],
      longitude: item[0],
    };
  });
  return (
    <View className="relative w-full h-full">
      <NaverMapView
        style={{
          width: '100%',
          height: '100%',
        }}
        zoomControl={false}
        center={{...ANAM, zoom: 14}}
        onMapClick={e => setModalVisible(false)}
        scaleBar
        mapType={0} //0 : Basic, 1 : Navi, 4 : Terrain, etc..
      >
        <OmwMarker coordList={DUMMY_COORD_DETAILS} />
        <Path color="#04c75b" coordinates={coordinates} />
      </NaverMapView>
    </View>
  );
}
