# OnMyWay_V2
### 경로상 장소 검색/추천 서비스 OnMyWay 통합 레포지토리 (v2)

This is a Mono Repo containing 2 active sub-repositories.

- OnMyWay_BE : Backend Repository
- OnMyWay_FE : Frontend(Mobile) Repository
- legacy/OnMyWay_AUTH_V2 : (Legacy, 미사용) JWT 인증 & 리버스 프록시 서버 — V3부터 서비스에서 제외됨

### Main Tech Stacks Used
- OnMyWay_BE : Nest.js, Typescript, KakaoMap API, OpenAI API, Axios
- OnMyWay_FE : ReactNative, Typescript, NaverMap SDK, Axios

> CI/CD 파이프라인(Jenkins, ECR/ECS 배포)은 V3 개편으로 제거됨. 재구축 계획은 MIGRATION_PLAN.md 참고.

Please refer to README.md of each sub-repositories for more details.

![image](https://github.com/user-attachments/assets/06806b05-ce76-46f7-915b-67d33f3513fc)
<img width="420" alt="image" src="https://github.com/user-attachments/assets/2b7c498a-cfee-48f0-8220-6850a2a2c022">

### Service Architecture (V2)
<img width="480" alt="image" src="https://github.com/user-attachments/assets/16607980-d5a2-4b9d-8b09-9e347c169aa4">
