# Lab 7: API Gateway & Service Discovery

## Objective
This lab introduces an API Gateway to act as a single entry point for clients, configuring dynamic routes to the backend microservices using configuration-based service discovery, and preparing for cloud deployment.

## Architecture
```
Client / Postman -> API Gateway (Port 8080)
                     |-> User Service (Internal)
                     |-> Product Service (Internal)
                     |-> Order Service (Internal)
                          |-> MongoDB
```

## API Gateway Features
- **Routing**: Proxies `/users` to User Service, `/products` to Product Service, and `/orders` to Order Service.
- **Service Discovery**: Routes are built using environment variables (`USER_SERVICE_URL`, etc.) rather than hard-coded values.
- **Error Handling**: Graceful `503 Service Unavailable` returned when backend services are down.
- **Logging**: Morgan middleware is used for logging requests.
- **Health Check**: `GET /health` endpoint for monitoring gateway status.

## Discussion Questions

**Why introduce an API Gateway instead of letting clients call each service directly?**
An API Gateway provides a single, unified entry point for clients, abstracting away the internal microservice architecture. It handles cross-cutting concerns like logging, authentication, rate limiting, and centralized error handling (e.g., returning 502/503), preventing the client from dealing with multiple network requests or individual service failures.

**Static vs Dynamic Service Discovery**
Our static/config-based approach relies on environment variables mapped at startup. A dynamic service discovery (like Consul or Eureka) automatically registers and deregisters instances dynamically as they spin up or down. A dynamic registry supports auto-scaling and health checks, whereas static configs require manual updates or redeployments when locations change.

## Cloud Deployment
- **Platform**: Render / Railway / Fly.io (Can be deployed easily by linking GitHub).
- **Environment Variables**: Configure the `*_SERVICE_URL` and `MONGO_URI` to point to cloud-hosted services.
- **Exposed Port**: Only the API Gateway is exposed to the public internet.

## Reflection
Adding an API Gateway drastically simplified the client interaction since it only has to talk to one endpoint. Furthermore, containerizing and moving to the cloud taught me how to decouple services so that scaling, error handling, and deployment are more resilient and modular compared to the monolith built in previous labs.
