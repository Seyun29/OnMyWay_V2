import React, {useState, useEffect} from 'react';
import {Marker} from 'react-native-nmap';
import {
  Center,
  CoordDetail,
  Coordinate,
  OmWMarkerProps,
  PlaceDetail,
} from '../../config/types/coordinate';
import {useRecoilState, useRecoilValue} from 'recoil';
import {modalState} from '../../atoms/modalState';
import {mapCenterState} from '../../atoms/mapCenterState';
import {markerList} from '../../config/consts/image';
import {
  DEFAULT_MARKER_HEIGHT,
  DEFAULT_MARKER_WIDTH,
  LARGE_MARKER_HEIGHT,
  LARGE_MARKER_WIDTH,
} from '../../config/consts/map';
import {curPlaceState} from '../../atoms/curPlaceState';
import {lastCenterState} from '../../atoms/lastCenterState';

export default function OmwMarker({resultList}: OmWMarkerProps) {
  //FIXME: add types to input props, input type has to be updated (coordList is temporary need other props as well)
  //TODO: use different PNGs according to whether they are start, end, stopover & categories & open or closed
  //TODO: move & zoom smoothly to the selected marker, 'zoom level' is also required to be updated.

  const [modalVisible, setModalVisible] = useRecoilState<boolean>(modalState);
  const [, setCurPlace] = useRecoilState<PlaceDetail | null>(curPlaceState);

  const [, setCenter] = useRecoilState<Center>(mapCenterState);
  const lastCenter = useRecoilValue<Center>(lastCenterState);

  const [selected, setSelected] = useState<number>(0);

  const markerOnClick = (item: PlaceDetail, index: number) => {
    //FIXME: pass proper states to bottommodalsheets (should be defined in recoil global state)

    setCurPlace(item);
    setModalVisible(true);
    setSelected(index);
    setCenter({
      latitude: item.coordinate.latitude,
      longitude: item.coordinate.longitude,
      zoom: lastCenter.zoom,
    });
  };

  useEffect(() => {
    if (!modalVisible) {
      setSelected(-1);
    }
  }, [modalVisible]);

  useEffect(() => {
    markerOnClick(resultList[0], 0);
  }, []);

  return (
    <>
      {resultList.map((item: PlaceDetail, index: number) => {
        let markerImage = markerList.basic.default;
        if (item.isOpen) markerImage = markerList.basic.on;
        else if (item.isClosed) markerImage = markerList.basic.off;
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: item.coordinate.latitude,
              longitude: item.coordinate.longitude,
            }}
            width={
              index === selected ? LARGE_MARKER_WIDTH : DEFAULT_MARKER_WIDTH
            }
            height={
              index === selected ? LARGE_MARKER_HEIGHT : DEFAULT_MARKER_HEIGHT
            }
            onClick={() => {
              markerOnClick(item, index);
            }}
            anchor={{x: 0.5, y: 1}} //FIXME: set anchor
            image={markerImage}
            //TODO: use different images for different categories
          />
        );
      })}
    </>
  );
}
