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
import {selectedPlaceIndexState} from '../../atoms/selectedPlaceIndexState';
import {listModalState} from '../../atoms/listModalState';

export default function OmwMarker({
  resultList,
  setShowAlternative,
}: {
  resultList: PlaceDetail[];
  setShowAlternative: (showAlternative: boolean) => void;
}) {
  //FIXME: add types to input props, input type has to be updated (coordList is temporary need other props as well)
  //TODO: use different PNGs according to whether they are start, end, stopover & categories & open or closed
  //TODO: move & zoom smoothly to the selected marker, 'zoom level' is also required to be updated.

  const [modalVisible, setModalVisible] = useRecoilState<boolean>(modalState);
  const [, setListModalVisible] = useRecoilState<boolean>(listModalState);
  const [, setCurPlace] = useRecoilState<PlaceDetail | null>(curPlaceState);

  const [center, setCenter] = useRecoilState<Center>(mapCenterState);
  const [lastCenter, setLastCenter] = useRecoilState<Center>(lastCenterState);

  const [selected, setSelected] = useRecoilState<number>(
    selectedPlaceIndexState,
  );

  const markerOnClick = (item: PlaceDetail, index: number) => {
    setModalVisible(true);
    setSelected(index);
    setShowAlternative(true);
  };

  useEffect(() => {
    if (!modalVisible) {
      setSelected(-1);
    }
  }, [modalVisible]);

  useEffect(() => {
    if (selected >= 0 && selected < resultList.length) {
      setCurPlace({...resultList[selected], max_length: resultList.length});
      setCenter({
        latitude: resultList[selected].coordinate.latitude,
        longitude: resultList[selected].coordinate.longitude,
        zoom: lastCenter.zoom,
      });
    }
  }, [selected]);

  useEffect(() => {
    if (resultList && resultList.length > 0) {
      setSelected(-1);
      setLastCenter(center); //FIXME: might cause dependency issue..
      setTimeout(() => {
        setSelected(0);
      }, 1000);
    }
  }, [resultList]);

  useEffect(() => {
    // Alert.alert('resultList', JSON.stringify(resultList.length));

    return () => setListModalVisible(false);
  }, []);

  return (
    <>
      {resultList.map((item: PlaceDetail, index: number) => {
        let markerImage = markerList.basic.default;
        if (item.open === 'Y') markerImage = markerList.basic.on;
        else if (item.open === 'N') markerImage = markerList.basic.off;
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
            zIndex={index === selected ? 1 : 0}
            //TODO: use different images for different categories
          />
        );
      })}
    </>
  );
}
