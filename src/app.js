'use strict'

const express = require('express');
const config = require('./config');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

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


app.get('/inicio', function(req, res){
    res.sendFile(__dirname + '/inicio.html');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
      io.emit('chat message', msg);
    });
  });

http.listen(3100, function(){
    console.log('listening on *:3100');
});

module.exports = app;