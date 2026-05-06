/**
 * Rutas para la API de Mastercard
 */

const express = require('express');
const router = express.Router();
const { validarTarjeta } = require('../controllers/mastercardController');

/**
 * POST /api/v1/mastercard/validar
 * Endpoint para validar una tarjeta de pago
 */
router.post('/validar', validarTarjeta);

module.exports = router;
