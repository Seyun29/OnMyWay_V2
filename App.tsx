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
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {LogBox} from 'react-native';
import usePermissions from './src/hooks/usePermissions';

LogBox.ignoreLogs([
  /View #\d+ of type RCTView has a shadow set but cannot calculate shadow efficiently./,
]);

function App(): React.JSX.Element {
  // usePermissions();s

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
    <React.StrictMode>
      <RecoilRoot>
        <GestureHandlerRootView className="flex-1">
          <RootStackNavigation />
          <Toast />
        </GestureHandlerRootView>
      </RecoilRoot>
    </React.StrictMode>
  );
}

export default App;
