import {Platform} from 'react-native';
import {ANDROID_PACKAGE_NAME, IOS_BUNDLE_ID} from '@env';

export const NMAP_URL_SCHEME_PREFIX = 'nmap://route/car?';
export const NMAP_URL_SCHEME_SUFFIX = `&appname=${
  Platform.OS === 'ios' ? IOS_BUNDLE_ID : ANDROID_PACKAGE_NAME
}`;

export const playStoreUrl = 'market://details?id=com.nhn.android.nmap';
export const appStoreUrl = 'http://itunes.apple.com/app/id311867728?mt=8';
export const STORE_URL = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;

export const OMW_APPSTORE_URL =
  'https://apps.apple.com/us/app/onmyway-%EA%B2%BD%EB%A1%9C-%EC%A3%BC%EB%B3%80-%EC%9E%A5%EC%86%8C-%EA%B2%80%EC%83%89%EC%9D%84-%ED%95%9C%EB%88%88%EC%97%90/id6503656527';
export const OMW_PLAYSTORE_URL =
  'https://play.google.com/store/apps/details?id=com.omw.omw_front';
