/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import RootStackNavigation from './src/navigations';
import {RecoilRoot} from 'recoil';

function App(): React.JSX.Element {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1500);
  }, []);

  return (
    <RecoilRoot>
      <RootStackNavigation />
    </RecoilRoot>
  );
}

export default App;
