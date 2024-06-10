import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Alert, View} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useRecoilState, useRecoilValue} from 'recoil';
import {modalState} from '../../atoms/modalState';
import WebView from 'react-native-webview';
import Spinner from '../spinner';
import {curPlaceState} from '../../atoms/curPlaceState';
import {getKakaoPlace} from '../../api/getKakaoPlace';
import {ExtraDetail, PlaceDetail} from '../../config/types/coordinate';
import BottomSheetComponent from './bottomSheetComponent';
import {getStopByDuration} from '../../api/getStopByDuration';
import {navigationState} from '../../atoms/navigationState';
import {RouteDetail} from '../../config/types/routes';
import {listModalState} from '../../atoms/listModalState';

export default function MainBottomSheet({
  selectedRoute,
  stopByData,
  setStopByData,
}: {
  selectedRoute: RouteDetail | null;
  stopByData: {
    strategy: 'FRONT' | 'REAR' | 'MIDDLE';
    duration: number;
  } | null;
  setStopByData: (
    data: {
      strategy: 'FRONT' | 'REAR' | 'MIDDLE';
      duration: number;
    } | null,
  ) => void;
}) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [modalVisible, setModalVisible] = useRecoilState<boolean>(modalState);
  const curPlace = useRecoilValue<PlaceDetail | null>(curPlaceState);
  const nav = useRecoilValue(navigationState);
  const [, setListModalVisible] = useRecoilState<boolean>(listModalState);

  const [curIdx, setCurIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [extra, setExtra] = useState<ExtraDetail>({});
  const [stopByLoading, setStopByLoading] = useState<boolean>(false);

  const getStopBy = async () => {
    if (!curPlace) return;
    setStopByData(null);
    setStopByLoading(true);
    const res = await getStopByDuration(nav, curPlace.coordinate);
    if (res) {
      setStopByData({duration: res.duration, strategy: res.strategy});
    }
    setStopByLoading(false);
  };

  const snapPoints = useMemo(() => ['23%', '80%'], []);

  //@ts-ignore
  const placeId = curPlace ? curPlace.place_url.match(/\/(\d+)$/)[1] : '';

  const setExtraData = async () => {
    if (
      curPlace?.open ||
      curPlace?.tags ||
      curPlace?.photoUrl ||
      curPlace?.commentCnt ||
      curPlace?.reviewCnt
    )
      return;
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
      setListModalVisible(false);
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
          {curIdx >= 1 && curPlace && (
            <WebView
              source={{
                uri: curPlace.place_url.replace(/^http:\/\//i, 'https://'),
              }}
              style={{flex: 1}}
              nestedScrollEnabled
              onLoadStart={() => {
                setIsLoading(true);
                console.log('loading');
              }}
              onLoadEnd={() => {
                setIsLoading(false);
              }}
            />
          )}
          {isLoading && (
            <View className="absolute w-full h-full">
              <Spinner />
              <View className="w-full h-1/4 bg-white" />
            </View>
          )}
          {curIdx === 0 && curPlace && (
            <View className="absolute w-full h-full bg-white">
              <BottomSheetComponent
                placeInfo={{
                  ...extra,
                  ...curPlace,
                  stopByDuration: stopByData?.duration,
                  originalDuration: selectedRoute?.duration,
                }}
                stopByLoading={stopByLoading}
                onPress={() => {
                  bottomSheetModalRef.current?.snapToIndex(1);
                }}
              />
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}
