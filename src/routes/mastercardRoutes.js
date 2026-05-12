const express = require('express');
const router = express.Router();
const { validarTarjeta } = require('../controllers/mastercardController');

router.post('/validar', validarTarjeta);

module.exports = router;
