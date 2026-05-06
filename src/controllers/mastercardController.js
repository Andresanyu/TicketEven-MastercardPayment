
const { MOCK_PAYMENT_SUCCESS } = require('../constants/config');

/**
 * Valida una tarjeta de pago Mastercard
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const validarTarjeta = (req, res) => {
  try {
    // En un MVP estático, solo respondemos basado en la constante MOCK_PAYMENT_SUCCESS
    
    if (MOCK_PAYMENT_SUCCESS) {
      return res.status(200).json({
        success: true,
        mensaje: "Pago aprobado por Mastercard"
      });
    } else {
      return res.status(400).json({
        success: false,
        mensaje: "Tarjeta inválida"
      });
    }
  } catch (error) {
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
