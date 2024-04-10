import {Button, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import NaverMap from '../../components/naverMap';
import MainBottomSheet from '../../components/mainBotttomSheet';

export type RootStackParam = {
  Home: undefined;
  Test: undefined;
};

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

  return (
    <View style={{flex: 1}}>
      <NaverMap />
      <Button
        title="Go to TestScreen"
        onPress={() => navigation.navigate('Test')}
      />
      <MainBottomSheet />
    </View>
  );
};
