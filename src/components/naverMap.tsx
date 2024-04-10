import NaverMapView, {Marker, Path} from 'react-native-nmap';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Dimensions,
  Text,
  useColorScheme,
  View,
  Modal,
} from 'react-native';
import {dummyData} from '../dummy/data';

export default function NaverMap() {
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
        }}>
        {/* <Marker
          coordinate={{
            latitude: 37.7645235587621,
            longitude: 128.899627553491,
          }}
          width={30}
          height={30}
          // anchor={{x: 0.5, y: 0.5}}
          image={require('./src/assets/dot.png')}
        /> */}
        <Path color="#04c75b" coordinates={coordinates} />
      </NaverMapView>
    </View>
  );
}
