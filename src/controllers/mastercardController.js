
const logger = require('../utils/logger');
const { MOCK_PAYMENT_SUCCESS } = require('../constants/config');

/**
 * Enmascara el número de tarjeta dejando solo los últimos 4 dígitos
 * @param {string} cardNumber - Número de tarjeta
 * @returns {string} Tarjeta enmascarada (ej: ****1234)
 */
const maskCardNumber = (cardNumber) => {
  if (!cardNumber || cardNumber.length < 4) {
    return '****';
  }
  const lastFourDigits = cardNumber.slice(-4);
  return `****${lastFourDigits}`;
};

/**
 * Valida una tarjeta de pago Mastercard
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const validarTarjeta = (req, res) => {
  try {
    const { cardNumber } = req.body;
    const maskedCard = cardNumber ? maskCardNumber(cardNumber) : 'Unknown';

    // Log inicial de la validación
    logger.info(`Processing Mastercard payment validation with card: ${maskedCard}`);

    // En un MVP estático, solo respondemos basado en la constante MOCK_PAYMENT_SUCCESS
    if (MOCK_PAYMENT_SUCCESS) {
      logger.info(`Payment validation successful for card: ${maskedCard}`);
      return res.status(200).json({
        success: true,
        mensaje: "Pago aprobado por Mastercard"
      });
    } else {
      logger.warn(`Invalid card detected: ${maskedCard}`);
      return res.status(400).json({
        success: false,
        mensaje: "Tarjeta inválida"
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
