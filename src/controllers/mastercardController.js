
const logger = require('../utils/logger');
const { MOCK_PAYMENT_SUCCESS } = require('../constants/config');

const maskCardNumber = (cardNumber) => {
  if (!cardNumber || cardNumber.length < 4) {
    return '****';
  }
  const lastFourDigits = cardNumber.slice(-4);
  return `****${lastFourDigits}`;
};

const validarTarjeta = (req, res) => {
  try {
    const { number, cvc } = req.body || {};
    const maskedCard = number ? maskCardNumber(number) : 'Unknown';

    // Log inicial de la validación
    logger.info(`Processing Mastercard payment validation with card: ${maskedCard}`);

    if (!number || !cvc) {
      logger.warn(`Invalid Mastercard request payload for card: ${maskedCard}`);
      return res.status(400).json({
        payment_status: "FAILED",
        description: "Request body must include number and cvc",
        reason_code: "BAD_REQUEST"
      });
    }

    // En un MVP estático, solo respondemos basado en la constante MOCK_PAYMENT_SUCCESS
    if (MOCK_PAYMENT_SUCCESS) {
      logger.info(`Payment validation successful for card: ${maskedCard}`);
      return res.status(200).json({
        payment_status: "OK",
        description: "Pago aprobado por Mastercard",
        auth_ref: "MC-9999"
      });
    } else {
      logger.warn(`Payment validation failed for card: ${maskedCard}`);
      return res.status(200).json({
        payment_status: "FAILED",
        description: "Fondos insuficientes o tarjeta inválida",
        reason_code: "DECLINED_MC"
      });
    }
  } catch (error) {
    logger.error(`Error validating Mastercard: ${error.message}`);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message
    });
  }
};

module.exports = {
  validarTarjeta
};
