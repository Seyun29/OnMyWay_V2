# OnMyWay_AUTH
## Repository for OnMyWay Auth Server

### Tech Stacks Used
- Springboot, SpringCloud, SpringSecurity, MySQL (H2 DB on dev env.), Docker, Jenkins

<img width="413" alt="image" src="https://github.com/user-attachments/assets/6d27154c-c449-4b30-b1fe-aa531588165e">

### Dependencies
- JDK 17
- Spring Boot 3.2.8
- Spring Security 6.2.1
- Lombok
- Spring Data JPA - MySQL8
- Gradle - Groovy
- IntelliJ Ultimate
- JWT 0.12.3

### Implementation
- Located in front of the WAS server (OnMyWay_BE), This server implements reverse-proxy functionality by SpringCloud
- It checks if the request has valid authorization, as well as performing authentication with Database (AWS RDS, MySQL)
  - Requests are appropriately passed through or be rejected according to whether the request is authorized or not
- JWT Authentication strategy is used (accessToken / refreshToken)
  - Implemented with Spring Security framework
- Performs traffic caching as well (Spring Cloud)

### Deployments
- Deployed to AWS ECS, containerized by docker
  - The number of tasks is 1 ~ 3 (adjusted by Cloudwatch-AutoScaling)
- Jenkins pipeline is used for CI/CD
  - Automatically uploades to AWS ECR, updating the ECS service
 
<img width="888" alt="image" src="https://github.com/user-attachments/assets/a62b01de-063d-4d44-bf48-11a13f1550a5">
