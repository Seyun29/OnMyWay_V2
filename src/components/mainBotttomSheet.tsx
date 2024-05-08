import React, {useEffect, useMemo, useRef} from 'react';
import {View, Text} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useRecoilState} from 'recoil';
import {modalState} from '../atoms/modalState';
import WebView from 'react-native-webview';

export default function MainBottomSheet() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [modalVisible, setModalVisible] = useRecoilState<boolean>(modalState);

  const snapPoints = useMemo(() => ['100%', '100%'], []);

  useEffect(() => {
    if (modalVisible) {
      bottomSheetModalRef.current?.present(); // 모달 가시성이 true일 때 모달 표시
    } else {
      bottomSheetModalRef.current?.dismiss(); // 모달 가시성이 false일 때 모달 닫기
    }
  }, [modalVisible]);

  return (
    <GestureHandlerRootView className="flex-1">
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onDismiss={() => setModalVisible(false)}>
          <View className="flex-1 items-center">
            <BottomSheetView
              style={{
                width: '100%',
                height: '100%',
              }}>
              <WebView
                source={{uri: 'https://place.map.kakao.com/1635775764'}}
                style={{width: '100%', height: '100%'}}
                nestedScrollEnabled
              />
            </BottomSheetView>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
