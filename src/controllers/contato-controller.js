'use strict';

const mongoose = require('mongoose');
const Contato = mongoose.model('Contato');
const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/contato-repository');
const emailService = require('../services/email-service');

exports.get = (req, res, next) => { 
    repository
        .get()
            .then(data => {
                res.status(200).send(data);
            }).catch( e => {
                res.status(400).send(e);
            });
};

exports.post = async(req, res, next) => {
 
    var contato = new Contato(req.body); 
      
    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        }); 
 
        emailService.send(
            'alvesfernandosantos1@gmail.com',
            'Bem Vindo ao Node Store curso',
             global.EMAIL_TMPL.replace('{0}',req.body.email + '<br/> ' + req.body.name + '<br/> ' + req.body.message), 
        );

        res.status(201).send({
            message: 'Cliente cadastrado com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição' + e
        });
    }
}