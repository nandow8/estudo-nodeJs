'use strict';

const express = require('express'); 
const router = express.Router();
const controller = require('../controllers/product-controller');

const authService = require('../services/auth-service');
 
router.get('/', authService.authorize, controller.get); //bloqueia o acesso para quem nao está logado authService.authorize,
router.get('/:slug', controller.getBySlug);
router.get('/admin/:id', controller.getById);
router.get('/tags/:tag', controller.getByTag);
router.post('/', authService.isAdmin, controller.post); // so pode acessar quem for Admin
router.put('/:id', authService.isAdmin, controller.put); //put
router.delete('/:id', authService.isAdmin, controller.delete);
 

module.exports = router;