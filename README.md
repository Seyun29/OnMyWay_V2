# OnMyWay_V2
### 경로상 장소 검색/추천 서비스 OnMyWay 통합 레포지토리 (v2)

This is a Mono Repo containing 3 sub-repositories.

- OnMyWay_AUTH : Repository for JWT Authentication & Reverse proxy server
- OnMyWay_BE : Backend Repository
- OnMyWay_FE : Frontend(Mobile) Repository

### Service Architecture
<img width="480" alt="image" src="https://github.com/user-attachments/assets/16607980-d5a2-4b9d-8b09-9e347c169aa4">

### Main Tech Stacks Used
- OnMyWay_AUTH : Springboot, Spring Security, Spring Cloud, Spring Data JPA, MySQL, Jenkins
- OnMyWay_BE : Nest.js, Typescript, KakaoMap API, OpenAI API, Axios, Jenkins
- OnMyWay_FE : ReactNative, Typescript, NaverMap SDK, TMap SDK, Axios, MS Codepush
- Deployment & CI/CD : AWS ECS (fargate), EC2, RDS, Cloudwatch & AutoScaling, Jenkins, Docker, Cloudflare


Please refer to README.md of each sub-repositories for more details.
