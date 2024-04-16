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

export default function MainBottomSheet() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [modalVisible, setModalVisible] = useRecoilState<boolean>(modalState);

  const snapPoints = useMemo(() => ['100%', '100%'], []);

  useEffect(() => {
    console.log('modalVisible :', modalVisible);
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
            <BottomSheetView>
              <Text>TestModal</Text>
            </BottomSheetView>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
