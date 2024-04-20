import React, {useState} from 'react';
import NaverMapView from 'react-native-nmap';
import {Button, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {Center, Coordinate} from '../../config/types/coordinate';
import {lastCenterState} from '../../atoms/lastCenterState';
import SelectMarker from '../../assets/images/markers/selectMarker.svg';

export default function SelectMap() {
  const lastCenter = useRecoilValue<Center>(lastCenterState);
  const [coord, setCoord] = useState<Coordinate>(lastCenter);
  return (
    <View className="relative w-full h-full">
      <NaverMapView
        center={lastCenter} //initial Position
        style={{
          width: '100%',
          height: '100%',
        }}
        zoomControl={false}
        onCameraChange={e => {
          setCoord({
            longitude: e.longitude,
            latitude: e.latitude,
          });
        }}
        scaleBar
        mapType={0} //0 : Basic, 1 : Navi, 4 : Terrain, etc..
      />
      <View className="absolute top-1/2 left-1/2">
        <View
          style={{
            marginLeft: -20,
            marginTop: -37, //for centering
          }}>
          <SelectMarker width={40} height={40} />
        </View>
      </View>
    </View>
  );
}
