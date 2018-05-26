'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');

exports.get = (req, res, next) => {
    repository
        .get()
            .then(data => {
                res.status(200).send(data);
            }).catch( e => {
                res.status(400).send(e);
            });
};

exports.getBySlug = (req, res, next) => {
     repository
         .getBySlug(req.params.slug)
            .then(data => {
                res.status(200).send(data);
            }).catch( e => {
                res.status(400).send(e);
            });
};

exports.getById = (req, res, next) => {
    repository
        .getById(req.params.id)
            .then(data => {
                res.status(200).send(data);
            }).catch( e => {
                res.status(400).send(e);
            });
};

exports.getByTag = (req, res, next) => {
    repository
         .getByTag(req.params.tag)
            .then(data => {
                res.status(200).send(data);
            }).catch( e => {
                res.status(400).send(e);
            });
};

exports.post = (req, res, next) => {
    
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'A description deve conter pelo menos 3 caracteres');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    var product = new Product(req.body);
    //product.title = req.body.title;   posso passar um por um na hora de salvar
    repository
         .create(req.body)
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
    repository
        .update(req.params.id, req.body)
            .then( x => {
                res.status(200).send({
                    message: 'Produto atualizado com sucesso!'
                });
            }).catch( e => {
                res.status(400).send({
                    message: 'Falha ao atualizar produto',
                    data: e
                });
            });
};

exports.delete = (req, res, next) => {
    repository
        .delete(req.body.id) //ou posso passar body no lugar de params e nao excluir pela rota, mas pelo "post"
            .then( x => {
                res.status(200).send({
                    message: 'Produto removido com sucesso!'
                });
            }).catch( e => {
                res.status(400).send({
                    message: 'Falha ao remover produto',
                    data: e
                });
            });
};