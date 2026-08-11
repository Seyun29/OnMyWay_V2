import React from 'react';
import {markerList} from '../../config/consts/image';
import {MapMarker} from '../maps/mapPrimitives';
import {useRecoilValue} from '../../state/atom';
import {Navigation} from '../../config/types/navigation';
import {navigationState} from '../../atoms/navigationState';
import {NAV_MARKER_HEIGHT, NAV_MARKER_WIDTH} from '../../config/consts/map';

const NavMarker = () => {
  const nav = useRecoilValue<Navigation>(navigationState);

  return (
    <>
      {nav.start && (
        <MapMarker
          coordinate={nav.start.coordinate}
          width={NAV_MARKER_WIDTH}
          height={NAV_MARKER_HEIGHT}
          image={markerList.start}
          zIndex={300}
        />
      )}
      {nav.wayPoints.map((wayPoint, index) => (
        <MapMarker
          key={index}
          coordinate={wayPoint.coordinate}
          width={NAV_MARKER_WIDTH}
          height={NAV_MARKER_HEIGHT}
          image={markerList.stopover}
          zIndex={300}
        />
      ))}
      {nav.end && (
        <MapMarker
          coordinate={nav.end.coordinate}
          width={NAV_MARKER_WIDTH}
          height={NAV_MARKER_HEIGHT}
          image={markerList.end}
          zIndex={300}
        />
      )}
    </>
  );
};

export default NavMarker;
