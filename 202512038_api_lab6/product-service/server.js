const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/product_db';

mongoose.connect(MONGO_URI).then(() => console.log('Connected to DB')).catch(console.error);

const Schema = new mongoose.Schema({name: String, price: Number});
const Model = mongoose.model('Product', Schema);

app.get('/products', async (req, res) => {
    const data = await Model.find();
    res.json(data);
});

app.get('/products/:id', async (req, res) => {
    const data = await Model.findById(req.params.id);
    if (!data) return res.status(404).json({error: 'Not found'});
    res.json(data);
});

app.post('/products', async (req, res) => {
    const data = new Model(req.body);
    await data.save();
    res.status(201).json(data);
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
