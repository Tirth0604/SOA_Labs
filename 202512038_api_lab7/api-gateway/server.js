const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 8080;

// Configuration-Based Service Discovery
const services = {
    '/users': process.env.USER_SERVICE_URL || 'http://user-service:3001',
    '/products': process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002',
    '/orders': process.env.ORDER_SERVICE_URL || 'http://order-service:3003'
};

// Logging
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'API Gateway is running' });
});

// Proxy and centralized error handling
const proxyOptions = (target) => ({
    target,
    changeOrigin: true,
    onError: (err, req, res) => {
        console.error(`Proxy Error: ${err.message}`);
        res.status(503).json({ error: 'Service Unavailable', message: 'Target service is unreachable' });
    }
});

Object.entries(services).forEach(([route, target]) => {
    app.use(route, createProxyMiddleware(proxyOptions(target)));
});

app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
