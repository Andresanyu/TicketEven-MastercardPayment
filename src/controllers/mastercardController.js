
const logger = require('../utils/logger');
const pool = require('../config/db');

const maskCardNumber = (cardNumber) => {
  if (!cardNumber || cardNumber.length < 4) {
    return '****';
  }
  const lastFourDigits = cardNumber.slice(-4);
  return `****${lastFourDigits}`;
};

const sanitizeTransactionPayload = (payload = {}) => {
  const sanitizedPayload = { ...payload };

  if (sanitizedPayload.number) {
    sanitizedPayload.number = maskCardNumber(sanitizedPayload.number);
  }

  if (sanitizedPayload.cvc) {
    sanitizedPayload.cvc = '***';
  }

  return sanitizedPayload;
};

const logVisaResponse = (approved, motivoRechazo) => {
  logger.info(`[VISA -> PASARELA] Transacción resuelta por Visa. Respuesta: ${JSON.stringify({
    aprobado: approved,
    motivo_rechazo: motivoRechazo || null
  })}`);
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

    logger.info(`[VISA <- PASARELA] Transacción recibida por Visa. Payload: ${JSON.stringify(sanitizeTransactionPayload(req.body || {}))}`);

    if (!number || !cvc) {
      logger.warn(`Invalid Mastercard request payload for card: ${maskedCard}`);
      const responsePayload = {
        payment_status: 'FAILED',
        reason_code: 'INVALID_REQUEST',
        message: 'Request body must include number and cvc'
      };
      logVisaResponse(false, responsePayload.reason_code);
      return res.status(400).json({
        error: 'Request body must include number and cvc'
      });
    }

    const availabilityQuery = `
      SELECT id, number, cvc, saldo, estado
      FROM tarjetas_mastercard
      WHERE number = $1
      LIMIT 1
    `;

    const availabilityResult = await pool.query(availabilityQuery, [number]);
    const tarjeta = availabilityResult.rows[0];

    if (!tarjeta) {
      logger.warn(`Unregistered Mastercard client for card: ${maskedCard}`);
      logVisaResponse(false, 'UNREGISTERED_CLIENT');
      return res.status(200).json({
        payment_status: 'FAILED',
        reason_code: 'UNREGISTERED_CLIENT',
        message: 'Cliente no registrado en la red Mastercard'
      });
    }

    if (tarjeta.cvc === cvc && tarjeta.estado === 'activo') {
      logger.info(`Payment validation successful for card: ${maskedCard}`);
      logVisaResponse(true, null);
      return res.status(200).json({
        payment_status: 'OK',
        description: 'Pago aprobado por Mastercard',
        auth_ref: 'MC-9999'
      });
    }

    logger.warn(`Payment validation failed for card: ${maskedCard}`);
    logVisaResponse(false, 'DECLINED_MC');
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
