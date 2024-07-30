#simply executes the jar file
FROM openjdk:17-alpine

LABEL authors="Seyun Jang"

WORKDIR /app

ARG JAR_FILE=build/libs/*.jar

COPY ${JAR_FILE} onmyway_auth.jar

ENTRYPOINT ["java","-jar","-Dspring.profiles.active=prod","onmyway_auth.jar"]