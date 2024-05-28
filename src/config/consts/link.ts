import {Platform} from 'react-native';
import {ANDROID_PACKAGE_NAME, IOS_BUNDLE_ID} from '@env';

export const NMAP_URL_SCHEME_PREFIX = 'nmap://route/car?';
export const NMAP_URL_SCHEME_SUFFIX = `&appname=${
  Platform.OS === 'ios' ? IOS_BUNDLE_ID : ANDROID_PACKAGE_NAME
}`;
