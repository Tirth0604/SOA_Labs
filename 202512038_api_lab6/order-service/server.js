const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/order_db';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';

mongoose.connect(MONGO_URI).then(() => console.log('Connected to DB')).catch(console.error);

const Schema = new mongoose.Schema({ userId: String, productId: String, quantity: Number });
const Model = mongoose.model('Order', Schema);

app.get('/orders', async (req, res) => {
    const data = await Model.find();
    res.json(data);
});

app.post('/orders', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        // Validate user
        await axios.get(`${USER_SERVICE_URL}/users/${userId}`);
        // Validate product
        await axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}`);
        
        const data = new Model(req.body);
        await data.save();
        res.status(201).json(data);
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return res.status(404).json({error: 'Invalid resource ID'});
        }
        res.status(503).json({error: 'Service unavailable'});
    }
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
