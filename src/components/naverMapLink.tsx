import React from 'react';
import {Alert, Linking, Text, TouchableOpacity} from 'react-native';
import NaverLogo from '../assets/images/naverLogo.svg';
import {
  NMAP_URL_SCHEME_PREFIX,
  NMAP_URL_SCHEME_SUFFIX,
  STORE_URL,
} from '../config/consts/link';
import {useRecoilValue} from 'recoil';
import {Navigation} from '../config/types/navigation';
import {navigationState} from '../atoms/navigationState';
import {PlaceDetail} from '../config/types/coordinate';
import {curPlaceState} from '../atoms/curPlaceState';
import {createURLScheme} from '../config/helpers/nmapLink';

const NaverMapLink = ({
  stopByStrategy,
}: {
  stopByStrategy: 'FRONT' | 'MIDDLE' | 'REAR' | undefined;
}) => {
  const nav = useRecoilValue<Navigation>(navigationState);
  const curPlace = useRecoilValue<PlaceDetail | null>(curPlaceState);

  const openNaverMap = () => {
    if (!nav.start || !nav.end || !curPlace) {
      Alert.alert('오류', '일시적인 오류입니다. 다시 시도해주세요.');
      return;
    }

    const url = createURLScheme(
      nav.start,
      nav.end,
      nav.wayPoints,
      curPlace,
      stopByStrategy,
    );

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            '오류',
            '네이버맵이 설치되어있지 않습니다.\n설치 페이지로 이동합니다.ㄴ',
            [
              {
                text: '취소',
                style: 'cancel',
              },
              {text: '확인', onPress: () => Linking.openURL(STORE_URL)},
            ],
          );
        }
      })
      .catch(err => console.error('An error occurred', err));
  };
  return (
    <TouchableOpacity
      className="flex-row justify-center items-center rounded-full bg-[#57B04B] px-3.5 py-2.5"
      onPress={openNaverMap}>
      <NaverLogo width={15} height={15} />
      <Text className="ml-2 text-white text-xs">네이버맵 길안내 시작</Text>
    </TouchableOpacity>
  );
};

export default NaverMapLink;
