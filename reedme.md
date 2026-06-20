
# Task Planner - Kubernetes and DevOps Assignment (NAGP 2026)

This repository contains the deployment configurations, Docker containerization strategies, and source code for a highly available, multi-tier **Todo Task Planner Application** deployed on Google Kubernetes Engine (GKE).

## 🚀 Architecture Overview
The system is built using a modern multi-tier microservices architecture, adhering to cloud-native best practices:
* **Frontend Tier:** Angular client bundled directly into the backend web assets.
* **Backend Tier:** Java Spring Boot REST API (Todo Application running on port `8081`).
* **Database Tier:** MySQL managed via a `StatefulSet` with persistent volume allocation.
* **Routing & Ingress:** Managed via the `ingress-nginx` controller, exposing endpoints securely.
* **Configuration Management:** Decoupled application properties and sensitive credentials using Kubernetes `ConfigMaps` and `Secrets`.

---

## 📂 Project Assets

* **GitHub Repository:** [sidhant97/todo-app-docker-kubernetes](https://github.com/sidhant97/todo-app-docker-kubernetes.git)
* **Docker Hub Image:** [sidhant97/todoapplication](https://hub.docker.com/repository/docker/sidhant97/todoapplication)
* **Source Code (Backup):** [Google Drive Link]
* **Demo Recording:** [Google Drive Link]

> ⚠️ **Note on Live Endpoint:** As instructed, the GKE cluster was systematically torn down immediately after recording the demo to optimize cloud costs. The structural format used for routing traffic via Ingress during the evaluation was: `http://<EXTERNAL-IP>.nip.io/api/todos`

---

## 🐳 Containerization (Dockerfile)

The application utilizes an efficient, **3-stage Docker Multi-Stage Build** system. It compiles the Angular frontend, transfers the compiled assets to the Spring Boot static resources folder to build a unified executable JAR, and finally deploys a minimized JRE runtime image to reduce attack surfaces and optimize image sizing.

```dockerfile
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

# Stage 3: Runtime
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

COPY --from=java-builder /app/build/libs/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]

```

---

## 🌐 API Endpoints & cURL Commands (Postman Ready)

These cURL commands can be imported directly into Postman (**File -> Import -> Raw text**).

> *Replace `localhost:8081` with your active environment host or your cluster's `<EXTERNAL-IP>.nip.io` when running integrations.*

### 1. Get All Tasks

Retrieves a complete list of all managed tasks.

```bash
curl --location --request GET 'http://localhost:8081/api/todos'

```

### 2. Get Pending Tasks Only

Filters and extracts only tasks that are uncompleted (`completed=false`).

```bash
curl --location --request GET 'http://localhost:8081/api/todos?completed=false'

```

### 3. Get Completed Tasks Only

Filters and extracts only tasks that are marked finished (`completed=true`).

```bash
curl --location --request GET 'http://localhost:8081/api/todos?completed=true'

```

### 4. Create / Add a New Task

Pushes a validated JSON payload to register a new task item within the backend datastore.

```bash
curl --location --request PUT 'http://localhost:8081/api/todos/todo/add' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Complete DevOps Assignment",
    "description": "Deploy Spring Boot and MySQL multi-tier app to GKE cluster",
    "completed": false
}'

```

### 5. Complete / Finish a Task

Updates the targeted task identity marker status to finished.

```bash
curl --location --request GET 'http://localhost:8081/api/todos/todo/1/finish'

```

### 6. Delete a Task

Removes the specified record entry out of the system permanently based on the path ID value.

```bash
curl --location --request DELETE 'http://localhost:8081/api/todos/todo/1/delete'

```

---

## 🛠️ Step-by-Step Deployment Guide

Follow these sequential steps to provision the infrastructure, execute initialization scripts, and deploy the entire multi-tier stack on Google Cloud Platform (GCP).

### Step 1: Cluster Provisioning & Authentication

First, create a Google Kubernetes Engine (GKE) cluster and authenticate your local `kubectl` context to manage it.

```bash
# 1. Create a 3-node GKE cluster in the us-central1-a zone
gcloud container clusters create todo-cluster \
    --zone us-central1-a \
    --num-nodes=3

# 2. Fetch credentials to configure kubectl
gcloud container clusters get-credentials todo-cluster --zone us-central1-a

```

### Step 2: Configure Environment & Database Tier

Deploy configuration objects and spin up the stateful database layer. Wait for the database instance to accept connections before running the schema initializer job.

```bash
# 1. Inject application credentials and environmental configurations
kubectl apply -f todo-secret.yaml
kubectl apply -f todo-configmap.yaml

# 2. Deploy the MySQL StatefulSet
kubectl apply -f mysql-statefulset.yaml

# 3. Monitor the database pod until it transitions to 'Running' and 'Ready'
kubectl get pods -w

# 4. Once mysql-0 is fully active, execute the database schema initialization job
kubectl apply -f mysql-init-job.yaml

# 5. Verify successful database creation via initialization logs
kubectl logs job/mysql-init-job

```

### Step 3: Deploy Application Backend

Once the database environment is fully seeded, deploy the Spring Boot microservice application.

```bash
# 1. Deploy the backend components (Deployments & Services)
kubectl apply -f todo-deployment.yaml

# 2. Verify all system components are up and running smoothly
kubectl get pods
kubectl get svc

# 3. Inspect backend service configurations
kubectl describe svc todo-service

```

### Step 4: Ingress Controller Setup & Routing

Set up the NGINX Ingress controller to route external traffic to your backend services using wildcards.

```bash
# 1. Establish the namespace and deploy the official NGINX Ingress Controller
kubectl create namespace ingress-nginx
kubectl apply -f [https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml](https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml)

# 2. Monitor deployment until the controller is active and assigned a public IP
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx

```

> 📝 **Action Required:** Copy the `EXTERNAL-IP` generated from the `ingress-nginx-controller` service above. Update the `host` key inside your `todo-ingress.yaml` configuration using the format: `<EXTERNAL-IP>.nip.io`.

```bash
# 3. Apply the configured ingress routing rules
kubectl apply -f todo-ingress.yaml

# 4. Validate and describe the live ingress resource
kubectl get ingress
kubectl describe ingress todo-ingress

```

---

## 🔄 Resilience & Lifecycle Verification Operations

The following workflows validate self-healing capabilities, zero-downtime rollouts, and persistent volume stability inside the cluster.

### A. Application Self-Healing Test

Verifies that the `ReplicaSet` controller automatically provisions replacements if an application instance encounters a sudden failure.

```bash
# Fetch active backend pods
kubectl get pods -l app=todo

# Evict/Delete a targeted application pod
kubectl delete pod <any-todo-pod-name>

# Observe the real-time recreation of a new replacement instance
kubectl get pods -l app=todo -w

```

### B. Zero-Downtime Rolling Update

Demonstrates seamless application upgrades using rolling deployment strategies without breaking service availability.

```bash
# Trigger an image upgrade to version 2 (v2)
kubectl set image deployment todo-deployment todo=sidhant97/todo:v2

# Track the progressive rollout execution status
kubectl rollout status deployment todo-deployment

# Monitor underlying pods as they transition continuously
kubectl get pods -l app=todo -w

```

### C. Stateful Database Resiliency Test

Verifies that database components recover identically without data loss after crashes, thanks to Persistent Volume Claims (`PVC`).

```bash
# Track active StatefulSet pods
kubectl get pod -l app=mysql

# Simulate database crash/eviction
kubectl delete pod mysql-0

# Confirm cluster auto-attaches historical volumes to the spinning pod
kubectl get pods -l app=mysql -w

```

---

## 👤 Developer Profile

* **Developer Name:** Sidhant Gupta
* **Email Contact:** guptasidhant1997@gmail.com
* **Contact Number:** +91-9996764596

```

```