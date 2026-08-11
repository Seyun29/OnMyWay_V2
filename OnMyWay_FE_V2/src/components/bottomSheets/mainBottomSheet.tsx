import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useRecoilState, useRecoilValue} from '../../state/atom';
import {modalState} from '../../atoms/modalState';
import WebView from 'react-native-webview';
import Spinner from '../spinner';
import {curPlaceState} from '../../atoms/curPlaceState';
import {getKakaoPlace} from '../../api/getKakaoPlace';
import {getPlaceDetail} from '../../api/getPlaceDetail';
import {
  Coordinate,
  ExtraDetail,
  PlaceDetail,
} from '../../config/types/coordinate';
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
    path: Coordinate[];
  } | null;
  setStopByData: (
    data: {
      strategy: 'FRONT' | 'REAR' | 'MIDDLE';
      duration: number;
      path: Coordinate[];
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
  const [isWebViewLoading, setIsWebViewLoading] = useState<boolean>(false);
  const [extra, setExtra] = useState<ExtraDetail>({});
  const [stopByLoading, setStopByLoading] = useState<boolean>(false);

  const getStopBy = async () => {
    if (!curPlace) return;
    setStopByData(null);
    setStopByLoading(true);
    const res = await getStopByDuration(
      nav,
      curPlace.coordinate,
      selectedRoute?.priority,
      selectedRoute?.avoidTolls,
    );
    if (res) {
      setStopByData({
        duration: res.duration,
        strategy: res.strategy,
        path: res.path,
      });
    }
    setStopByLoading(false);
  };

  const snapPoints = useMemo(() => ['23%', '83%', '93%'], []);

  // Kakao place_url에서만 숫자 ID를 추출한다. Google 등 다른 provider URL이면 빈 값.
  const placeId = curPlace?.place_url?.match(/\/(\d+)$/)?.[1] ?? '';

  const setExtraData = async () => {
    if (
      curPlace?.open ||
      curPlace?.tags ||
      curPlace?.photoUrl ||
      curPlace?.commentCnt ||
      curPlace?.reviewCnt
    )
      return;

    if (placeId) {
      const res = await getKakaoPlace(placeId);
      setExtra({
        open:
          res.business_hours?.real_time_info?.business_hours_status?.code ===
          'OPEN',
        tags: res.place_add_info?.tags,
        photoUrl: res.photos?.photos[0]?.url
          ? res.photos.photos[0].url.replace(/^http:\/\//i, 'https://')
          : null,
        commentCnt: res.kakaomap_review?.score_set?.review_count,
        reviewCnt: res.blog_review?.review_count,
        parking: res.place_add_info?.facilities?.is_parking,
        scoreAvg: res.kakaomap_review?.score_set?.average_score,
      });
      return;
    }

    // Google 결과: BE /map/place-detail로 보강. null(UNKNOWN)은 badge를 만들지 않도록
    // undefined로 두고 false로 바꾸지 않는다.
    if (curPlace?.place_id) {
      const detail = await getPlaceDetail(curPlace.place_id);
      if (!detail) return;
      setExtra({
        open: detail.open ?? undefined,
        parking: detail.parking ?? undefined,
        scoreAvg: detail.rating !== null ? detail.rating.toString() : undefined,
        commentCnt: detail.rating_count ?? undefined,
      });
    }
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
      //webview bug fix (network error alert)
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500); //bug fix ends

      getStopBy();
      setExtra({});
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
            zIndex: 100,
          }}>
          {curPlace &&
            (isLoading ? (
              <View className="absolute w-full h-full">
                <Spinner />
                <View className="w-full h-1/4 bg-white" />
              </View>
            ) : (
              <View className="flex-1">
                <WebView
                  source={{
                    uri: curPlace.place_url.replace(/^http:\/\//i, 'https://'),
                  }}
                  style={{flex: 1}}
                  nestedScrollEnabled
                  // onLoadStart={() => setIsLoading(true)}
                  // onLoadEnd={() => {
                  //   setIsLoading(false);
                  // }}
                />
              </View>
            ))}
          {curIdx === 0 && curPlace && (
            <View className="absolute w-full h-full bg-white">
              <BottomSheetComponent
                placeInfo={{
                  ...curPlace,
                  ...extra,
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
