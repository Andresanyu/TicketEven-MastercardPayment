
const logger = require('../utils/logger');
const pool = require('../config/db');

const maskCardNumber = (cardNumber) => {
  if (!cardNumber || cardNumber.length < 4) {
    return '****';
  }
  const lastFourDigits = number.slice(-4);
  return `****${lastFourDigits}`;
};

/**
 * Valida una tarjeta de pago Mastercarda
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const validarTarjeta = async (req, res) => {
  try {
    const { number, cvc } = req.body || {};
    const maskedCard = number ? maskCardNumber(number) : 'Unknown';

    logger.info(`Processing Mastercard payment validation with card: ${maskedCard}`);

    if (!number || !cvc) {
      logger.warn(`Invalid Mastercard request payload for card: ${maskedCard}`);
      return res.status(400).json({
        error: 'Request body must include number and cvc'
      });
    }

    const query = `
      SELECT id, number, cvc, saldo, estado
      FROM tarjetas_mastercard
      WHERE number = $1 AND cvc = $2
      LIMIT 1
    `;

    const result = await pool.query(query, [number, cvc]);
    const tarjeta = result.rows[0];

    if (tarjeta && tarjeta.estado === 'activo') {
      logger.info(`Payment validation successful for card: ${maskedCard}`);
      return res.status(200).json({
        payment_status: 'OK',
        description: 'Pago aprobado por Mastercard',
        auth_ref: 'MC-9999'
      });
    }

    logger.warn(`Payment validation failed for card: ${maskedCard}`);
    return res.status(200).json({
      payment_status: 'FAILED',
      description: 'Fondos insuficientes o tarjeta inválida',
      reason_code: 'DECLINED_MC'
    });
  } catch (error) {
    logger.error(`Error validating Mastercard: ${error.message}`);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

module.exports = {
  validarTarjeta
};
