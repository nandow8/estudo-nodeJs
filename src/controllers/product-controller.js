'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.get = (req, res, next) => {
    Product
        .find({})
        .then(data => {
            res.status(200).send(data);
        }).catch( e => {
            res.status(400).send(e);
        });
};

exports.post = (req, res, next) => {
    var product = new Product(req.body);
    //product.title = req.body.title;   posso passar um por um na hora de salvar
    product
       .save()
       .then( x => {
           res.status(201).send({ message: 'Produto salvo'});
       }).catch( e => {
           res.status(400).send({
                message: 'Produto salvo',
                data: e
           });
       });
}

exports.put = (req, res, next) => {
    const id = req.params.id;
    res.status(201).send({
        id: id,
        item: req.body
    }); 
};

exports.delete = (req, res, next) => {
    res.status(200).send(req.body); // req.body pega o corpo da requisição
};