import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useRecoilState, useRecoilValue} from 'recoil';
import {modalState} from '../atoms/modalState';
import WebView from 'react-native-webview';
import Spinner from './spinner';
import {curPlaceState} from '../atoms/curPlaceState';
import {getKakaoPlace} from '../api/getKakaoPlace';
import {ExtraDetail, PlaceDetail} from '../config/types/coordinate';
import BottomSheetComponent from './bottomSheetComponent';
import {getStopByDuration} from '../api/getStopByDuration';
import {navigationState} from '../atoms/navigationState';
import {RouteDetail} from '../config/types/routes';

export default function MainBottomSheet({
  selectedRoute,
}: {
  selectedRoute: RouteDetail | null;
}) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [modalVisible, setModalVisible] = useRecoilState<boolean>(modalState);
  const curPlace = useRecoilValue<PlaceDetail | null>(curPlaceState);
  const nav = useRecoilValue(navigationState);

  const [curIdx, setCurIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [extra, setExtra] = useState<ExtraDetail>({});
  const [stopByDuration, setStopByDuration] = useState<number | null>(null);

  const getStopBy = async () => {
    if (!curPlace) return;
    setStopByDuration(null);
    const res = await getStopByDuration(nav, curPlace.coordinate);
    if (res) setStopByDuration(res);
  };

  const snapPoints = useMemo(() => ['23%', '80%'], []);

  //@ts-ignore
  const placeId = curPlace ? curPlace.place_url.match(/\/(\d+)$/)[1] : '';

  const setExtraData = async () => {
    const res = await getKakaoPlace(placeId);
    let scoreAvg;
    if (
      res.comment?.scorecnt &&
      res.comment?.scorecnt !== 0 &&
      res.comment?.scoresum
    ) {
      const scorecnt = res.comment?.scorecnt;
      const scoresum = res.comment?.scoresum;
      scoreAvg = ((scoresum / (scorecnt * 5)) * 5).toFixed(1);
    }
    setExtra({
      open: res.basicInfo?.openHour?.realtime?.open,
      tags: res.basicInfo?.tags,
      photoUrl: res.photo?.photoList[0].list[0].orgurl
        ? res.photo?.photoList[0].list[0].orgurl.replace(
            /^http:\/\//i,
            'https://',
          )
        : null,
      commentCnt: res.comment?.kamapComntcnt,
      reviewCnt: res.blogReview?.blogrvwcnt,
      scoreAvg,
    });
  };

  useEffect(() => {
    if (modalVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [modalVisible]);

  useEffect(() => {
    if (curPlace) {
      getStopBy();
      setExtraData();
    }
  }, [curPlace]);

  if (!curPlace) return <></>;

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onDismiss={() => setModalVisible(false)}
        onChange={index => setCurIdx(index)}
        enableDismissOnClose
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.32,
          shadowRadius: 5.46,
          elevation: 9,
        }}>
        <BottomSheetView
          style={{
            flex: 1,
          }}>
          <WebView
            source={{
              uri: curPlace.place_url.replace(/^http:\/\//i, 'https://'),
            }}
            style={{flex: 1}}
            nestedScrollEnabled
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => {
              setIsLoading(false);
            }}
          />
          {isLoading && (
            <View className="absolute w-full h-full">
              <Spinner />
              <View className="w-full h-1/4 bg-white" />
            </View>
          )}
          {curIdx === 0 && (
            <View className="absolute w-full h-full bg-white">
              <BottomSheetComponent
                placeInfo={{
                  ...curPlace,
                  ...extra,
                  stopByDuration,
                  originalDuration: selectedRoute?.duration,
                }}
              />
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}
