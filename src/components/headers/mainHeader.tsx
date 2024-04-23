import React, {useEffect} from 'react';
import {
  Pressable,
  View,
  LayoutAnimation,
  Text,
  TouchableOpacity,
} from 'react-native';
import MenuIconSVG from '../../assets/images/menuIcon.svg';
import AddStopOverSVG from '../../assets/images/addStopOver.svg';
import ChangeDirectionSVG from '../../assets/images/changeDirection.svg';
import RemoveStopoOverSVG from '../../assets/images/removeStopOver.svg';
import HeaderLogoSVG from '../../assets/images/headerLogo.svg';
import {HEADER_LOGO_HEIGHT} from '../../config/consts/style';
import {headerRoughState} from '../../atoms/headerRoughState';
import {useRecoilState} from 'recoil';
import {drawerState} from '../../atoms/drawerState';
import {navigationState} from '../../atoms/navigationState';
import InputBox from './inputBox';
import RightArrow from '../../assets/images/rightArrow.svg';
import useNavReverse from '../../hooks/useNavReverse';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParam} from '../../navigations';

export default function MainHeader() {
  //FIXME: utilize components outside
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const reverseNav = useNavReverse();
  const [nav, setNav] = useRecoilState(navigationState);
  const [isRough, setIsRough] = useRecoilState<boolean>(headerRoughState);
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState<boolean>(drawerState);

  const removeWayPoint = (idx: number) => {
    setNav(prev => {
      const newWayPoints = [...prev.wayPoints];
      newWayPoints.splice(idx, 1);
      return {...prev, wayPoints: newWayPoints};
    });
  };

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isRough]);

  return (
    <View
      style={{
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      }}
      className="bg-white w-full justify-start items-start px-[16px] pt-[16px] pb-[13px] gap-y-[13px]">
      <View className="w-full flex-row justify-between align-center">
        <Pressable onPress={() => setIsDrawerOpen(!isDrawerOpen)}>
          <MenuIconSVG height={HEADER_LOGO_HEIGHT} width={'24px'} />
        </Pressable>
        <HeaderLogoSVG height={HEADER_LOGO_HEIGHT} />
        <View className={`w-[24px] h-[${HEADER_LOGO_HEIGHT}]`} />
      </View>
      <View className="relative flex-row items-center justify-between w-full pr-[16px]">
        <View className="flex-col w-full pr-[10px]">
          {isRough ? (
            <InputBox
              children={
                <View className="flex-1 flex-row justify-around">
                  <Text>{nav.start?.name}</Text>
                  <RightArrow height={'15px'} width={'15px'} />
                  <Text>{nav.end?.name}</Text>
                </View>
              }
              onPress={() => {
                console.log('navigate to PlaceInputScreen.tsx');
                navigation.navigate('PlaceInput');
              }}
            />
          ) : (
            <>
              {nav.wayPoints.length === 0 && (
                <TouchableOpacity
                  className="absolute z-10 right-[20px] top-0 transform translate-y-[29px] bg-white h-[26px] w-[26px] rounded-[100px] shadow-md items-center justify-center"
                  onPress={() => {
                    console.log('add stopover here');
                    navigation.navigate('PlaceInput');
                  }}>
                  <AddStopOverSVG height={'18px'} width={'18px'} />
                </TouchableOpacity>
              )}
              <InputBox
                text={nav.start?.name}
                altText={'출발지 입력'}
                onPress={() => {
                  console.log('navigate here! (출발지 입력/수정)');
                  navigation.navigate('PlaceInput');
                }}
              />
              {nav.wayPoints.map((wayPoint, idx) => (
                <InputBox
                  key={idx}
                  text={wayPoint?.name}
                  altText={'경유지 입력'}
                  onPress={() => console.log('navigate here! (경유지 수정)')}
                  children={
                    <TouchableOpacity
                      className="absolute z-10 right-[15px] bg-white h-[26px] w-[26px] rounded-[100px] shadow-md items-center justify-center"
                      onPress={() => {
                        removeWayPoint(idx);
                      }}>
                      <RemoveStopoOverSVG height={'20px'} width={'20px'} />
                    </TouchableOpacity>
                  }
                />
              ))}
              <InputBox
                text={nav.end?.name}
                altText={'도착지 입력'}
                onPress={() => {
                  console.log('navigate here! (도착지 입력/수정)');
                  navigation.navigate('PlaceInput');
                }}
                children={
                  nav.wayPoints.length === 1 && (
                    <TouchableOpacity
                      className="absolute z-10 right-[15px] bg-white h-[26px] w-[26px] rounded-[100px] shadow-md items-center justify-center"
                      onPress={() => {
                        console.log(
                          'navigate to PlaceInputScreen (경유지 추가)',
                        );
                        navigation.navigate('PlaceInput');
                      }}>
                      <AddStopOverSVG height={'18px'} width={'18px'} />
                    </TouchableOpacity>
                  )
                }
              />
            </>
          )}
        </View>
        <TouchableOpacity onPress={reverseNav}>
          <ChangeDirectionSVG height={'24px'} width={'24px'} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        className="self-center"
        onPress={() => setIsRough(!isRough)}>
        <Text className="text-black">
          {isRough ? 'Expand Test' : 'Shrink Test'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
