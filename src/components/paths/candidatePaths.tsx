import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Routes, RouteDetail} from '../../config/types/routes';
import {Path} from 'react-native-nmap';
import {Coordinate} from '../../config/types/coordinate';

function DefaultPath({path}: {path: Coordinate[]}) {
  return (
    <Path
      color="#949494"
      coordinates={path}
      width={8}
      outlineWidth={0}
      zIndex={-1}
    />
  );
}

export function SelectedPath({path}: {path: Coordinate[]}) {
  return (
    <Path
      color={'#20C933'}
      coordinates={path}
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
      return <SelectedPath path={routes[0].path} />;
    case 2:
      return (
        <>
          <DefaultPath
            path={curRouteIdx === 0 ? routes[1].path : routes[0].path}
          />
          <SelectedPath path={routes[curRouteIdx].path} />
        </>
      );
    case 3:
      return (
        <>
          {routes.map((route, idx) => {
            if (idx !== curRouteIdx) {
              return <DefaultPath path={route.path} key={idx} />;
            }
          })}
          <SelectedPath path={routes[curRouteIdx].path} />
        </>
      );
    default:
      return <></>;
  }
}
