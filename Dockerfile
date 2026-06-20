# Stage 1: Build Angular
FROM node:20-alpine AS angular-builder

WORKDIR /app

COPY todo-ui/package*.json ./todo-ui/

WORKDIR /app/todo-ui

RUN npm install

COPY todo-ui .

RUN npm run build

# Stage 2: Build Spring Boot
FROM eclipse-temurin:17-jdk-jammy AS java-builder

WORKDIR /app

COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle

# Add execution permission to the gradlew script
RUN chmod +x ./gradlew

RUN ./gradlew dependencies

COPY src ./src
COPY --from=angular-builder /app/todo-ui/dist/todo-ui/browser/ ./src/main/resources/static/

RUN ./gradlew bootJar -x copyAngularAssets

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

COPY --from=java-builder /app/build/libs/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]