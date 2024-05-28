import React, {useEffect, useMemo, useRef} from 'react';
import {View, Text} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useRecoilState, useRecoilValue} from 'recoil';
import {modalState} from '../../atoms/modalState';
import {listModalState} from '../../atoms/listModalState';
import BottomSheetComponent from './bottomSheetComponent';
import {PlaceDetail} from '../../config/types/coordinate';

export default function ListBottomSheet({
  result,
  setResult,
}: {
  result: PlaceDetail[];
  setResult: (result: PlaceDetail[]) => void;
}) {
  const [, setModalVisible] = useRecoilState<boolean>(modalState);
  const [listModalVisible, setListModalVisible] =
    useRecoilState<boolean>(listModalState);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['23%', '85%'], []);

  useEffect(() => {
    if (listModalVisible) {
      setModalVisible(false);
      bottomSheetModalRef.current?.present();
    } else {
      //   console.log('listModalVisible', listModalVisible);
      bottomSheetModalRef.current?.close();
    }
  }, [listModalVisible]);

  console.log('listModalVisible', listModalVisible);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onDismiss={() => setListModalVisible(false)}
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
          <Text>!!!!!!!!!!!!!!!!!!!!!</Text>
          {/* <BottomSheetComponent
            placeInfo={
              {
                //   ...curPlace,
                //   ...extra,
                //   stopByDuration: stopByData?.duration,
                //   originalDuration: selectedRoute?.duration,
              }
            }
          /> */}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}
