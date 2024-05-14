import React, {useEffect, useMemo, useRef} from 'react';
import {View, Text} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useRecoilState} from 'recoil';
import {modalState} from '../atoms/modalState';
import WebView from 'react-native-webview';

export default function MainBottomSheet() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [modalVisible, setModalVisible] = useRecoilState<boolean>(modalState);

  const snapPoints = useMemo(() => ['25%', '70%', '100%'], []);

  useEffect(() => {
    if (modalVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [modalVisible]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onDismiss={() => setModalVisible(false)}>
        <View className="flex-1 items-center">
          <BottomSheetView
            style={{
              flex: 1,
            }}>
            <Text>Drag me</Text>
            {/* <WebView
                source={{uri: 'https://place.map.kakao.com/1635775764'}}
                style={{width: '100%', height: '100%'}}
                nestedScrollEnabled
              /> */}
          </BottomSheetView>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}
