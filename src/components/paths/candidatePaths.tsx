import React from 'react';
import {View} from 'react-native';
import {Routes, RouteDetail} from '../../config/types/routes';
import {Path} from 'react-native-nmap';

function DefaultPath({route}: {route: RouteDetail}) {
  return (
    <Path
      color="#949494"
      coordinates={route.path}
      width={8}
      outlineWidth={0}
      zIndex={-1}
    />
  );
}
function SelectedPath({route}: {route: RouteDetail}) {
  return (
    <Path
      color={'#20C933'}
      coordinates={route.path}
      width={10}
      outlineWidth={2}
      outlineColor="#FFFFFF"
      zIndex={1}
    />
  );
}

export default function CandidatePaths({
  routes,
  curRouteIdx,
}: {
  routes: Routes;
  curRouteIdx: number;
}) {
  switch (routes.length) {
    case 0:
      return <></>;
    case 1:
      return <SelectedPath route={routes[0]} />;
    case 2:
      return (
        <>
          <DefaultPath route={curRouteIdx === 0 ? routes[1] : routes[0]} />
          <SelectedPath route={routes[curRouteIdx]} />
        </>
      );
    case 3:
      return (
        <>
          {routes.map((route, idx) => {
            if (idx !== curRouteIdx) {
              return <DefaultPath route={route} key={idx} />;
            }
          })}
          <SelectedPath route={routes[curRouteIdx]} />
        </>
      );
    default:
      return <></>;
  }
}
