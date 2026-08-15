import React from 'react';
import {Image, type ImageRequireSource} from 'react-native';
import {
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
} from '@mj-studio/react-native-naver-map';
import {Marker as GoogleMarker, Polyline} from 'react-native-maps';
import {useRecoilValue} from '../../state/atom';
import {mapRendererState} from '../../atoms/mapRendererState';
import {Coordinate} from '../../config/types/coordinate';

export interface MapMarkerProps {
  coordinate: Coordinate;
  image: ImageRequireSource;
  width: number;
  height: number;
  anchor?: {x: number; y: number};
  zIndex?: number;
  onClick?: () => void;
}

// Both renderers use a bottom-center marker anchor by default.
const DEFAULT_ANCHOR = {x: 0.5, y: 1};

function GoogleImageMarker({
  coordinate,
  image,
  width,
  height,
  anchor = DEFAULT_ANCHOR,
  zIndex,
  onClick,
}: MapMarkerProps) {
  return (
    <GoogleMarker
      coordinate={coordinate}
      anchor={anchor}
      zIndex={zIndex}
      style={{width, height}}
      tracksViewChanges
      onPress={event => {
        event.stopPropagation();
        onClick?.();
      }}>
      <Image
        source={image}
        style={{width, height}}
        resizeMode="contain"
        fadeDuration={0}
      />
    </GoogleMarker>
  );
}

export function MapMarker(props: MapMarkerProps) {
  const renderer = useRecoilValue(mapRendererState);

  if (renderer === 'GOOGLE') {
    return <GoogleImageMarker {...props} />;
  }
  return (
    <NaverMapMarkerOverlay
      latitude={props.coordinate.latitude}
      longitude={props.coordinate.longitude}
      image={props.image}
      width={props.width}
      height={props.height}
      anchor={props.anchor}
      zIndex={props.zIndex}
      onTap={props.onClick}
    />
  );
}

export interface MapPathProps {
  coordinates: Coordinate[];
  color: string;
  width: number;
  outlineWidth?: number;
  outlineColor?: string;
  zIndex?: number;
}

export function MapPath({
  coordinates,
  color,
  width,
  outlineWidth,
  outlineColor,
  zIndex,
}: MapPathProps) {
  const renderer = useRecoilValue(mapRendererState);

  if (renderer === 'GOOGLE') {
    const hasOutline = Boolean(outlineColor && outlineWidth && outlineWidth > 0);
    const baseZIndex = zIndex ?? 0;

    return (
      <>
        {hasOutline && (
          <Polyline
            coordinates={coordinates}
            strokeColor={outlineColor}
            strokeWidth={width + outlineWidth! * 2}
            zIndex={baseZIndex}
          />
        )}
        <Polyline
          coordinates={coordinates}
          strokeColor={color}
          strokeWidth={width}
          zIndex={hasOutline ? baseZIndex + 1 : baseZIndex}
        />
      </>
    );
  }
  return (
    <NaverMapPathOverlay
      coords={coordinates}
      color={color}
      width={width}
      outlineWidth={outlineWidth}
      outlineColor={outlineColor}
      zIndex={zIndex}
    />
  );
}
