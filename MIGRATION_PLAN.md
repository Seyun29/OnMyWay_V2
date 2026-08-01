# OnMyWay V3 마이그레이션 & 개발환경 셋업 가이드

> 작성일: 2026-08-01
> 대상: AUTH 기능 legacy 이관, 의존성 제거, 버전 업그레이드, CI/CD 제거, .env 재구성, macOS RN 개발환경 셋업

---

## 0. 목표 요약

| 항목 | 현재 (V2) | 목표 (V3) |
|---|---|---|
| AUTH 서버 | Spring Boot 게이트웨이 + JWT 인증 | `legacy/`로 이관, 서비스에서 제외 |
| FE → 서버 호출 | FE → AUTH(8080) → BE 프록시 | FE → BE 직접 호출 |
| CI/CD | Jenkinsfile (ECR/ECS 배포) | 제거 (추후 재구축) |
| 환경변수 | 유실됨 / 일부 하드코딩 | `.env.example` 기반 재구성 |
| FE | RN 0.73.6, React 18.2 | RN 0.86.x, React 19 (New Architecture) |
| BE | NestJS 10, Node 18 | NestJS 11, Node 22 LTS |

---

## 1단계: AUTH → legacy 이관

### 1-1. 디렉터리 이동

```bash
mkdir -p legacy
git mv OnMyWay_AUTH_V2 legacy/OnMyWay_AUTH_V2
```

루트 `README.md`의 아키텍처 설명에서 AUTH를 legacy로 표기 변경.

### 1-2. FE에서 제거할 AUTH 의존 코드

AUTH 서버에 의존하는 코드는 전부 FE에 있다. (즐겨찾기/최근검색은 AsyncStorage 로컬 저장이라 서버 의존 없음 → 그대로 유지)

| 파일 | 조치 |
|---|---|
| `src/api/auth.ts` | 삭제 (login / register / refresh / logout 전부 AUTH 서버 호출) |
| `src/api/axios.ts` | `axiosInstance`의 accessToken request 인터셉터 제거. `axiosDefault` 하나로 통합해도 됨 |
| `src/atoms/userState.ts` | 삭제 (로그인 상태 atom) |
| `src/components/drawer/drawerView.tsx` | 로그인/회원가입/로그아웃 UI 및 `userState` 사용부 제거 |
| `src/screens/HomeScreen/index.tsx` | `import {login, logout, register} from '../../api/auth'` 제거 |
| AsyncStorage | `accessToken`, `refreshToken`, `username` 키 사용부 제거 |

### 1-3. BE에서 제거할 것

BE는 AUTH 서버와 코드 의존이 없다. 정리만 하면 됨:

- `package.json`에서 미사용 의존성 제거: `bcrypt`, `@types/bcrypt` (소스에서 사용처 없음 확인됨)
- `@nestjs/mongoose`, `mongoose`도 주석 처리된 상태로 미사용 → 로깅용 MongoDB 계획이 없으면 제거

### 1-4. API 엔드포인트 변경

기존엔 AUTH가 `/map/**`을 BE로 프록시했다. AUTH 제거 후 FE가 BE를 직접 바라보게 변경:

- `OnMyWay_FE_V2/src/config/consts/api.ts`
  - 하드코딩된 ALB URL(`http://alb-omw-...:8080/`) 삭제
  - 주석 처리돼 있는 `export const BASE_URL = SERVER_BASEURL;` (@env) 방식으로 복원
- BE 라우트가 이미 `/map/*` prefix를 갖고 있으므로 경로 변경은 불필요

---

## 2단계: CI/CD 제거

```bash
git rm OnMyWay_BE_V2/Jenkinsfile
git rm legacy/OnMyWay_AUTH_V2/Jenkinsfile   # legacy 이관 후
```

- `Dockerfile`은 CI/CD와 무관하게 로컬 컨테이너 실행에 쓸 수 있으니 유지 권장 (불필요하면 함께 삭제)
- `main-pm2.json`(BE)은 pm2 프로덕션 실행용 → 배포 재구축 전까지는 불필요하지만 삭제 안 해도 무방

> 참고: 기존 Jenkinsfile/gradle.properties/appcenter-config 등에 시크릿이 커밋돼 있었다.
> 노출된 RDS 비밀번호, JWT 시크릿, keystore 비밀번호는 폐기(로테이션) 대상이다.

---

## 3단계: 환경변수 구조 재설계

`.env`는 유실됐으므로 `.env.example`을 기준으로 새로 발급/작성한다.
(각 프로젝트에 `.env.example`이 생성돼 있음 → `cp .env.example .env` 후 값 채우기)

### 3-1. BE (`OnMyWay_BE_V2/.env`)

| 변수 | 용도 | 발급처 |
|---|---|---|
| `PORT` | 서버 포트 (기본 3000) | - |
| `MODE` | `dev` 여부 (Swagger 노출 등 분기) | - |
| `KAKAO_API_KEY` | 카카오 로컬 API. 형식: `KakaoAK {REST_API_KEY}` | [Kakao Developers](https://developers.kakao.com) → 앱 생성 → REST API 키 |
| `OPENAI_HEADER_AUTH` | OpenAI 인증 헤더. 형식: `Bearer sk-...` | [OpenAI Platform](https://platform.openai.com) → API Key 발급 |
| `SWAGGER_USER` / `SWAGGER_PASSWORD` | `/docs` basic auth | 직접 지정 |

버린 것: `MONGO_DB_URI` (주석 처리된 미사용 기능), AUTH 관련 DB/JWT 설정 전부.

### 3-2. FE (`OnMyWay_FE_V2/.env`)

| 변수 | 용도 | 값 예시 |
|---|---|---|
| `SERVER_BASEURL` | BE 서버 주소 | 로컬: `http://localhost:3000` (Android 에뮬레이터는 `http://10.0.2.2:3000`) |
| `APP_NAME` | 앱 이름 | `OnMyWay` |
| `ANDROID_PACKAGE_NAME` | 네이버지도 딥링크용 패키지명 | `com.omw_front` |
| `IOS_BUNDLE_ID` | 네이버지도 딥링크용 번들 ID | `org.reactjs.native.example.omw-front` |

버린 것: AUTH 게이트웨이 주소, CodePush 관련 키 (4단계에서 CodePush 자체 제거).

- 네이버 지도 Client ID는 `.env`가 아니라 네이티브 설정(AndroidManifest / Info.plist)에 들어간다.
  기존 키(`vrzp6pdaaj`)가 레포에 노출돼 있으므로 [NCP 콘솔](https://console.ncloud.com)에서 재발급 권장.

---

## 4단계: 버전 업그레이드

### 4-1. BE: NestJS 10 → 11, Node 18 → 22

작업량이 적고 리스크가 낮으므로 먼저 진행 권장.

```bash
cd OnMyWay_BE_V2
nvm install 22 && nvm use 22    # .nvmrc도 22로 수정
pnpm dlx @nestjs/cli@latest      # 또는 아래 수동 업그레이드
```

- `@nestjs/*` 패키지 전부 `^11`로 상향, `typescript` 5.x 최신으로
- NestJS 11은 Express v5가 기본. 와일드카드 라우팅 문법 변경(`*` → `*splat`)이 가장 흔한 브레이킹 체인지 → `forRoutes('*')` 부분 확인 필요
- 마이그레이션 가이드: https://docs.nestjs.com/migration-guide
- (참고: NestJS 12는 2026 Q3 목표로 아직 미출시. 11이 현재 안정 버전)

### 4-2. FE: RN 0.73.6 → 0.86.x

13개 마이너 버전 점프 + New Architecture 전환이라 **in-place 업그레이드보다 새 템플릿 생성 후 `src/` 이식을 권장**한다. 이유:

- 0.76부터 New Architecture 기본, 0.84부터 Hermes V1 기본 → `android/`, `ios/` 네이티브 템플릿이 대폭 변경됨
- 어차피 CodePush 제거, 지도 라이브러리 교체 등 네이티브 설정을 다시 잡아야 함

#### 라이브러리 호환성 판단

| 기존 | 판단 | 대체 |
|---|---|---|
| `react-native-nmap` (zerocho fork) | ❌ 구 아키텍처 전용, 미유지보수 | `@mj-studio/react-native-naver-map` (New Arch 지원, 활발히 유지보수) |
| `react-native-code-push`, `appcenter*` | ❌ **MS AppCenter 서비스 종료(2025.3)** | 제거. OTA가 필요해지면 Expo Updates 등 검토 |
| `nativewind` 2.x | ⚠️ RN 0.86 미지원 | nativewind 4.x로 업그레이드 (tailwindcss 3.4+) |
| `recoil` | ⚠️ 유지보수 중단됨 | 당장은 동작하나 `zustand` 또는 `jotai`로 교체 권장 |
| `react-navigation` 6.x | ⚠️ | 7.x로 업그레이드 |
| `react-native-splash-screen` | ⚠️ 미유지보수 | `react-native-bootsplash` 권장 |
| reanimated, gesture-handler, screens, safe-area-context, svg, webview 등 | ✅ | 최신 버전으로 상향만 하면 됨 |
| `pnpm-lock.yaml` + `yarn.lock` 혼재 | 🧹 | 하나만 선택 (RN 생태계 호환성은 yarn/npm이 무난, pnpm 쓰려면 `node-linker=hoisted` 설정) |

#### 진행 절차

```bash
# 1. 새 프로젝트 생성 (RN 0.86, 커뮤니티 CLI)
npx @react-native-community/cli init OnMyWayFE --version 0.86.0

# 2. 기존 코드 이식
#    - src/ 디렉터리 복사
#    - App.tsx, index.js 병합 (CodePush wrapper 제거)
#    - babel.config.js: react-native-dotenv, nativewind 4 방식으로 재설정
#    - tailwind.config.js, tsconfig.json paths 이식
#    - assets (svg, 폰트) + react-native-svg-transformer 설정 이식

# 3. 네이티브 설정 재적용
#    - Android: AndroidManifest에 네이버지도 CLIENT_ID meta-data, 위치 권한
#    - iOS: Info.plist에 NMFClientId, 위치 권한 문구
#    - 앱 아이콘 / 스플래시

# 4. AUTH 의존 제거 상태로 이식 (1단계 목록 참조)
```

---

## 5단계: macOS RN 개발환경 셋업 (이 맥북 최초 세팅)

### 5-1. 공통 도구

```bash
# Homebrew (없다면)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node (nvm 권장 - BE/FE 버전 분리 관리)
brew install nvm
nvm install 22        # Node 22 LTS
corepack enable       # pnpm 활성화

# Watchman (RN 파일 감시)
brew install watchman
```

### 5-2. iOS

```bash
# 1. App Store에서 Xcode 설치 (16.x 이상, 용량 큼 - 먼저 받아두기)
# 2. Command Line Tools 및 시뮬레이터 설정
xcode-select --install
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
# Xcode 실행 → Settings → Platforms 에서 iOS 시뮬레이터 런타임 다운로드

# 3. CocoaPods (RN 0.86에서도 사용)
brew install cocoapods
```

### 5-3. Android

```bash
# 1. JDK 17 (Azul Zulu 권장)
brew install --cask zulu@17
# ~/.zshrc 에 추가:
#   export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# 2. Android Studio 설치
brew install --cask android-studio
# Android Studio 실행 → SDK Manager 에서:
#   - Android SDK Platform (최신 + RN 0.86 targetSdk 버전)
#   - Android SDK Build-Tools, Platform-Tools, Emulator, CMake/NDK

# 3. ~/.zshrc 에 추가:
#   export ANDROID_HOME=$HOME/Library/Android/sdk
#   export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools

# 4. AVD Manager에서 에뮬레이터 하나 생성 (예: Pixel 8, 최신 API)
```

### 5-4. 실행 순서 (일상 개발 루프)

```bash
# 터미널 1: BE
cd OnMyWay_BE_V2
cp .env.example .env   # 최초 1회, 값 채우기
pnpm install
pnpm start:dev         # http://localhost:3000

# 터미널 2: FE Metro 번들러
cd OnMyWay_FE_V2
cp .env.example .env   # 최초 1회
npm install            # (또는 선택한 패키지 매니저)
npm start

# 터미널 3: 앱 빌드/실행
npm run ios            # iOS 시뮬레이터 (최초엔 cd ios && pod install 필요)
npm run android        # Android 에뮬레이터
```

> Android 에뮬레이터에서 로컬 BE 접근 시 `SERVER_BASEURL=http://10.0.2.2:3000`
> iOS 시뮬레이터는 `http://localhost:3000` 그대로 사용 가능.
> `.env` 변경 후에는 Metro 캐시 리셋 필요: `npm start -- --reset-cache`

---

## 6. TODO (진행 상황 & 로드맵)

> 최종 갱신: 2026-08-01

### ✅ 완료 (Phase 0: 구조 정리 & 로컬 환경)

- [x] AUTH → `legacy/` 이동, 루트 README 갱신
- [x] FE의 AUTH 의존 코드 제거 (auth/favorites/history API, userState, 로그인 UI, 토큰 인터셉터)
- [x] Jenkinsfile 제거 (BE, AUTH)
- [x] BE: bcrypt / mongoose 미사용 의존성 제거 → 빌드 검증 완료
- [x] `.env.example` 작성 (BE, FE) + 로컬 `.env` 생성
- [x] macOS RN 개발환경 셋업 완료
  - watchman, Android cmdline-tools, SDK 34, NDK 25, CMake, AVD(omw_pixel/Pixel 7/API 34)
  - `~/.zshrc`에 ANDROID_HOME 설정, `android/local.properties` 생성
- [x] Android 디버그 빌드 성공 (`-PreactNativeArchitectures=arm64-v8a` 필수, Apple Silicon)
- [x] E2E 스모크 테스트: 에뮬레이터 앱 → BE(3001) 요청 도달 확인
  - Kakao API는 401 (플레이스홀더 키) — 실제 키만 넣으면 동작

### 🔜 즉시 (Phase 1: 로컬에서 완전 동작)

- [ ] Kakao REST API 키 발급 → `OnMyWay_BE_V2/.env`에 입력 → 검색 플로우 완전 동작 확인
- [ ] OpenAI API 키 발급 → AI 리뷰 요약 동작 확인
- [ ] 네이버 지도 렌더링 확인 (기존 Client ID 유효성) — 만료 시 NCP에서 재발급 후 AndroidManifest/Info.plist 갱신
- [ ] 노출된 시크릿 로테이션: RDS 비번, JWT 시크릿(legacy), 네이버 Client ID, keystore 비번, AppCenter secret
- [ ] Phase 0 변경사항 커밋

### 🔧 Phase 2: 기존 버전 리팩토링 (업그레이드 전 코드 정리)

업그레이드 전에 현재 버전에서 코드 품질을 먼저 정리해서 이식 비용을 줄인다.

- [ ] FE 리팩토링
  - [ ] `@ts-nocheck` 제거 (placeQuery.ts, getRoutes.ts 등) + 남은 타입 에러 4건 해결
  - [ ] FIXME/TODO 주석 정리 (에러 처리 분기, status code 처리 등)
  - [ ] 죽은 코드 제거: CodePush import, DeviceInfo 버전 체크 주석 블록, TestScreen, legacy 코드
  - [ ] api 레이어 정리: axiosDefault/axiosInstance 이원화 통합, 공통 에러 처리
  - [ ] 컴포넌트 오타/네이밍 정리 (mainBotttomSheet → mainBottomSheet 등)
- [ ] BE 리팩토링
  - [ ] `src/legacy/` (kakao 모듈, searchOnPath) 제거 또는 정리
  - [ ] 빈 config 파일 정리 (development.json / production.json)
  - [ ] 테스트 보강 (map.service 핵심 로직 위주)
  - [ ] README 재작성 (TBU 제거, 실제 셋업/실행 문서화)
- [ ] 잠금파일 정리: FE는 yarn.lock만 유지(pnpm-lock 삭제), BE는 pnpm 유지

### 🚀 Phase 3: 버전 업그레이드

- [ ] BE: NestJS 10 → 11, Node 18 → 22 (`.nvmrc` 갱신, Express v5 와일드카드 라우팅 확인)
- [ ] FE: RN 0.73.6 → 0.86.x — 새 템플릿 생성 후 src 이식 (4단계 가이드 참조)
  - [ ] CodePush/AppCenter 의존성 완전 제거 (서비스 종료됨)
  - [ ] 지도 교체: react-native-nmap → @mj-studio/react-native-naver-map
  - [ ] nativewind 2 → 4, react-navigation 6 → 7, recoil → zustand/jotai
  - [ ] iOS: Xcode 설치(App Store, 수동) → pod install → 시뮬레이터 빌드
- [ ] 업그레이드 후 iOS/Android 핵심 플로우 수동 테스트 (경로 검색, 장소 검색, 지도, 리뷰 요약)

### ✨ Phase 4: 신규 기능 (V3)

- [ ] 자연어 검색: "강남 가는 길에 조용한 카페" 같은 쿼리 → LLM으로 의도 파싱(카테고리/키워드/경유 전략 추출) → 기존 keyword-search + search-on-path 조합
  - BE에 이미 OpenAI 연동(`openAiGetReviewSummary`)이 있어 같은 패턴으로 확장 가능
- [ ] (후보) 검색 결과 개인화/랭킹 개선
- [ ] (후보) 즐겨찾기 클라우드 동기화 — 인증 재설계 필요 시 AUTH 재구축이 아닌 경량 방식 검토
- [ ] 배포/CI-CD 재구축 (필요 시점에 결정)

---

## 7. 로컬 개발 실행 치트시트

```bash
# 터미널 1: BE (포트 3001 — 3000은 다른 프로젝트가 점유 중)
cd OnMyWay_BE_V2 && npx pnpm@9 start:dev

# 터미널 2: 에뮬레이터
$ANDROID_HOME/emulator/emulator -avd omw_pixel

# 터미널 3: Metro
cd OnMyWay_FE_V2 && npx react-native start   # .env 변경 시 --reset-cache

# 터미널 4: 빌드/설치 (Apple Silicon은 arm64 플래그 필수)
cd OnMyWay_FE_V2/android
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
./gradlew assembleDebug -PreactNativeArchitectures=arm64-v8a
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb reverse tcp:8081 tcp:8081
adb shell am start -n com.omw.omw_front/.MainActivity
```

- FE `.env`: `SERVER_BASEURL=http://10.0.2.2:3001` (에뮬레이터 → 호스트 맥)
- BE Swagger: http://localhost:3001/docs (admin / omw-local-dev)
