# How It Works

> 최종 갱신: 2026-08-17
> 이 문서는 실제 코드의 현재 동작(`CURRENT`)과 자연어 구조화 검색 계획(`PLANNED`)을 구분해 설명한다.
> API 키와 환경변수 값은 포함하지 않는다.

## 1. 전체 요청 흐름

```text
사용자 입력/옵션
  -> React Native 화면과 공용 API client
  -> Accept-Language: ko | en
  -> NestJS /map endpoint
  -> provider-neutral use case
  -> 언어 또는 경로 좌표 기반 provider resolver
  -> Kakao Local/Mobility 또는 Google Maps Platform
  -> 공통 PlaceResult/RouteResult
  -> Naver Map 또는 Google Map renderer
```

데이터 provider와 지도 renderer는 독립적이다. 예를 들어 Google Places 검색 결과를 Naver 지도에 표시할 수 있다.

## 2. 조건별 provider와 SDK 선택 (`CURRENT`)

| 조건/기능 | 선택 결과 | 사용 API·SDK |
| --- | --- | --- |
| 앱 언어가 `ko`/`ko-*` | 주소·장소·경로 주변 검색은 Kakao | Kakao Local API |
| 앱 언어가 그 외/미지정 | 주소·장소·경로 주변 검색은 Google | Geocoding API, Places API (New) |
| 경로 좌표 중 하나라도 한국 geofence 내부 | 자동차 경로·경유 계산은 Kakao only | Kakao Mobility Directions |
| 모든 경로 좌표가 한국 geofence 외부 | 자동차 경로·경유 계산은 Google only | Routes API `computeRoutes` |
| 지도 설정이 국내 지도 | Naver 타일 렌더링 | `@mj-studio/react-native-naver-map` |
| 지도 설정이 Google | Google 타일 렌더링 | `react-native-maps` + `PROVIDER_GOOGLE` |

provider 간 자동 fallback은 없다. 한국 경로의 Kakao 요청이 실패해도 Google route로 재시도하지 않으며 반대 방향도 동일하다.

## 3. FE ↔ BE API

| Endpoint | Method | 역할 |
| --- | --- | --- |
| `/map/get-address` | GET | 좌표를 주소로 변환 |
| `/map/keyword-search` | GET | 일반 키워드·주소·카테고리 장소 검색 |
| `/map/driving-route` | GET | 출발지·목적지·경유지 경로 계산 |
| `/map/search-on-path` | POST | 선택 경로 주변 장소 검색 |
| `/map/stopby-duration` | GET | 후보 장소 경유 시 최단 추가 경로 계산 |
| `/map/place-detail` | GET | Google 장소 상세 보강 |
| `/map/place-photo` | GET | Google Places 사진 redirect |

## 4. 언어·세션 처리 (`CURRENT`)

1. 앱이 저장된 언어를 사용하고, 최초 값이 없으면 기기 locale의 `ko` prefix 여부로 `ko`/`en`을 결정한다.
2. 공용 Axios client가 모든 지도 요청에 `Accept-Language`를 추가한다.
3. BE가 헤더를 `MapRequestContext { language, regionCode, units }`로 정규화한다.
4. 요청 도중 언어가 변경되면 FE가 이전 언어 응답을 cancellation로 폐기한다.
5. 언어 변경은 transient 지도 세션을 초기화하며 기본 renderer를 `ko -> Naver`, `en -> Google`로 맞춘다. 사용자는 이후 renderer만 다시 변경할 수 있다.

## 5. 주소와 일반 장소 검색 (`CURRENT`)

### 5.1 주소 변환

- 한국어: Kakao `coord2address`
- 영어: Google Geocoding API
- 결과는 공통 `{road_address?, address}` 형태로 정규화한다.

### 5.2 키워드·카테고리 검색

- Kakao: 주소 검색 후 Keyword Search 또는 Category Search를 호출한다.
- Google: Places API (New) Text Search `POST /v1/places:searchText`를 호출한다.
- 좌표가 있으면 해당 좌표 중심의 원형 bias와 반경을 적용한다.
- 카테고리 chip은 공통 category code를 Kakao category 또는 Google `includedType`으로 변환한다.
- provider place ID, 원본 URL과 attribution을 결과에 보존한다.

## 6. 자동차 경로와 옵션 (`CURRENT`)

입력은 출발지, 목적지, 선택 경유지, 우회 옵션과 경로 priority다.

| 옵션 | Kakao | Google |
| --- | --- | --- |
| 추천 | `RECOMMEND` | `TRAFFIC_AWARE` |
| 빠른 경로 | `TIME` | `TRAFFIC_AWARE_OPTIMAL` |
| 짧은 경로 | `DISTANCE` | 경유지가 없을 때 `SHORTER_DISTANCE` reference route |
| 유료도로 회피 | provider avoid 옵션 | `routeModifiers.avoidTolls` |
| 고속도로 회피 | provider avoid 옵션 | `routeModifiers.avoidHighways` |

각 priority 요청은 `Promise.allSettled`로 실행해 하나 이상 성공하면 성공한 경로만 반환한다. provider 자체를 교체하는 fallback은 하지 않는다.

### 경유지 추가

검색한 장소의 상세 카드에서 **경유지에 추가**를 누르면 stopby 계산이 선택한 FRONT/MIDDLE/REAR 위치에 장소를 영구 경유지로 넣는다. 좌표가 같은 장소는 중복 추가하지 않으며 경유지는 현재 UI 제약에 따라 최대 2개다.

추가가 완료되면 기존 선택 경로와 임시 stopby 경로를 폐기하고 경로 선택 화면으로 돌아간다. 새 경로를 선택하면 장소 검색 화면이 새로 mount되어 이전 검색어·결과가 초기화되므로 다른 검색어를 바로 입력할 수 있다.

### 외부 지도 길안내

장소 후보를 선택한 상태에서 경로 좌표 중 하나라도 한국 routing geofence에 포함되면 Naver Map 길안내 버튼만 표시하고 Google Maps 버튼은 숨긴다. 모든 경로 좌표가 geofence 외부인 해외 경로에서는 Google Maps 버튼만 표시한다. 이 구분은 한국 내 Google Maps 자동차 길찾기 제한으로 인해 경로를 찾지 못하는 흐름을 방지하며, FE는 BE의 route provider geofence와 같은 좌표 정책을 사용한다. 활성화된 지도 링크는 아래 경유 순서를 사용한다.

```text
출발지 -> 기존 경유지와 선택 장소를 stopby strategy 순서로 결합 -> 목적지
```

- 국내 경로의 Naver Map: `nmap://route/car` 앱 URL scheme을 사용한다. 앱이 없으면 해당 store 이동을 안내한다.
- 해외 경로의 Google Maps: `https://www.google.com/maps/dir/?api=1` universal URL을 사용한다. `origin`, `destination`, 순서가 보존되는 `waypoints`, `travelmode=driving`, `dir_action=navigate`를 전달한다.
- 선택 경로가 유료도로 회피 옵션이면 Google URL에 `avoid=tolls`를 추가한다.
- Google universal URL에는 API key가 필요 없고, Google Maps 앱을 열 수 없는 환경에서는 browser로 fallback한다.
- 현재 앱의 기존 경유지 2개와 선택 장소 1개를 합친 최대 3개는 mobile browser의 waypoint 제한 안에 있다.

사용자가 **경유지에 추가**를 누르기 전 외부 길안내에서는 선택 장소를 임시 경유지로 포함하고, 추가한 뒤에는 경로를 다시 계산해 영구 경유지로 취급한다.

## 7. 경로 주변 장소 검색 (`CURRENT`)

FE는 선택 경로의 `[[lng, lat], ...]`, 전체 거리, 검색어, 반경과 선택 category를 `/map/search-on-path`에 전달한다. 현재 FE의 유효 검색 반경 payload는 최대 20km다.

검색 전에는 선택 경로를 slider의 `radiusKm`만큼 지리적으로 buffer하고, 생성된 Polygon/MultiPolygon 내부를 약 8% alpha의 연분홍색으로 채운다. 모든 경계 ring은 별도의 얇은 반투명 분홍 polyline으로 표시한다. Naver/Google renderer 모두 동일한 buffer geometry를 사용하며 검은 outline과 gradient는 적용하지 않는다. 검색 결과가 표시되면 marker와 경로의 시각적 우선순위를 위해 fill과 boundary를 모두 숨기며, 사용자가 다시 검색 편집 상태로 돌아오면 다시 표시한다.

### Provider 선택 기준

경로 주변 장소 검색 provider는 **경로 위치나 지도 renderer가 아니라 요청 언어만으로 선택**한다. FE의 공용 Axios client가 현재 앱 언어를 `Accept-Language` 헤더에 넣고, BE는 첫 번째 언어 token을 소문자로 정규화한 뒤 `ROUTE_PLACE_SEARCH` 정책을 적용한다.

| `Accept-Language` 조건 | 장소 검색 provider |
| --- | --- |
| `ko`, `ko-KR`처럼 첫 token이 `ko`로 시작 | Kakao Local API |
| `en`, 그 밖의 언어, 헤더 누락/빈 값 | Google Places API |

현재 FE 앱 언어는 `ko` 또는 `en`이므로 일반적인 앱 요청은 `ko -> Kakao`, `en -> Google`로 동작한다. 따라서 한국 경로라도 앱이 영어면 Google을 사용하고, 해외 경로라도 앱이 한국어면 Kakao를 사용한다. Naver/Google 지도 renderer 설정과 자동차 경로용 한국 geofence는 이 선택에 관여하지 않는다. Google이 선택된 뒤 경로에 한국 좌표가 있으면 Places 요청에 `regionCode: KR`을 검색 힌트로 추가하지만, 이는 provider 전환이나 결과의 강제 지역 필터가 아니다.

Kakao와 Google 사이의 자동 fallback은 없다. 선택된 provider의 인증·quota·timeout 또는 검색 실패가 발생해도 다른 provider로 재시도하지 않는다. 요청 도중 앱 언어가 바뀌면 FE는 이전 언어 응답을 폐기하며, 현재 `searchOnPath` wrapper는 이 cancellation과 일반 검색 오류를 모두 `null`로 반환한다.

### 공통 알고리즘

```text
경로 polyline
  -> 반경과 경로 길이를 이용해 vertex 샘플링
  -> 각 vertex 주변 장소를 병렬 검색
  -> 반경 밖 결과 제거(해당 provider 구현)
  -> provider place ID 중심 중복 제거
  -> 반복 발견도/우선순위 정렬
  -> 경로 길이별 최대 개수 적용
```

### Kakao 방식

1. 평균 vertex 간 거리와 검색 반경으로 경로 좌표를 샘플링한다.
2. 선택된 각 vertex에서 Kakao Keyword/Category Search를 호출한다.
3. 결과를 합치고 중복을 제거한다.
4. 일부 요청 실패는 허용하지만 성공 vertex가 너무 적으면 전체 검색을 실패 처리한다.

### Google 방식

1. Kakao와 같은 샘플링 helper를 사용하고 중복 vertex를 제거한다.
2. vertex가 10개를 넘으면 경로 전체에서 균일하게 최대 10개만 선택한다.
3. 각 vertex마다 Places Text Search를 `locationBias.circle`과 함께 병렬 호출한다.
4. `locationBias`는 강제 경계가 아니므로 Haversine 거리로 `radius * 1.25` 밖의 결과를 제거한다.
5. Google place ID로 중복 제거하고, 여러 vertex에서 반복 발견된 장소의 priority를 높인다.
6. 목표 결과 수가 부족하고 `nextPageToken`이 있으면 최대 3페이지까지 가져온다.

Google 호출 수는 vertex 수를 `V`라 할 때 최초 `V`, 페이지네이션 포함 최대 `3V`다. `V <= 10`이므로 사용자 검색 한 번당 최대 30회의 Text Search 요청이 가능하다.

### 결과 수 상한

| 전체 경로 거리 | 최종 결과 상한 |
| --- | ---: |
| 0~30km | 30 |
| 30km 초과~70km | 경로 km 수, 최대 70 |
| 70km 초과~150km | 100 |
| 150km 초과~200km | 120 |
| 200km 초과 | 150 |

상한은 보장 개수가 아니다. provider 결과 부족, category 제한, 반경 후필터, 중복 제거와 부분 실패 때문에 더 적게 반환될 수 있다.

## 8. 장소 상세 (`CURRENT`)

- Google 검색 결과는 search 응답에 평점, 평가 수, 현재 영업 여부와 사진 참조를 포함한다.
- 사용자가 장소를 선택할 때만 `/map/place-detail`로 영업시간·주차·평점·평가 수를 추가 보강한다.
- 목록 전체에 Place Details를 호출하지 않아 지연과 비용을 제한한다.
- Google 사진은 사용자가 실제로 필요로 할 때 별도 photo endpoint를 호출한다.
- Kakao 상세는 아직 `place_url`과 legacy 웹 보강 경로에 의존하며 핵심 기능에서 제거하는 작업이 backlog다.
- 미제공 값은 `KNOWN | UNKNOWN | UNSUPPORTED` 상태로 구분하고, 확인되지 않은 값을 `false`로 표시하지 않는다.

## 9. 자연어 구조화 검색 (`PLANNED`)

현재 자유 텍스트는 provider에 raw query로 전달된다. 계획 기능은 원문을 먼저 provider-neutral `SearchIntent`로 변환한다.

```text
"새벽까지 영업하는 리뷰 좋은 맛집"
  -> coreQuery: 음식점
  -> includedType: restaurant
  -> closesAfter: 02:00
  -> minRating: 4.2
  -> minReviewCount: 100
  -> ranking: QUALITY
```

`02:00`, `4.2`, `100`은 제품 정책값이며 `[새벽 2시+] [평점 4.2+] [리뷰 100+]`처럼 수정 가능한 filter chip으로 사용자에게 보여준다.

### 조건별 처리 계획

| 자연어 조건 | Google 요청 | 서버 후처리 | Kakao 공식 API |
| --- | --- | --- | --- |
| 음식점/카페 | `includedType` + `strictTypeFiltering` | 필요 시 공통 category 검증 | category search 가능 |
| 지금 영업 중 | `openNow` | UNKNOWN 보존 | 검증 불가 |
| 평점 N 이상 | 0.5 단위 `minRating`으로 넓게 요청 | 정확한 threshold 적용 | 검증 불가 |
| 리뷰 N개 이상 | 직접 필터 없음 | `userRatingCount` 필터 | 검증 불가 |
| 새벽 N시 이후 마감 | 직접 필터 없음 | opening periods와 현지 날짜·시간대로 검증 | 검증 불가 |
| 주차 가능 | 직접 검색 필터 없음 | 응답/상위 후보 Place Details 보강 후 검증 | 공식 Local API로 검증 불가 |
| 경로에서 가까운 | route context로 후보 검색 | 우회 시간·경로 거리로 재정렬 | 좌표 검색 가능, 상세 조건은 제한 |

“새벽까지”는 자정을 넘는 영업 period를 실제 datetime으로 변환해 비교한다. “지금 영업”과 “후보 장소 예상 도착 시 영업”은 별도 조건으로 취급한다.

“리뷰 좋은”은 평점만 정렬하지 않는다. 최소 평가 수를 적용하거나 Bayesian weighted rating을 사용해 평가 2개의 5.0점이 평가 1,000개의 4.5점보다 무조건 앞서는 문제를 방지한다. 최종 추천 점수는 품질 점수에서 우회 시간과 경로 이탈 거리를 감점하는 방식으로 구성한다.

```text
finalScore = qualityScore - detourMinutes * weight - distanceFromRoute * weight
```

### Parser 전략

1. MVP는 한국어/영어 사전과 규칙 기반 parser를 사용한다. 추가 API나 LLM 비용이 없고 결과를 설명할 수 있다.
2. 복합·모호한 문장만 추후 LLM fallback으로 구조화한다.
3. LLM은 JSON schema의 `SearchIntent`만 생성하며 영업 여부·평점 같은 장소 사실을 생성하지 않는다.
4. 모든 조건은 provider 응답으로 검증하고 미지원 조건은 `UNKNOWN`/`UNSUPPORTED`로 노출한다.

Kakao Local API에는 평점·평가 수·영업시간이 없으므로 자연어 rich condition을 정식 지원하려면 한국어 입력도 Google Places를 사용하거나, Kakao에서는 지원 가능한 조건만 적용했다고 명시해야 한다. Kakao 후보를 Google 장소에 재매칭하는 방식은 오매칭·중복 호출·지연 때문에 기본안으로 사용하지 않는다.

## 10. 비용과 지연 특성

- 규칙 기반 `SearchIntent` parsing은 외부 호출이 없어 추가 API 비용이 없다.
- 현재 Google Text Search FieldMask의 `rating`, `userRatingCount`, `currentOpeningHours` 때문에 Search Enterprise SKU가 적용된다.
- 경로 주변 Google 검색은 한 번의 사용자 동작이 최대 30개 billable request로 fan-out될 수 있다.
- 자동 2·3페이지, 목록 전체 detail, 사진 선조회는 비용과 p95 지연을 크게 늘리므로 제품 budget gate와 lazy load가 필요하다.
- `parkingOptions`는 검색 입력 필터가 아니며, 요청하면 더 높은 데이터 SKU가 발생할 수 있으므로 상위 후보만 보강한다.
- 자세한 단가와 월간 예산 모델은 [Feature Insights](FEATURE_INSIGHTS.md)를 기준으로 한다.

## 11. 오류와 데이터 신뢰성

- quota, 인증, timeout, invalid response와 unavailable 오류는 BE에서 안정된 public error code로 정규화한다.
- 외부 provider의 raw 오류 payload와 API 키는 client나 일반 로그에 전달하지 않는다.
- provider 간 fallback을 하지 않아 결과 출처와 동작을 예측 가능하게 유지한다.
- 동일 검색 결과가 항상 같다고 가정하지 않으며 provider attribution과 원문 링크를 보존한다.
- 자연어 검색에서도 “조건 불충족”과 “데이터 없음”을 구분한다.

## 12. 관련 문서

- [Search Radius Indicator Style Guide](SEARCH_RADIUS_INDICATOR_STYLE_GUIDE.md): Naver/Google 반경 overlay의 스타일·geometry·검증 기준
- [Architecture](ARCHITECTURE.md): 코드 구조와 provider port
- [Migration Plan](MIGRATION_PLAN.md): 구현 순서와 완료 조건
- [Feature Insights](FEATURE_INSIGHTS.md): 제품 결정, API 제약, 가격·정책 근거
- [Project Configuration](PROJECT_CONFIGURATION.md): 환경변수와 빌드 설정
- [Progress Log](PROGRESS_LOG.md): 변경 이력과 검증 기록
