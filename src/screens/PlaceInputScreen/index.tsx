import React, {useState} from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
  Text,
} from 'react-native';
import PlaceInputHeader from '../../components/headers/placeInputHeader';
import NoHistorySVG from '../../assets/images/noHistory.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRecoilState, useRecoilValue} from 'recoil';
import {navigationState} from '../../atoms/navigationState';

import {useNavigation} from '@react-navigation/native';
import {whichNavState} from '../../atoms/whichNavState';

// const store = async () => {
//   try {
//     await AsyncStorage.setItem('key', 'value');
//   } catch (e) {
//     // saving error
//   }
// };

// const get = async () => {
//   try {
//     const value = await AsyncStorage.getItem('key');
//     console.log('value: ', value);
//     if (value !== null) {
//       // value previously stored
//       return value;
//     }
//   } catch (e) {
//     // error reading value
//   }
//   return false;
// };

export default function PlaceInputScreen() {
  //FIXME: choose what to edit
  //FIXME: add 'keyboard.dismiss()' when user clicks outside of the input box
  //FIXME: use keyboardavoidingview so that the SVG is located differently when the keyboard is open
  //TODO: use asyncstorage => Use JSON.stringify() and JSON.parse() to store and retrieve objects and arrays.
  //FIXME: "검색 결과가 없습니다!!" 표시해주기!!!
  const [resultList, setResultList] = useState([]);
  const [isResult, setIsResult] = useState<boolean>(false);
  const [, setNav] = useRecoilState(navigationState);
  const whichNav = useRecoilValue(whichNavState);
  const navigation = useNavigation();

  const handlePress = (result: any) => {
    switch (whichNav) {
      case 'start':
        setNav(prev => {
          return {
            ...prev,
            start: {
              name: result?.placeName,
              coordinate: result?.coordinate,
            },
          };
        });
        break;
      case 'end':
        setNav(prev => {
          return {
            ...prev,
            end: {
              name: result?.placeName,
              coordinate: result?.coordinate,
            },
          };
        });
        break;
      case 'editWayPoint1':
        setNav(prev => {
          const newWayPoint = {
            name: result?.placeName,
            coordinate: result?.coordinate,
          };
          return {
            ...prev,
            wayPoints:
              prev.wayPoints.length === 2
                ? [newWayPoint, prev.wayPoints[1]]
                : [newWayPoint],
          };
        });
        break;
      case 'editWayPoint2':
        setNav(prev => {
          return {
            ...prev,
            wayPoints: [
              prev.wayPoints[0],
              {
                name: result?.placeName,
                coordinate: result?.coordinate,
              },
            ],
          };
        });
        break;
      case 'newWayPoint':
        setNav(prev => {
          return {
            ...prev,
            wayPoints: [
              ...prev.wayPoints,
              {
                name: result?.placeName,
                coordinate: result?.coordinate,
              },
            ],
          };
        });
        break;
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white w-full h-full">
      <PlaceInputHeader
        setResultList={setResultList}
        setIsResult={setIsResult}
      />
      {/* FIXME: use keyboardavoidingview only when there's NO history!!!! */}
      <Pressable
        className="flex-1"
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <KeyboardAvoidingView
          className="flex-1 justify-center items-center"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {isResult ? (
            resultList.length > 0 ? (
              resultList.map((result, idx) => (
                //FIXME: add type, Scrollable, add designs
                <Pressable
                  key={idx}
                  onPress={() => {
                    handlePress(result);
                  }}>
                  <Text className="mb-1 text-xl">{result?.placeName}</Text>
                </Pressable>
              ))
            ) : (
              <Text>검색 결과가 없습니다.</Text>
            )
          ) : (
            <NoHistorySVG height={130} width={130} />
          )}
        </KeyboardAvoidingView>
      </Pressable>
    </SafeAreaView>
  );
}
