import React, {type PropsWithChildren, useEffect, useRef} from 'react';
import {type StyleProp, type ViewStyle} from 'react-native';
import {
  NaverMapView,
  type Region as NaverRegion,
} from '@mj-studio/react-native-naver-map';
import MapView, {PROVIDER_GOOGLE, type Region} from 'react-native-maps';
import {useRecoilValue} from '../../state/atom';
import {mapRendererState} from '../../atoms/mapRendererState';
import {Center, Coordinate} from '../../config/types/coordinate';

export interface CameraChangeEvent extends Center {
  coveringRegion: Coordinate[];
}

export interface OmwMapViewProps {
  style?: StyleProp<ViewStyle>;
  center: Center;
  zoomControl?: boolean;
  scaleBar?: boolean;
  compass?: boolean;
  onMapClick?: () => void;
  onCameraChange?: (event: CameraChangeEvent) => void;
  onTouch?: () => void;
}

const zoomFromRegion = (region: Region): number =>
  Math.log2(360 / region.longitudeDelta);

const coveringRegionFromRegion = (region: Region): Coordinate[] => {
  const halfLat = region.latitudeDelta / 2;
  const halfLng = region.longitudeDelta / 2;
  return [
    {
      latitude: region.latitude - halfLat,
      longitude: region.longitude - halfLng,
    },
    {
      latitude: region.latitude - halfLat,
      longitude: region.longitude + halfLng,
    },
    {
      latitude: region.latitude + halfLat,
      longitude: region.longitude + halfLng,
    },
    {
      latitude: region.latitude + halfLat,
      longitude: region.longitude - halfLng,
    },
  ];
};

const coveringRegionFromNaverRegion = (
  region: NaverRegion,
): Coordinate[] => [
  {latitude: region.latitude, longitude: region.longitude},
  {
    latitude: region.latitude,
    longitude: region.longitude + region.longitudeDelta,
  },
  {
    latitude: region.latitude + region.latitudeDelta,
    longitude: region.longitude + region.longitudeDelta,
  },
  {
    latitude: region.latitude + region.latitudeDelta,
    longitude: region.longitude,
  },
];

function GoogleMapContainer({
  style,
  center,
  compass,
  onMapClick,
  onCameraChange,
  onTouch,
  children,
}: PropsWithChildren<OmwMapViewProps>) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    mapRef.current?.animateCamera(
      {
        center: {latitude: center.latitude, longitude: center.longitude},
        zoom: center.zoom,
      },
      {duration: 300},
    );
  }, [center.latitude, center.longitude, center.zoom]);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={style}
      initialCamera={{
        center: {latitude: center.latitude, longitude: center.longitude},
        zoom: center.zoom,
        heading: 0,
        pitch: 0,
      }}
      showsCompass={compass ?? false}
      toolbarEnabled={false}
      onPress={onMapClick}
      onPanDrag={onTouch}
      onRegionChangeComplete={region => {
        onCameraChange?.({
          latitude: region.latitude,
          longitude: region.longitude,
          zoom: zoomFromRegion(region),
          coveringRegion: coveringRegionFromRegion(region),
        });
      }}>
      {children}
    </MapView>
  );
}

export default function OmwMapView({
  children,
  ...props
}: PropsWithChildren<OmwMapViewProps>) {
  const renderer = useRecoilValue(mapRendererState);

  if (renderer === 'GOOGLE') {
    return <GoogleMapContainer {...props}>{children}</GoogleMapContainer>;
  }
  const {
    style,
    center,
    zoomControl,
    scaleBar,
    compass,
    onMapClick,
    onCameraChange,
    onTouch,
  } = props;
  return (
    <NaverMapView
      style={style}
      camera={center}
      animationDuration={300}
      isShowZoomControls={zoomControl}
      isShowScaleBar={scaleBar}
      isShowCompass={compass}
      mapType="Basic"
      onTapMap={onMapClick}
      onTouchStart={onTouch}
      onCameraIdle={event => {
        onCameraChange?.({
          latitude: event.latitude,
          longitude: event.longitude,
          zoom: event.zoom ?? center.zoom,
          coveringRegion: coveringRegionFromNaverRegion(event.region),
        });
      }}>
      {children}
    </NaverMapView>
  );
}
