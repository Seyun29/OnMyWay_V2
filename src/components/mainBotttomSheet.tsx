import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useRecoilState, useRecoilValue} from 'recoil';
import {modalState} from '../atoms/modalState';

export default function MainBottomSheet() {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const modalVisible = useRecoilValue<boolean>(modalState);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  useEffect(() => {
    if (modalVisible) {
      bottomSheetModalRef.current?.present(); // 모달 가시성이 true일 때 모달 표시
    } else {
      bottomSheetModalRef.current?.dismiss(); // 모달 가시성이 false일 때 모달 닫기
    }
  }, [modalVisible]);

  // renders
  return (
    <GestureHandlerRootView className="flex-1">
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}>
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
