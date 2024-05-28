import React, {useEffect, useMemo, useRef} from 'react';
// import {FlatList} from 'react-native';
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
import ListBottomSheetComponent from './listBottomSheetComponent';
import {FlatList, NativeViewGestureHandler} from 'react-native-gesture-handler';
import {View, Text, TouchableOpacity} from 'react-native';
import {selectedPlaceIndexState} from '../../atoms/selectedPlaceIndexState';

export default function ListBottomSheet({
  result,
  setResult,
}: {
  result: PlaceDetail[] | null;
  setResult: (result: PlaceDetail[]) => void;
}) {
  const [, setModalVisible] = useRecoilState<boolean>(modalState);
  const [listModalVisible, setListModalVisible] =
    useRecoilState<boolean>(listModalState);
  const [selected, setSelected] = useRecoilState<number>(
    selectedPlaceIndexState,
  );

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['23%', '85%'], []);

  const handleClickIsOpen = () => {
    //FIXME: sort시 영업중이지 않은 곳들도 데이터로 유지하고, filter빼면 다시 보여줘야댐
    if (result) {
      const filtered = result.filter(item => item.open === 'Y');
      setResult(filtered);
    }
  };

  const handleSortByScore = () => {
    //FIXME: undefined는 뒤로 몰아두고, 있는것들끼리 먼저 정렬
    //FIXME: 정렬시 없어지는거 해결
    if (result) {
      const sorted = result.sort((a, b) => {
        if (b.scoreAvg === undefined || a.scoreAvg === undefined) {
          return 0;
        }
        return b.scoreAvg - a.scoreAvg;
      });
      setResult({...sorted});
    }
  };

  const handleSortByReview = () => {
    //FIXME: undefined는 뒤로 몰아두고, 있는것들끼리 먼저 정렬
    if (result) {
      const sorted = result.sort((a, b) => {
        if (b.reviewCnt === undefined || a.reviewCnt === undefined) {
          return 0;
        }
        return b.reviewCnt - a.reviewCnt;
      });
      console.log(sorted);
      setResult({...sorted});
    }
  };

  useEffect(() => {
    if (listModalVisible) {
      setModalVisible(false);
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [listModalVisible]);

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
            height: '100%',
          }}>
          <View className="flex-row gap-x-2 px-8">
            <TouchableOpacity onPress={handleClickIsOpen}>
              <Text>영업중</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSortByScore}>
              <Text>평점좋은순</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSortByReview}>
              <Text>리뷰많은순</Text>
            </TouchableOpacity>
          </View>
          {result && (
            // <NativeViewGestureHandler disallowInterruption={true}>
            <FlatList
              className="flex-1 w-full px-5 pt-2 flex-col"
              data={result}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <ListBottomSheetComponent
                  placeInfo={{
                    ...item,
                  }}
                  onSelect={() => {
                    setListModalVisible(false);
                    setModalVisible(true);
                    setSelected(index);
                  }}
                />
              )}
              initialNumToRender={20}
              maxToRenderPerBatch={20}
            />
            // </NativeViewGestureHandler>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}
