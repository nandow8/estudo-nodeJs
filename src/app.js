'use strict'

const express = require('express');
const config = require('./config');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);
 
const Customer = require('./models/customer'); 
const Contato = require('./models/contato'); 

const indexRoute = require('./routes/index-route'); 
const customerRoute = require('./routes/customer-route'); 
const contatoRoute = require('./routes/contato-route'); 

app.use(bodyParser.json({
    limit: '5mb' //tamanho do arquivo mandado para o servidor (aumentar caso tenha upload de imagem)
}));
app.use(bodyParser.urlencoded({ extended: false })); 

// Habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
 
app.use('/', indexRoute); 
app.use('/customers', customerRoute);  
app.use('/contato', contatoRoute);  

module.exports = app;