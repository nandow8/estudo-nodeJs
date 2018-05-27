'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

exports.post = async(req, res, next) => {
    
    let contract = new ValidationContract();

    contract.hasMinLen(req.body.name, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email,  'E-mail inválido');
    contract.hasMinLen(req.body.password, 3, 'O password deve conter pelo menos 6 caracteres');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            //password: md5(req.body.password) //hash de 35 caractere
            password: md5(req.body.password + global.SALT_KEY), //combina com hash la do arquivo config.js
            roles: ["user"]
        }); 

        emailService.send(
            req.body.email,
            'Bem Vindo ao Node Store curso',
             global.EMAIL_TMPL.replace('{0}',
             req.body.name)
        );

        res.status(201).send({
            message: 'Cliente cadastrado com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.authenticate = async(req, res, next) => {
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if (!customer) {
            res.status(404).send({
                message: 'Usuário ou senha inválidos'
            });
            return;
        }

        const token = await authService.generateToken({ //dados do usuario logado(é só acrescentar que aparece no "data.id")
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles //verifica se é admin ou user
        });

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}; 

exports.refreshToken = async(req, res, next) => {
    try {
        //as duas proximas linhas pegam os dados do usuario logado
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const customer = await repository.getById(data.id);

        if (!customer) {
            res.status(404).send({
                message: 'Cliente não encontrado'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};