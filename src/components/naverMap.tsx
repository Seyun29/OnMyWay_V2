import NaverMapView, {Marker, Path} from 'react-native-nmap';
import React from 'react';
import {View} from 'react-native';
import {dummyData} from '../dummy/data';
import OmwMarker from './markers/OmwMarker';
import {ANAM, BOMUN, BUSAN, GANGNEUNG} from '../dummy/coord'; //using dummy as of now
import {useRecoilState} from 'recoil';
import {modalState} from '../atoms/modalState';

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
        center={{
          zoom: 10,
          latitude: 37.7645235587621,
          longitude: 128.899627553491,
        }}
        onMapClick={e => setModalVisible(false)}
        // showsMyLocationButton
      >
        <OmwMarker coordList={[ANAM, BOMUN, GANGNEUNG, BUSAN]} />
        <Path color="#04c75b" coordinates={coordinates} />
      </NaverMapView>
    </View>
  );
}
