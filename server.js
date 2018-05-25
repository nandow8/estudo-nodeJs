'use strict'

const http = require('http');
const debug = require('debug')('nodestr:server');
const express = require('express');

const app = express();
//const port = 3000; //nao manter porta 3000 no servidor
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
const router = express.Router();

const route = router.get('/', (req, res, next) => {
    res.status(200).send({
        title: "node api",
        version: "0.0.1"
    });
});

app.use('/', route);

server.listen(port);
server.on('error', onError);
console.log('API rodando na porta ', port);


function normalizePort(val){
    const port = parseInt(val, 10);

    if(isNaN(port)){ // se nao for um numero
        return val;
    }

    if(port >= 0){
        return port;
    }

    return false;
}

function onError(error){
    if(error.syscall !== 'listen'){
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch(error.code){
        case 'EACCES' :  //erro de permissao
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE': // erro de endereço em uso
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;    
    }
}