/**
 * @format
 */

import React, {type PropsWithChildren, useEffect, useState} from 'react';
import {Platform, UIManager} from 'react-native';
import 'react-native-gesture-handler';
import './global.css';
import BootSplash from 'react-native-bootsplash';
import RootStackNavigation from './src/navigations';
import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
} from './src/state/atom';
import Toast from 'react-native-toast-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {languageState} from './src/atoms/languageState';
import {mapRendererState} from './src/atoms/mapRendererState';
import {LANGUAGE_KEY, MAP_RENDERER_KEY} from './src/config/consts/storage';
import {get, store} from './src/config/helpers/storage';
import {
  type AppLanguage,
  getDeviceLanguage,
  isAppLanguage,
  setRequestLanguage,
} from './src/config/language';
import {
  defaultRendererForLanguage,
  isMapRendererId,
  type MapRendererId,
} from './src/config/mapRenderer';

function LanguageInitializer({children}: PropsWithChildren) {
  const [, setLanguage] = useRecoilState(languageState);
  const [, setMapRenderer] = useRecoilState(mapRendererState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrateLanguage = async () => {
      const storedLanguage = await get<AppLanguage>(LANGUAGE_KEY);
      const hasStoredLanguage = isAppLanguage(storedLanguage);
      const language = hasStoredLanguage ? storedLanguage : getDeviceLanguage();
      if (!hasStoredLanguage) await store(LANGUAGE_KEY, language);

      const storedRenderer = await get<MapRendererId>(MAP_RENDERER_KEY);
      const hasStoredRenderer = isMapRendererId(storedRenderer);
      const renderer = hasStoredRenderer
        ? storedRenderer
        : defaultRendererForLanguage(language);
      if (!hasStoredRenderer) await store(MAP_RENDERER_KEY, renderer);

      if (isMounted) {
        setRequestLanguage(language);
        setLanguage(language);
        setMapRenderer(renderer);
        setIsReady(true);
        BootSplash.hide({fade: true}).catch(() => undefined);
      }
    };

    hydrateLanguage().catch(() => undefined);
    return () => {
      isMounted = false;
    };
  }, [setLanguage, setMapRenderer]);

  return isReady ? <>{children}</> : null;
}

function MapSessionBoundary() {
  const language = useRecoilValue(languageState);
  const mapRenderer = useRecoilValue(mapRendererState);
  return <RootStackNavigation key={`${language}-${mapRenderer}`} />;
}

function App(): React.JSX.Element {
  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  return (
    <React.StrictMode>
      <RecoilRoot>
        <LanguageInitializer>
          <GestureHandlerRootView className="flex-1">
            <MapSessionBoundary />
            <Toast />
          </GestureHandlerRootView>
        </LanguageInitializer>
      </RecoilRoot>
    </React.StrictMode>
  );
}

export default App;
