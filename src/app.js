'use strict'

const express = require('express');
const config = require('./config');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');

const indexRoute = require('./routes/index-route');
const productsRoute = require('./routes/products-route');
const customerRoute = require('./routes/customer-route');
const orderRoute = require('./routes/order-route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 
 
app.use('/', indexRoute);
app.use('/products', productsRoute); 
app.use('/customers', customerRoute); 
app.use('/orders', orderRoute); 

module.exports = app;