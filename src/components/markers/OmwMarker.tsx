import React, {useState, useEffect} from 'react';
import {Marker} from 'react-native-nmap';
import {CoordDetail, OmWMarkerProps} from '../../config/types/coordinate';
import {useRecoilState} from 'recoil';
import {modalState} from '../../atoms/modalState';

export default function OmwMarker({coordList}: OmWMarkerProps) {
  //FIXME: add types to input props, input type has to be updated (coordList is temporary need other props as well)
  //TODO: customize marker design here
  //TODO: use different PNGs according to whether they are start, end, stopover & categories & open or closed
  //using dummydata as of now
  const [modalVisible, setModalVisible] = useRecoilState<boolean>(modalState);
  const [selected, setSelected] = useState<number>(0);
  const markerOnClick = (index: number) => {
    //TODO: close modal and unselect the marker when touching outside the modal, EXCEPT for scrolling the map !!
    //FIXME: pass proper states to bottommodalsheets
    setModalVisible(true);
    setSelected(index);
  };

  useEffect(() => {
    if (!modalVisible) {
      setSelected(-1);
    }
  }, [modalVisible]);

  return (
    <>
      {coordList.map((item: CoordDetail, index: number) => (
        <Marker
          key={index}
          coordinate={{
            latitude: item.latitude,
            longitude: item.longitude,
          }}
          width={index === selected ? 30 : 20}
          height={index === selected ? 45 : 30}
          onClick={() => {
            markerOnClick(index);
          }}
          // anchor={{x: 0.5, y: 0.5}}
          // image={require('./src/assets/dot.png')} //FIXME: use different images for different categories
        />
      ))}
    </>
  );
}
