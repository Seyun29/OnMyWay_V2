/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {Platform, UIManager} from 'react-native';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import RootStackNavigation from './src/navigations';
import {RecoilRoot} from 'recoil';
import Toast from 'react-native-toast-message';

function App(): React.JSX.Element {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1500);
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      //for layout animation enabled in Android
      //TODO: see if layout animation really works in Android
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  return (
    <RecoilRoot>
      <RootStackNavigation />
      <Toast />
    </RecoilRoot>
  );
}

export default App;
