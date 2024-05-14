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
import {ExtraDetail} from '../config/types/coordinate';
import BottomSheetComponent from './bottomSheetComponent';

export default function MainBottomSheet() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [modalVisible, setModalVisible] = useRecoilState<boolean>(modalState);
  const curPlace = useRecoilValue(curPlaceState);

  const [curIdx, setCurIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [extra, setExtra] = useState<ExtraDetail>({});

  const snapPoints = useMemo(() => ['25%', '70%', '95%'], []);

  //@ts-ignore
  const placeId = curPlace ? curPlace.place_url.match(/\/(\d+)$/)[1] : '';

  const setExtraData = async () => {
    const res = await getKakaoPlace(placeId);
    setExtra({
      open: res.basicInfo?.openHour?.realtime?.open,
      tags: res.basicInfo?.tags,
      photoUrl: res.photo?.photoList[0].list[0].orgurl
        ? res.photo?.photoList[0].list[0].orgurl.replace(
            /^http:\/\//i,
            'https://',
          )
        : null,
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
    if (curPlace) setExtraData();
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
            source={{uri: curPlace.place_url}}
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
              <BottomSheetComponent placeInfo={{...curPlace, ...extra}} />
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}
