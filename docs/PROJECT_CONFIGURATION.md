# OnMyWay 프로젝트 설정·빌드·릴리스 기준

> 최종 확인: 2026-08-10. 이 문서는 재설정에 필요한 **이름·경로·버전·절차만** 기록한다. API key, 비밀번호, 인증서 fingerprint, `.env` 실제 값은 절대 기록하지 않는다.
>
> 아래 경로는 별도 설명이 없으면 저장소 루트 기준이다.

## 1. 설정 원본 위치

| 구분                             | 기준 파일/위치                                                               |
| -------------------------------- | ---------------------------------------------------------------------------- |
| 루트 명령·패키지 관리자          | `package.json`, `pnpm-lock.yaml`                                             |
| FE/BE 의존성                     | `OnMyWay_FE_V2/package.json`, `OnMyWay_BE_V2/package.json` 및 각 lockfile    |
| Android SDK·앱 버전·signing 연결 | `OnMyWay_FE_V2/android/build.gradle`, `android/app/build.gradle`             |
| iOS 앱 버전·bundle·Team          | `OnMyWay_FE_V2/ios/omw_front.xcodeproj/project.pbxproj`                      |
| 환경변수 이름                    | 각 앱의 `.env.example`; 실제 값은 Git 제외된 `.env`                          |
| Android release credential       | `~/.gradle/gradle.properties` (`chmod 600`, Git 밖)                          |
| Android upload keystore          | `OnMyWay_FE_V2/android/app/my-upload-key.keystore` (`*.keystore`로 Git 제외) |
| iOS native dependency            | `OnMyWay_FE_V2/ios/Podfile`, `Podfile.lock`, `Gemfile.lock`                  |

## 2. Store identity와 현재 출시 기준

| 플랫폼  | ID                   | 공개 버전 | 공개 build/code  | 다음 local candidate | 추가 identity           |
| ------- | -------------------- | --------: | ----------------: | -------------------: | ----------------------- |
| Android | `com.omw.omw_front`  |   `2.1.2` |  `versionCode 16` |     `versionCode 17` | 동일 upload key 유지    |
| iOS     | `com.omw.onmywayapp` |   `2.1.2` |        build `16` |           build `17` | Apple Team `63SCY9KWZL` |

- authoritative source: `temp/onmyway/omw_front`, ref `release/v2.1.2`, commit `74abb3607bbf21a57b26d433fc97ee51f5ed416e`.
- 다음 Store 제출은 Android `versionCode`, iOS build 모두 `17` 이상이어야 한다.
- FE `package.json`의 `version: 1.0.6`은 npm package metadata이며 Store 버전 기준이 아니다.

## 3. Android release signing

`~/.gradle/gradle.properties`에는 아래 이름을 `KEY=value` 평문 형식으로 두되, 실제 값은 문서·Git·채팅에 넣지 않는다.

```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=<다른 Mac에서 안전하게 복원한 로컬 값>
MYAPP_UPLOAD_STORE_PASSWORD=<다른 Mac에서 안전하게 복원한 로컬 값>
MYAPP_UPLOAD_KEY_PASSWORD=<다른 Mac에서 안전하게 복원한 로컬 값>
```

- `build.gradle`이 위 값을 읽어 release signing을 구성한다. debug의 `android/androiddebugkey` 설정은 개발 전용이다.
- 새 Mac에서는 **동일한** `my-upload-key.keystore`도 위 경로로 안전하게 복사해야 한다. 새 key를 임의 생성하지 않는다.
- 검증: `cd OnMyWay_FE_V2/android && ./gradlew signingReport`. release SHA-1은 Play Console의 **Upload certificate**와 비교한다.
- Google Maps production Android 제한에는 Upload SHA-1이 아니라 Play Console의 **App signing certificate SHA-1**을 사용한다.

## 4. 환경변수·Google 키 계약

- FE 현재 계약: `SERVER_BASEURL`, `SERVER_PORT`, `APP_NAME`, `ANDROID_PACKAGE_NAME`, `IOS_BUNDLE_ID`, `GOOGLE_MAPS_ANDROID_API_KEY`, `GOOGLE_MAPS_IOS_API_KEY`.
- BE 현재 계약: `PORT`, `MODE`, `GOOGLE_MAPS_SERVER_API_KEY`, `KAKAO_API_KEY`, `SWAGGER_USER`, `SWAGGER_PASSWORD`; OpenAI 리뷰 요약 변수와 endpoint는 제거됨.
- 지도 provider는 기능별로 선택한다. 주소·장소·경로상 검색은 FE의 `Accept-Language`를 사용해 `ko`/`ko-*`는 Kakao, 그 외(현재 UI는 `en`)는 Google을 사용한다. 경로·stopby는 언어가 아니라 좌표 기준이다. 출발지·목적지·기존 경유지·새 stopby 중 하나라도 한국 routing geofence 안이면 Kakao만 호출하고, 모두 해외면 Google만 호출한다. 어느 방향도 provider fallback하지 않으며 upstream 오류를 그대로 노출하지 않는다.
- Google adapter의 운영 오류는 안정된 `error` code로 정규화한다: `MAP_PROVIDER_QUOTA_EXCEEDED`(503), `MAP_PROVIDER_AUTHENTICATION_FAILED`(기본 502), `MAP_PROVIDER_TIMEOUT`(504), `MAP_PROVIDER_UNAVAILABLE`(기본 502), `MAP_PROVIDER_INVALID_RESPONSE`(기본 502). 외부 provider의 raw message·payload는 client나 로그에 전달하지 않으며, 정상 응답의 빈 route는 별도 `RouteNotFoundError`로 구분한다.
- 장소 검색 응답은 `provider`, `provider_place_id?`, `attribution`을 보존한다. place-detail은 기존 nullable 값과 함께 필드별 `KNOWN | UNKNOWN | UNSUPPORTED` 상태를 반환하며, FE 표시가 완료되기 전에도 기존 UI 계약은 유지된다.
- Kakao route 화면은 `alternatives=false` 상태에서 `RECOMMEND`, `DISTANCE`, `TIME`을 각각 호출해 최대 3개 경로를 구성한다. Kakao API의 추가 priority인 `MAIN_ROAD`, `NO_TRAFFIC_INFO`는 현재 UI에 노출하지 않는다. stopby 시간은 선택된 route priority로 다시 계산한다.
- 앱 언어는 최초 설치 후 첫 실행에서만 기기 locale로 정해(`ko*`→`ko`, 그 외→`en`) AsyncStorage `language` key에 즉시 저장한다. 이후에는 저장값이 authoritative하며 드로어에서 한국어/English를 수동 선택한다. 기기 언어 변경이나 foreground 복귀가 저장값을 덮어쓰지 않는다.
- 사용자가 언어를 바꾸면 language와 해당 언어의 기본 renderer를 저장하고 request language를 즉시 갱신한다. transient 지도 상태를 초기화한 뒤 `RootStackNavigation`만 새 `언어-renderer` key로 remount한다. `RecoilRoot`, 언어 초기화, 전역 toast는 remount하지 않는다.
- `axiosDefault`/`axiosInstance`는 요청 시작 언어를 캡처한다. 응답 시 현재 언어와 다르면 성공 응답도 의도적 cancellation로 폐기하며 사용자 로그·alert·toast를 만들지 않는다.
- `ProviderContext`가 `Accept-Language`를 language/region/units로 정규화하고 `MarketConfig`가 주소·장소·경로상 검색의 언어 policy, route/stopby의 좌표 policy, place-detail provider를 선언적으로 결정한다. `MapService`는 controller wire contract를 유지하는 facade이며 6개 application use case로 위임한다.
- Google adapter는 request context의 언어를 사용하고 Kakao 요청은 기존 한국어 동작을 유지한다. route/stopby 결과는 언어가 아니라 좌표 지역으로 선택된 단일 provider에서 받으며 provider 간 fallback은 없다. 임의의 장소명·즐겨찾기·검색 기록은 번역하지 않는다. category는 stable id/code를 사용하고 기존 backend payload shape를 유지한 채 한국어 Kakao query 또는 영어 Google query를 같은 `query` field로 보낸다. 단위는 현재 모두 metric이다.
- FE 지도 화면은 드로어 `지도 설정`에서 `국내 지도`(Naver)와 `구글맵`(react-native-maps Google provider) 중 선택한다. 최초 설치 후 첫 실행에서 앱 언어 기본값(한국어 Naver, 영어 Google)을 AsyncStorage `mapRenderer` key에 저장한다. 이후 사용자가 지정한 값은 앱 재시작과 기기 언어 변경에도 유지되며, 앱 언어를 수동 변경할 때만 새 언어 기본값으로 재설정된다. renderer 선택은 지도 타일에만 적용되며 Kakao/Google 데이터 API provider 정책과 독립이다.
- 지도 center는 임의 좌표로 초기화하지 않는다. `mapCenterState`/`lastCenterState`의 기본값은 `null`이고, 일반 지도는 실제 위치, 경로 선택 지도는 start/waypoint/end geometry, 지도 직접 선택 화면은 last center → global center → 실제 위치 순서로 초기화한다. 유효 center가 생기기 전 native map을 mount하지 않으며 위치 실패 시 번역된 재시도 UI를 표시한다.
- 지도 native key 배선: Android는 `app/build.gradle`이 FE `.env`의 Android Google/Naver 값을 manifest placeholder로 주입하고, iOS는 `Inject Map API Configuration` build phase가 iOS Google/Naver 값을 빌드 산출물 Info.plist에만 주입한다. 실제 값은 source plist·문서·Git에 저장하지 않는다.
- `react-native-maps` `1.29.0`, `@mj-studio/react-native-naver-map` `2.9.0`, GoogleMaps pod `9.4.0`, NMapsMap pod `3.23.2`를 RN 0.86 renderer 기준으로 사용한다.
- FE는 pnpm `node-linker=hoisted`(`OnMyWay_FE_V2/.npmrc`)를 사용한다. React Native gradle 스크립트가 flat `node_modules` 경로를 요구한다.
- `PlaceInputHeader`의 세 action은 icon-only SVG와 typed dictionary의 RN `Text`를 사용한다(`place.current`, `favorite.short`, `map.selectTitle`). 한글 outline glyph가 포함된 기존 SVG는 active UI에서 사용하지 않는다.
- Google 키는 환경별로 나누지 않고 용도별 3개만 사용한다: Android(`com.omw.omw_front` + debug/Play App Signing SHA-1, Android SDK만), iOS(`com.omw.onmywayapp`, iOS SDK만), server(Places API (New)·Routes API·Geocoding API만).
- 개발 중 BE는 localhost `3005`에서 실행한다(3000·3001은 다른 로컬 프로젝트가 점유). Nest의 환경변수 미지정 fallback도 `3005`이며 FE는 `SERVER_PORT`만 BE `PORT`와 맞춘다. host는 `Platform.OS`로 자동 선택된다(iOS `localhost`, Android `10.0.2.2`).
- 실기기에는 `SERVER_BASEURL=http://{개발 Mac IP}:3005` 형태를 사용한다. Production build에서는 `SERVER_BASEURL`이 필수이며 `http://` 또는 `https://`를 포함한 전체 origin을 지정한다. URL에 port가 없으면 scheme 기본값(HTTP 80, HTTPS 443)이 사용된다.
- Production BE는 Railway 등 배포 플랫폼이 주입한 `PORT`를 우선하고 `0.0.0.0`에 bind한다. 외부 HTTP/HTTPS와 TLS는 reverse proxy에서 종료하므로 Nest에 80/443을 직접 고정하지 않는다.
- server 키는 개발 중 localhost BE에서만 사용한다. Railway 배포는 개발 완료 후 진행하며 같은 키를 Railway Variables에 등록한다. application restriction은 우선 적용하지 않고, 추후 static outbound IP 도입 시 로컬 호출 정책을 재검토한다.
- `.env.example`은 이름과 placeholder만, Git에서 제외된 `.env`는 실제 값만 담는다. 키 값은 문서·채팅·Git에 기록하지 않는다.

## 5. 현재 toolchain·주요 dependency

| 영역              | 현재 기준                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Node              | 루트/FE/BE `.nvmrc`: `22.13.0`                                                                                              |
| pnpm              | 루트/FE/BE `10.15.1`                                                                                                        |
| FE                | React Native `0.86.2`, React `19.2.3`, New Architecture/Hermes                                                              |
| FE 핵심           | React Navigation `7.3.16`, NativeWind `4.2.6`, Reanimated `4.5.3`, Worklets `0.11.3`, Zustand `5.0.14` facade, Axios `1.19.0` |
| native/OTA        | Naver renderer `2.9.0`, react-native-maps `1.29.0`; TMap native SDK·AppCenter/CodePush 제거; EAS Update는 아직 미구성       |
| BE                | NestJS `11.1.28`, Express `5.2.1`, TypeScript `5.9.3`, Axios `1.19.0`                                                       |
| Android           | JDK 17, compile/target SDK 36, min SDK 24, build tools 36, NDK `27.1.12297006`, Kotlin `2.1.20`                               |
| iOS               | Swift factory AppDelegate, minimum deployment target `15.1`, CocoaPods workspace, GoogleMaps `9.4.0`, NMapsMap `3.23.2`; unsigned generic simulator compile 성공, runtime smoke 대기 |

주의: 다음 Store candidate는 Android/iOS 모두 build/code `17`이며, production 제출 전 EAS Update 또는 명시적으로 승인된 OTA 대안의 runtime/rollback gate와 실제 device smoke가 남아 있다.

### Local release 검증 상태 (2026-08-10)

- Android `:app:processReleaseMainManifest`와 `:app:bundleRelease` 성공. fresh artifact에서 package `com.omw.omw_front`, `2.1.2 (17)`, min SDK 24, target SDK 36, release cleartext 비활성, AppCenter/CodePush/TMap native SDK linkage 부재를 확인했다.
- iOS app/project/test deployment target은 `15.1`이며 app/test target 모두 직접 `-lc++` 없이 Pods linker flag를 상속한다. unsigned generic simulator compile이 성공했다.
- 위 검증은 local compile/artifact 검사다. 실제 simulator/device runtime, Store 업로드, Play App Signing 연결, production API 동작을 완료한 것으로 간주하지 않는다.
- BE는 NestJS `11.1.28`/Express `5.2.1`/TypeScript `5.9.3`로 전환되었고 Express 5 wildcard middleware, Swagger 11 nested array schema, Jest `src/*` alias를 반영했다. 기존 unit 5 suites/5 tests와 `/health` e2e 1 test가 통과했다.
- Android SDK XML tool-version 및 Gradle 10 예정 deprecation, iOS react-native-maps placeholder/script phase warning은 현재 non-blocking이며 후속 toolchain 정리 대상으로 추적한다.

## 6. 루트 명령

```bash
corepack enable
pnpm install       # BE/FE 설치 + Bundler/CocoaPods 설치
pnpm dev           # BE + Metro
pnpm dev:reset     # BE + Metro (--reset-cache)
pnpm dev:ios       # BE + Metro + iOS
pnpm dev:ios:reset # BE + Metro (--reset-cache) + iOS
pnpm dev:android   # BE + Metro + Android
pnpm dev:android:reset # BE + Metro (--reset-cache) + Android
pnpm build         # BE build
pnpm prod          # BE production build/run
```

## 7. 새 Mac 복원 체크리스트

1. Node/JDK/Xcode/Android SDK를 위 기준에 맞추고 `corepack enable` 실행.
2. FE/BE `.env.example`을 `.env`로 복사한 뒤 실제 값은 안전한 원본에서 복원.
3. 동일 upload keystore를 `OnMyWay_FE_V2/android/app/my-upload-key.keystore`에 복원.
4. `~/.gradle/gradle.properties`에 네 signing 항목을 복원하고 `chmod 600` 적용.
5. `pnpm install` 후 `./gradlew signingReport`로 release 인증서와 Play Upload certificate 일치 확인.
6. `node_modules`, `Pods`, `build`, `.gradle`, `.xcode.env.local`은 이전 Mac에서 복사하지 않고 다시 생성.
7. Store 제출 직전 앱 ID, version/build, signing, Google key restriction을 다시 확인.

과거 Git history에 있었던 signing 비밀번호는 노출된 것으로 취급한다. keystore의 암호화 백업을 확보한 뒤 비밀번호 교체 여부를 결정하고, 실제 credential은 계속 Git 밖에서 관리한다.
