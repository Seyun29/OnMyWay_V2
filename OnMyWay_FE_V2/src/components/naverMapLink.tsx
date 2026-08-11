import React, {useEffect} from 'react';
import {
  Alert,
  LayoutAnimation,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NaverLogo from '../assets/images/naverLogo.svg';
import {STORE_URL, TMAP_STORE_URL} from '../config/consts/link';
import {useRecoilValue} from '../state/atom';
import {Navigation} from '../config/types/navigation';
import {navigationState} from '../atoms/navigationState';
import {PlaceDetail} from '../config/types/coordinate';
import {curPlaceState} from '../atoms/curPlaceState';
import {createURLScheme} from '../config/helpers/nmapLink';
import TMapLogo from '../assets/images/tMapLogo.svg';
import {createTmapRouteUrl} from '../config/helpers/tmapLink';
import {useTranslation} from '../hooks/useTranslation';

const NaverMapLink = ({
  stopByStrategy,
}: {
  stopByStrategy: 'FRONT' | 'MIDDLE' | 'REAR' | undefined;
}) => {
  const {t} = useTranslation();
  const nav = useRecoilValue<Navigation>(navigationState);
  const curPlace = useRecoilValue<PlaceDetail | null>(curPlaceState);
  const [initialPressed, setInitialPressed] = React.useState<boolean>(false);

  const openNaverMap = () => {
    if (!nav.start || !nav.end || !curPlace) {
      Alert.alert(t('common.notice'), t('navigation.temporaryError'));
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
          if (Platform.OS === 'ios')
            Alert.alert(t('common.error'), t('navigation.naverMissingIos'), [
              {
                text: t('common.confirm'),
                onPress: () => Linking.openURL(STORE_URL),
              },
              {
                text: t('common.cancel'),
                style: 'cancel',
              },
            ]);
          else
            Alert.alert(
              t('common.error'),
              t('navigation.naverMissingAndroid'),
              [
                {
                  text: t('common.confirm'),
                  onPress: () => Linking.openURL(STORE_URL),
                },
                {
                  text: t('common.cancel'),
                  style: 'cancel',
                },
              ],
            );
        }
      })
      .catch(() => {
        Alert.alert(t('common.error'), t('navigation.temporaryError'));
      });
  };

  const openTMap = () => {
    if (!nav.end) {
      Alert.alert(t('common.notice'), t('navigation.temporaryError'));
      return;
    }

    const url = createTmapRouteUrl(nav.end);
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) return Linking.openURL(url);

        const storeName = t(
          Platform.OS === 'android'
            ? 'navigation.playStore'
            : 'navigation.appStore',
        );
        Alert.alert(
          t('common.error'),
          t('navigation.tmapMissing', {store: storeName}),
          [
            {
              text: t('common.confirm'),
              onPress: () => Linking.openURL(TMAP_STORE_URL),
            },
            {text: t('common.cancel'), style: 'cancel'},
          ],
        );
      })
      .catch(() => {
        Alert.alert(t('common.error'), t('navigation.temporaryError'));
      });
  };

  useEffect(() => {
    if (initialPressed && curPlace) setInitialPressed(false);
  }, [curPlace]);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [initialPressed]);

  if (Platform.OS === 'ios')
    return (
      <TouchableOpacity
        className="flex-row justify-center items-center rounded-full px-3.5 py-2.5 mb-1"
        onPress={openNaverMap}
        style={{
          backgroundColor: '#57B04B',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <NaverLogo width={15} height={15} />
        <Text className="ml-2 text-white text-xs">
          {t('navigation.naverStart')}
        </Text>
      </TouchableOpacity>
    );

  return (
    <View className="pb-2">
      {initialPressed && (
        <TouchableOpacity
          className="flex-row justify-center items-center rounded-full"
          onPress={openNaverMap}
          style={{
            backgroundColor: '#57B04B',
            paddingVertical: 8.5,
            paddingHorizontal: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <NaverLogo width={15} height={15} />
          <Text className="ml-2 text-white text-xs">
            {t('navigation.naverStart')}
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        className="flex-row justify-center items-center rounded-full bg-[#ffffff] px-3.5 pl-2.5 py-[5px] mt-2"
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() => {
          if (!initialPressed) setInitialPressed(true);
          else openTMap();
        }}>
        <TMapLogo width={22} height={22} />
        <Text className="ml-0.5 text-slate-700 text-xs">
          {t('navigation.tmapStart')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NaverMapLink;
