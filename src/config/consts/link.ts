import {Platform} from 'react-native';
import {ANDROID_PACKAGE_NAME, IOS_BUNDLE_ID} from '@env';

export const NMAP_URL_SCHEME_PREFIX = 'nmap://route/car?';
export const NMAP_URL_SCHEME_SUFFIX = `&appname=${
  Platform.OS === 'ios' ? IOS_BUNDLE_ID : ANDROID_PACKAGE_NAME
}`;

export const playStoreUrl = 'market://details?id=com.nhn.android.nmap';
export const appStoreUrl = 'http://itunes.apple.com/app/id311867728?mt=8';
export const STORE_URL = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;
