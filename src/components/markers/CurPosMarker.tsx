import React from 'react';
import {markerCurPosUndirected} from '../../config/consts/image';
import {Marker} from 'react-native-nmap';
import {Coordinate} from '../../config/types/coordinate';

const CurPosMarker = ({curPosition}: {curPosition: Coordinate}) => {
  return (
    <Marker
      coordinate={curPosition}
      width={30}
      height={30}
      image={markerCurPosUndirected}
      zIndex={300} //FIXME: adjust zIndex
    />
  );
};

export default CurPosMarker;
