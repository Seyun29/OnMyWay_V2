import React, {useState, useEffect} from 'react';
import {Marker} from 'react-native-nmap';
import {
  Center,
  CoordDetail,
  Coordinate,
  OmWMarkerProps,
} from '../../config/types/coordinate';
import {useRecoilState} from 'recoil';
import {modalState} from '../../atoms/modalState';
import {mapCenterState} from '../../atoms/mapCenterState';
import {markerList} from '../../config/consts/image';
import {
  DEFAULT_MARKER_HEIGHT,
  DEFAULT_MARKER_WIDTH,
  LARGE_MARKER_HEIGHT,
} from '../../config/consts/map';

export default function OmwMarker({coordList}: OmWMarkerProps) {
  //FIXME: add types to input props, input type has to be updated (coordList is temporary need other props as well)
  //TODO: use different PNGs according to whether they are start, end, stopover & categories & open or closed
  //TODO: move & zoom smoothly to the selected marker, 'zoom level' is also required to be updated.

  const [modalVisible, setModalVisible] = useRecoilState<boolean>(modalState);

  const [center, setCenter] = useRecoilState<Center>(mapCenterState);

  const [selected, setSelected] = useState<number>(0);

  const markerOnClick = (item: CoordDetail, index: number) => {
    //FIXME: pass proper states to bottommodalsheets (should be defined in recoil global state)
    setModalVisible(true);
    setSelected(index);
    setCenter({...center, latitude: item.latitude, longitude: item.longitude});
  };

  useEffect(() => {
    if (!modalVisible) {
      setSelected(-1);
    }
  }, [modalVisible]);

  return (
    <>
      {coordList.map((item: CoordDetail, index: number) => {
        let markerImage = markerList.basic.default;
        if (item.isOpen) markerImage = markerList.basic.on;
        else if (item.isClosed) markerImage = markerList.basic.off;
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            width={
              index === selected ? DEFAULT_MARKER_WIDTH : DEFAULT_MARKER_WIDTH
            }
            height={
              index === selected ? LARGE_MARKER_HEIGHT : DEFAULT_MARKER_HEIGHT
            }
            onClick={() => {
              markerOnClick(item, index);
            }}
            anchor={{x: 0.5, y: 1}} //FIXME: set anchor
            image={markerImage}
            //FIXME: use different images for different categories
          />
        );
      })}
    </>
  );
}
