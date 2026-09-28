# Lab 6: Microservices Decomposition

## Project Overview
This project decomposes the backend into three independently runnable microservices: User Service, Product Service, and Order Service.

## Service Boundaries & Responsibilities
- **User Service (Port 3001)**: Manages User resources (GET/POST/PUT/DELETE /users). Owns the `user_db`.
- **Product Service (Port 3002)**: Manages Product resources (GET/POST/PUT/DELETE /products). Owns the `product_db`.
- **Order Service (Port 3003)**: Manages Order resources (GET/POST /orders). Validates User and Product existence before creating an order. Owns the `order_db`.

## How to Run Independently
Each service can be run locally using:
```bash
npm install
node server.js
```

## Docker Compose
Run the entire microservices architecture with:
```bash
docker-compose up --build -d
```
All services are connected via a shared Docker network and use container names for communication (e.g., `http://user-service:3001`).

## Environment Variables
The application uses the following environment variables:
- `PORT`: Exposed port for the service.
- `MONGO_URI`: Connection string for the specific service's MongoDB database.
- `USER_SERVICE_URL` / `PRODUCT_SERVICE_URL`: Used by Order Service to reach dependencies.

## Inter-service Error Handling
The Order Service gracefully fails with a `404` or `503` status if the User or Product service is unavailable or returns invalid data.
